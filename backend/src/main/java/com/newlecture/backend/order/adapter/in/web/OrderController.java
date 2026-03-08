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

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> payload) {
        System.out.println("Received V2 Webhook: " + payload);
        return ResponseEntity.ok().build();
    }
}
