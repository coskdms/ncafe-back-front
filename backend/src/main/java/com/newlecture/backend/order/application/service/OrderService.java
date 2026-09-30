package com.newlecture.backend.order.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.service.MemberService;
import com.newlecture.backend.admin.notification.application.service.NotificationService;
import com.newlecture.backend.admin.notification.application.service.SseNotificationService;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuOptionGroupJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuOptionDetailJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuOptionGroupJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuOptionDetailJpaRepository;
import com.newlecture.backend.admin.setting.adapter.out.persistence.entity.ShopSettingJpaEntity;
import com.newlecture.backend.admin.setting.adapter.out.persistence.repository.ShopSettingJpaRepository;

import com.newlecture.backend.order.adapter.in.web.dto.OrderCreateRequest;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderItemJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.repository.OrderJpaRepository;
import com.newlecture.backend.order.domain.OrderStatus;
import com.newlecture.backend.order.domain.OrderType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderJpaRepository orderRepository;
    private final MemberRepository memberRepository;
    private final MemberService memberService;
    private final NotificationService notificationService;
    private final SseNotificationService sseNotificationService;
    private final PortOneService portOneService;

    // 서버 측 가격 재계산에 필요한 저장소 (클라이언트가 보낸 가격을 신뢰하지 않기 위함)
    private final AdminMenuJpaRepository menuRepository;
    private final AdminMenuOptionGroupJpaRepository optionGroupRepository;
    private final AdminMenuOptionDetailJpaRepository optionDetailRepository;
    private final ShopSettingJpaRepository shopSettingRepository;

    private final ObjectMapper objectMapper;

    // 비회원 기본 배달비 (매장 설정이 없을 때의 폴백)
    private static final int DEFAULT_DELIVERY_FEE = 3000;

    // 방어적 입력 한도
    private static final int MAX_QUANTITY_PER_ITEM = 999;
    private static final long MAX_ORDER_AMOUNT = 100_000_000L; // 1억원


    public OrderJpaEntity getOrderByPaymentId(String paymentId) {
        return orderRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));
    }

    public List<OrderJpaEntity> getMyOrders() {
        String nickname = SecurityContextHolder.getContext().getAuthentication().getName();
        return memberRepository.findByNickname(nickname)
                .map(member -> orderRepository.findAllByMemberIdOrderByCreatedAtDesc(UUID.fromString(member.getId())))
                .orElse(List.of());
    }

    /**
     * 결제 완료 처리
     *
     * ★ 보안: 무조건 PAID로 바꾸지 않고, PortOne에 실제 결제 내역을 조회하여
     *   결제 상태(PAID)와 실결제 금액이 서버가 계산한 주문 금액과 일치할 때만 확정한다.
     *   (0원 주문 = 포인트 전액 결제 등은 PortOne 결제가 없으므로 검증을 생략한다.)
     */
    public void completeOrder(String paymentId) {
        OrderJpaEntity order = orderRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        // PENDING → PAID 전환만 허용. 이미 PAID/PREPARING/COMPLETED/CANCELLED라면 아무것도 하지 않음.
        if (order.getStatus() != OrderStatus.PENDING) return;

        int expectedAmount = order.getTotalPrice() != null ? order.getTotalPrice() : 0;

        // 실결제가 있는 주문만 PortOne 검증 (0원 주문은 결제 자체가 없음)
        if (expectedAmount > 0) {
            PortOneService.PaymentInfo payment = portOneService.getPayment(paymentId);

            boolean paid = payment != null && "PAID".equalsIgnoreCase(payment.status());
            boolean amountMatches = payment != null && payment.totalAmount() == expectedAmount;

            if (!paid || !amountMatches) {
                log.warn("[결제검증 실패] paymentId={}, expected={}, actualStatus={}, actualAmount={}",
                        paymentId, expectedAmount,
                        payment != null ? payment.status() : "null",
                        payment != null ? payment.totalAmount() : "null");
                // ★ 예외를 던지면 클래스 레벨 @Transactional에 의해 이 FAILED 저장까지 롤백된다.
                //   따라서 throw 대신 FAILED로 확정하고 정상 반환하여 상태가 커밋되도록 한다.
                order.setStatus(OrderStatus.FAILED);
                orderRepository.save(order);
                return;
            }
        }

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        // [변경] 여기서 포인트를 지급하지 않습니다. (어뷰징 방지)
        // 나중에 사장님이 '수령 완료' 처리를 할 때 지급됩니다.


        // 새 주문 알림 생성 🔔
        String orderSummary = order.getItems().get(0).getKorName() + (order.getItems().size() > 1 ? " 외 " + (order.getItems().size() - 1) + "건" : "");
        notificationService.createNotification(
            "NEW_ORDER", 
            "새 주문 접수 ☕", 
            orderSummary + " / ₩" + String.format("%,d", order.getTotalPrice()), 
            "/admin/orders"
        );

        // SSE: 관리자들에게 실시간 알림 📡
        try {
            sseNotificationService.notifyAdmins("new_order", java.util.Map.of(
                "paymentId", paymentId,
                "summary", orderSummary,
                "totalPrice", order.getTotalPrice(),
                "message", "새 주문이 들어왔다덕! 🐤 " + orderSummary
            ));
        } catch (Exception e) {
            // SSE 실패는 주문 처리에 영향 없음
        }
    }


    /**
     * 주문 취소
     */
    public void cancelOrder(String paymentId) {
        OrderJpaEntity order = orderRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("이미 취소된 주문입니다.");
        }

        // 권한 확인: 로그인한 사용자의 주문인지 체크
        String nickname = SecurityContextHolder.getContext().getAuthentication().getName();
        if (order.getMemberId() != null) {
            memberRepository.findByNickname(nickname)
                    .ifPresent(member -> {
                        if (!member.getId().equals(order.getMemberId().toString())) {
                            throw new RuntimeException("본인의 주문만 취소할 수 있습니다.");
                        }
                    });
        }

        // 시간 제한 확인: 주문 후 24시간 이내만 취소 가능 (테스트 및 시차 보정 위해 연장)
        if (order.getCreatedAt() != null && order.getCreatedAt().isBefore(LocalDateTime.now().minusHours(24))) {
            throw new RuntimeException("주문 후 24시간이 경과하여 취소가 불가능합니다. 매장으로 문의해주세요.");
        }

        // 결제가 완료된 주문인 경우 (작업 예정)환불 요청
        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.PREPARING || order.getStatus() == OrderStatus.COMPLETED) {
            // 이미 포인트가 지급된 상태라면 회수 (관리자가 COMPLETED 취소 시 대비)
            if (Boolean.TRUE.equals(order.getPointsAwarded()) && order.getMemberId() != null) {
                memberRepository.findById(order.getMemberId().toString())
                        .ifPresent(member -> {
                            memberService.revokePoints(member.getNickname(), order.getTotalPrice());
                        });
                order.setPointsAwarded(false);
            }
            
            // PortOne V2 API 환불 연동
            portOneService.cancelPayment(paymentId, "사용자 요청에 의한 취소");
        }


        // 사용했던 포인트 환불
        if (order.getUsedPoints() != null && order.getUsedPoints() > 0 && order.getMemberId() != null) {
            memberRepository.findById(order.getMemberId().toString())
                    .ifPresent(member -> {
                        memberService.refundPoints(member.getNickname(), order.getUsedPoints());
                    });
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        // 주문 취소 알림 생성 🔔
        notificationService.createNotification(
            "ORDER_STATUS", 
            "주문 취소 알림 🛑", 
            "주문 #" + paymentId + " 가 사용자에 의해 취소되었습니다.", 
            "/admin/orders"
        );
    }


    public OrderJpaEntity createOrder(OrderCreateRequest request) {
        // ★ 입력 검증: 빈/누락 항목은 이후 completeOrder의 items.get(0) 등에서 크래시를 유발하므로 선제 차단
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("주문 항목이 비어 있습니다.");
        }

        String nickname = SecurityContextHolder.getContext().getAuthentication().getName();
        UUID memberId = null;

        if (nickname != null && !"anonymousUser".equals(nickname)) {
            memberId = memberRepository.findByNickname(nickname)
                    .map(Member::getId)
                    .map(UUID::fromString)
                    .orElse(null);
        }

        // 포트원 V2 paymentId 생성
        String paymentId = "order-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + "-" + ThreadLocalRandom.current().nextInt(100000, 999999);

        // ★ 보안: 클라이언트가 보낸 item.price를 신뢰하지 않고,
        //   DB의 메뉴 기본가 + 옵션 추가금으로 서버가 직접 단가를 계산한다.
        //   금액은 int 곱셈 오버플로우를 막기 위해 long으로 누적하고 상한을 검증한다.
        List<Integer> unitPrices = new ArrayList<>();
        long subtotal = 0L;
        for (var itemReq : request.getItems()) {
            if (itemReq.getMenuId() == null) {
                throw new IllegalArgumentException("메뉴 ID가 누락되었습니다.");
            }
            Integer qty = itemReq.getQuantity();
            if (qty == null || qty < 1 || qty > MAX_QUANTITY_PER_ITEM) {
                throw new IllegalArgumentException("수량은 1~" + MAX_QUANTITY_PER_ITEM + " 사이여야 합니다: " + qty);
            }
            MenuJpaEntity menu = menuRepository.findById(itemReq.getMenuId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 메뉴입니다: " + itemReq.getMenuId()));
            if (Boolean.FALSE.equals(menu.getIsAvailable())) {
                throw new IllegalStateException("품절된 메뉴는 주문할 수 없습니다: " + menu.getKorName());
            }
            int base = menu.getPrice() != null ? menu.getPrice() : 0;
            int unitPrice = base + calcOptionsPrice(itemReq.getMenuId(), itemReq.getOptions());
            unitPrices.add(unitPrice);
            subtotal += (long) unitPrice * qty; // long 누적 → 오버플로우 방지
        }
        if (subtotal > MAX_ORDER_AMOUNT) {
            throw new IllegalStateException("주문 금액이 허용 한도를 초과했습니다.");
        }

        int totalPrice = (int) subtotal;

        // 배달비: 비회원 배달 주문만 부과 (회원은 무료)
        if (memberId == null && request.getType() == OrderType.DELIVERY) {
            totalPrice += resolveDeliveryFee();
        }

        // 멤버십 등급별 즉시 할인 적용 🎁
        int membershipDiscount = 0;
        if (memberId != null) {
            Member member = memberRepository.findByNickname(nickname)
                .orElse(null);
            if (member != null) {
                membershipDiscount = member.getImmediateDiscount();
                if (membershipDiscount > 0) {
                    totalPrice = Math.max(0, totalPrice - membershipDiscount);
                    log.info("[OrderService] 멤버십 할인 적용: {}원 ({})", membershipDiscount, nickname);
                }
            }
        }


        // 포인트 사용 처리
        int usedPoints = 0;
        if (memberId != null && request.getUsedPoints() != null && request.getUsedPoints() > 0) {
            // 멤버십 할인이 적용된 후의 남은 금액(totalPrice)만큼만 포인트 사용 가능하도록 제한
            usedPoints = Math.min(request.getUsedPoints(), totalPrice);
            memberService.usePoints(nickname, usedPoints);
            totalPrice = Math.max(0, totalPrice - usedPoints);
        }


        OrderJpaEntity order = OrderJpaEntity.builder()
                .paymentId(paymentId)
                .memberId(memberId)
                .totalPrice(totalPrice)
                .usedPoints(usedPoints)
                .status(OrderStatus.PENDING)
                .type(request.getType() != null ? request.getType() : OrderType.DELIVERY)
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .address(request.getAddress())
                .memo(request.getMemo())
                .build();

        int idx = 0;
        for (var itemReq : request.getItems()) {
            String optionsJson = "{}";
            try {
                if (itemReq.getOptions() != null) {
                    optionsJson = objectMapper.writeValueAsString(itemReq.getOptions());
                }
            } catch (Exception e) {}

            OrderItemJpaEntity item = OrderItemJpaEntity.builder()
                    .menuId(itemReq.getMenuId())
                    .korName(itemReq.getKorName())
                    .price(unitPrices.get(idx++)) // ★ 서버가 계산한 단가 저장 (클라이언트 값 무시)
                    .quantity(itemReq.getQuantity())
                    .options(optionsJson)
                    .build();
            order.addItem(item);
        }

        OrderJpaEntity savedOrder = orderRepository.save(order);

        // 💰 포인트로 전액 결제된 경우 (0원 주문) 즉시 완료 처리
        if (totalPrice == 0) {
            // completeOrder 내부에서 상태 변경, 포인트 적립(금액0이므로 실물적립은 없겠지만 로직 유지), 알림 생성이 진행됨
            completeOrder(savedOrder.getPaymentId());
            return orderRepository.save(savedOrder); // 갱신된 상태 반영
        }

        return savedOrder;
    }


    /**
     * 관리자용: 모든 주문 조회
     */
    public List<OrderJpaEntity> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * 관리자용: 주문 상태 변경
     */
    public void updateOrderStatus(String paymentId, OrderStatus status) {
        OrderJpaEntity order = orderRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));
        
        order.setStatus(status);
        
        // 💰 수령 완료 시점에 포인트 지급 (중복 지급 방지 포함)
        if (status == OrderStatus.COMPLETED && !Boolean.TRUE.equals(order.getPointsAwarded())) {
            if (order.getMemberId() != null) {
                memberRepository.findById(order.getMemberId().toString())
                        .ifPresent(member -> {
                            memberService.addPoints(member.getNickname(), order.getTotalPrice());
                            order.setPointsAwarded(true);
                        });
            }
        }

        orderRepository.save(order);


        // 주문 상태 변경 알림 생성 🔔
        String statusLabel = getStatusLabel(status);
        notificationService.createNotification(
            "ORDER_STATUS", 
            "주문 상태 변경 🔄", 
            "주문 #" + paymentId + " 의 상태가 [" + statusLabel + "] 로 변경되었습니다.", 
            "/admin/orders"
        );
    }

    private String getStatusLabel(OrderStatus status) {
        switch (status) {
            case PENDING: return "결제 대기";
            case PAID: return "결제 완료";
            case PREPARING: return "준비 중";
            case COMPLETED: return "수령 완료";
            case CANCELLED: return "취소됨";
            case FAILED: return "결제 실패";
            default: return status.name();

        }
    }


    /**
     * 관리자용: 주문 취소 (강제 취소 포함)
     */
    public void adminCancelOrder(String paymentId) {
        OrderJpaEntity order = orderRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        // 관리자는 시간 제한 없이 취소 가능하도록 처리
        
        // 결제가 완료된 주문인 경우 포인트 회수 및 환불 요청
        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.PREPARING || order.getStatus() == OrderStatus.COMPLETED) {
            // 이미 포인트가 지급된 상태라면 회수
            if (Boolean.TRUE.equals(order.getPointsAwarded()) && order.getMemberId() != null) {
                memberRepository.findById(order.getMemberId().toString())
                        .ifPresent(member -> {
                            memberService.revokePoints(member.getNickname(), order.getTotalPrice());
                        });
                order.setPointsAwarded(false);
            }
            // PortOne V2 API 환불 연동
            portOneService.cancelPayment(paymentId, "관리자에 의한 취소");
        }


        // 사용했던 포인트 환불
        if (order.getUsedPoints() != null && order.getUsedPoints() > 0 && order.getMemberId() != null) {
            memberRepository.findById(order.getMemberId().toString())
                    .ifPresent(member -> {
                        memberService.refundPoints(member.getNickname(), order.getUsedPoints());
                    });
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        // 관리자에 의한 주문 취소 알림 생성 🔔
        notificationService.createNotification(
            "ORDER_STATUS", 
            "주문 취소 알림 (관리자) 🛑", 
            "주문 #" + paymentId + " 가 관리자에 의해 취소되었습니다.", 
            "/admin/orders"
        );
    }


    /**
     * 🕒 자동 취소 스케줄러: 15분 동안 결제되지 않은 '결제 대기' 주문을 취소 처리합니다.
     * 1분마다 실행됩니다.
     */
    @Scheduled(fixedRate = 60000)
    public void cancelOldPendingOrders() {
        LocalDateTime timeout = LocalDateTime.now().minusMinutes(15);
        List<OrderJpaEntity> oldOrders = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING, timeout);

        for (OrderJpaEntity order : oldOrders) {
            System.out.println("⏳ [자동 시스템] 15분 초과 결제 미완료 주문 취소: #" + order.getPaymentId());
            
            // 사용했던 포인트 환불 (PENDING 시점에 이미 차감되었으므로 환불 필수)
            if (order.getUsedPoints() != null && order.getUsedPoints() > 0 && order.getMemberId() != null) {
                memberRepository.findById(order.getMemberId().toString())
                        .ifPresent(member -> {
                            memberService.refundPoints(member.getNickname(), order.getUsedPoints());
                        });
            }

            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        }
    }

    /**
     * 메뉴의 옵션 선택값에 해당하는 추가 금액 합계를 DB에서 조회해 계산한다.
     * options = { 그룹명 → 선택한 옵션명 } (다중 선택은 콤마로 구분될 수 있음)
     */
    private int calcOptionsPrice(Long menuId, Map<String, String> options) {
        if (options == null || options.isEmpty()) return 0;

        List<MenuOptionGroupJpaEntity> groups = optionGroupRepository.findAllByMenuIdOrderBySortOrderAsc(menuId);
        if (groups.isEmpty()) return 0;

        List<Long> groupIds = groups.stream().map(MenuOptionGroupJpaEntity::getId).toList();
        List<MenuOptionDetailJpaEntity> details = optionDetailRepository.findAllByOptionGroupIdInOrderBySortOrderAsc(groupIds);

        // 옵션 상세명 → 추가금액 매핑
        Map<String, Integer> priceByName = new HashMap<>();
        for (MenuOptionDetailJpaEntity d : details) {
            priceByName.put(d.getName(), d.getAdditionalPrice() != null ? d.getAdditionalPrice() : 0);
        }

        int sum = 0;
        for (String value : options.values()) {
            if (value == null || value.isBlank()) continue;
            for (String part : value.split(",")) {
                Integer p = priceByName.get(part.trim());
                if (p != null) {
                    sum += p;
                } else {
                    log.warn("[OrderService] 알 수 없는 옵션값(추가금 0 처리): menuId={}, option='{}'", menuId, part.trim());
                }
            }
        }
        return sum;
    }

    /**
     * 매장 설정의 배달비를 반환한다. 설정이 없으면 기본값(3000)을 사용한다.
     */
    private int resolveDeliveryFee() {
        ShopSettingJpaEntity setting = shopSettingRepository.findById(1L).orElse(null);
        if (setting != null && setting.getDeliveryFee() != null) {
            return setting.getDeliveryFee();
        }
        return DEFAULT_DELIVERY_FEE;
    }
}
