package com.newlecture.backend.order.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.service.MemberService;
import com.newlecture.backend.admin.notification.application.service.NotificationService;

import com.newlecture.backend.order.adapter.in.web.dto.OrderCreateRequest;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderItemJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.repository.OrderJpaRepository;
import com.newlecture.backend.order.domain.OrderStatus;
import com.newlecture.backend.order.domain.OrderType;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderJpaRepository orderRepository;
    private final MemberRepository memberRepository;
    private final MemberService memberService;
    private final NotificationService notificationService;
    private final PortOneService portOneService;

    private final ObjectMapper objectMapper;


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
     */
    public void completeOrder(String paymentId) {
        OrderJpaEntity order = orderRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        if (order.getStatus() == OrderStatus.PAID) return; // 이미 처리됨

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

        int totalPrice = request.getItems().stream()
                .mapToInt(item -> item.getPrice() * item.getQuantity())
                .sum();
        
        if (memberId == null && request.getType() == OrderType.DELIVERY) {
            totalPrice += 3000;
        }

        // 포인트 사용 처리
        int usedPoints = 0;
        if (memberId != null && request.getUsedPoints() != null && request.getUsedPoints() > 0) {
            usedPoints = request.getUsedPoints();
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
                    .price(itemReq.getPrice())
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
}
