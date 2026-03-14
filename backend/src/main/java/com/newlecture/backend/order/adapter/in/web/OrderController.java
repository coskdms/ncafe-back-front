package com.newlecture.backend.order.adapter.in.web;

import com.newlecture.backend.order.adapter.in.web.dto.OrderCreateRequest;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.application.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderCreateRequest request) {
        try {
            OrderJpaEntity order = orderService.createOrder(request);
            return ResponseEntity.ok(Map.of(
                "paymentId", order.getPaymentId(),
                "totalPrice", order.getTotalPrice()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/mine")
    public ResponseEntity<?> getMyOrders() {
        try {
            return ResponseEntity.ok(orderService.getMyOrders());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{paymentId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String paymentId) {
        try {
            orderService.cancelOrder(paymentId);
            return ResponseEntity.ok(Map.of("message", "주문이 취소되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getOrder(@PathVariable String paymentId) {
        try {
            // PENDING 상태인 경우에만 completeOrder를 시도합니다.
            // (이미 PAID/PREPARING/COMPLETED인 주문을 다시 PAID로 되돌리지 않도록)
            var order = orderService.getOrderByPaymentId(paymentId);
            if (order.getStatus() == com.newlecture.backend.order.domain.OrderStatus.PENDING) {
                orderService.completeOrder(paymentId);
                // completeOrder 후 갱신된 데이터를 다시 조회
                order = orderService.getOrderByPaymentId(paymentId);
            }
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> payload) {
        System.out.println("Received V2 Webhook: " + payload);
        
        try {
            // PortOne V2 웹훅 페이로드에서 payment_id 추출
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            if (data != null && data.containsKey("payment_id")) {
                String paymentId = (String) data.get("payment_id");
                orderService.completeOrder(paymentId);
                System.out.println("✅ 주문 완료 처리 성공: " + paymentId);
            }
        } catch (Exception e) {
            System.err.println("❌ 웹훅 처리 중 오류 발생: " + e.getMessage());
        }

        return ResponseEntity.ok().build();
    }
}
