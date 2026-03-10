package com.newlecture.backend.order.adapter.in.web;

import com.newlecture.backend.order.application.service.OrderService;
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
            return ResponseEntity.ok(Map.of("message", "관리자에 의해 주문이 취소되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }
}
