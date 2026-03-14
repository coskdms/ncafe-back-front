package com.newlecture.backend.order.adapter.in.web;

import com.newlecture.backend.admin.notification.application.service.SseNotificationService;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import com.newlecture.backend.order.application.service.OrderService;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.repository.OrderJpaRepository;
import com.newlecture.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 관리자용 주문 관리 컨트롤러 🐤📋
 */
@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;
    private final OrderJpaRepository orderRepository;
    private final MemberRepository memberRepository;
    private final SseNotificationService sseService;

    /**
     * 모든 주문 목록 조회
     */
    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * 주문 상태 변경 (PAID -> PREPARING -> COMPLETED 등)
     */
    @PatchMapping("/{paymentId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String paymentId, @RequestBody Map<String, String> payload) {
        try {
            String statusStr = payload.get("status");
            if (statusStr == null) {
                return ResponseEntity.status(400).body(Map.of("message", "상태값이 필요합니다."));
            }
            OrderStatus status = OrderStatus.valueOf(statusStr);
            orderService.updateOrderStatus(paymentId, status);

            // SSE: 해당 주문의 사용자에게 실시간 알림
            sendOrderStatusNotification(paymentId, status);

            return ResponseEntity.ok(Map.of("message", "주문 상태가 " + status + " 로 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("message", "올바르지 않은 상태값입니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * 관리자 권한으로 주문 취소
     */
    @PostMapping("/{paymentId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String paymentId) {
        try {
            orderService.adminCancelOrder(paymentId);

            // SSE: 사용자에게 취소 알림
            sendOrderStatusNotification(paymentId, OrderStatus.CANCELLED);

            return ResponseEntity.ok(Map.of("message", "관리자에 의해 주문이 취소되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * 주문 상태 변경 시 SSE 알림 발송 (nickname을 키로 사용)
     */
    private void sendOrderStatusNotification(String paymentId, OrderStatus status) {
        try {
            OrderJpaEntity order = orderRepository.findByPaymentId(paymentId).orElse(null);
            if (order != null && order.getMemberId() != null) {
                // memberId(UUID) → nickname으로 변환하여 SSE 키로 사용
                memberRepository.findById(order.getMemberId().toString())
                        .ifPresent(member -> {
                            String nickname = member.getNickname();
                            String message = getStatusMessage(status);

                            sseService.notifyUser(nickname, "order_status", Map.of(
                                    "paymentId", paymentId,
                                    "status", status.name(),
                                    "message", message
                            ));
                        });
            }
        } catch (Exception e) {
            // SSE 실패는 주문 처리에 영향주지 않도록
        }
    }

    private String getStatusMessage(OrderStatus status) {
        return switch (status) {
            case PREPARING -> "사장님이 메뉴를 준비 중이다덕! ☕🔥";
            case COMPLETED -> "주문이 완료되었다덕! 맛있게 드시라덕! 🎉";
            case CANCELLED -> "주문이 취소되었다덕... 😢";
            default -> "주문 상태가 변경되었다덕!";
        };
    }
}
