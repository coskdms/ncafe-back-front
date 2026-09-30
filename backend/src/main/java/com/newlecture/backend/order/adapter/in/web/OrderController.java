package com.newlecture.backend.order.adapter.in.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.newlecture.backend.order.adapter.in.web.dto.OrderCreateRequest;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.application.service.OrderService;
import com.newlecture.backend.order.application.service.PortOneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PortOneService portOneService;
    private final ObjectMapper objectMapper;

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

    /**
     * 주문 조회 (순수 조회 - 상태 변경 부작용 없음)
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getOrder(@PathVariable String paymentId) {
        try {
            return ResponseEntity.ok(orderService.getOrderByPaymentId(paymentId));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * 결제 완료 확정 (PortOne 실결제 검증 후에만 PAID 처리)
     * 결제 성공 리다이렉트 페이지에서 호출한다.
     */
    @PostMapping("/{paymentId}/complete")
    public ResponseEntity<?> completeOrder(@PathVariable String paymentId) {
        try {
            orderService.completeOrder(paymentId);
            return ResponseEntity.ok(orderService.getOrderByPaymentId(paymentId));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * PortOne V2 웹훅 수신 (★ 서명 검증 후에만 처리)
     * 원본 바디로 서명을 검증해야 하므로 String으로 수신한다.
     */
    @PostMapping("/webhook")
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> handleWebhook(@RequestBody(required = false) String rawBody,
                                           @RequestHeader HttpHeaders headers) {
        if (!portOneService.verifyWebhook(rawBody, headers)) {
            log.warn("❌ 웹훅 서명 검증 실패 - 요청 거부");
            return ResponseEntity.status(401).body(Map.of("message", "invalid signature"));
        }

        try {
            Map<String, Object> payload = objectMapper.readValue(rawBody, Map.class);
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            if (data != null && data.containsKey("payment_id")) {
                String paymentId = (String) data.get("payment_id");
                orderService.completeOrder(paymentId);
                log.info("✅ 웹훅 주문 완료 처리 성공: {}", paymentId);
            }
        } catch (Exception e) {
            log.error("❌ 웹훅 처리 중 오류 발생: {}", e.getMessage());
        }

        return ResponseEntity.ok().build();
    }
}
