package com.newlecture.backend.order.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.service.MemberService;
import com.newlecture.backend.order.adapter.in.web.dto.OrderCreateRequest;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderItemJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.repository.OrderJpaRepository;
import com.newlecture.backend.order.domain.OrderStatus;
import com.newlecture.backend.order.domain.OrderType;
import lombok.RequiredArgsConstructor;
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

        // 회원 주문인 경우 포인트 적립
        if (order.getMemberId() != null) {
            memberRepository.findById(order.getMemberId().toString())
                    .ifPresent(member -> {
                        memberService.addPoints(member.getNickname(), order.getTotalPrice());
                    });
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

        // 결제가 완료된 주문인 경우 포인트 회수 및 (작업 예정)환불 요청
        if (order.getStatus() == OrderStatus.PAID) {
            if (order.getMemberId() != null) {
                memberRepository.findById(order.getMemberId().toString())
                        .ifPresent(member -> {
                            memberService.revokePoints(member.getNickname(), order.getTotalPrice());
                        });
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

        return orderRepository.save(order);
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
        orderRepository.save(order);
    }

    /**
     * 관리자용: 주문 취소 (강제 취소 포함)
     */
    public void adminCancelOrder(String paymentId) {
        OrderJpaEntity order = orderRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        // 관리자는 시간 제한 없이 취소 가능하도록 처리
        
        // 결제가 완료된 주문인 경우 포인트 회수 및 환불 요청
        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.PREPARING) {
            if (order.getMemberId() != null) {
                memberRepository.findById(order.getMemberId().toString())
                        .ifPresent(member -> {
                            memberService.revokePoints(member.getNickname(), order.getTotalPrice());
                        });
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
    }
}
