package com.newlecture.backend.order.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.order.adapter.in.web.dto.OrderCreateRequest;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderItemJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.repository.OrderJpaRepository;
import com.newlecture.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderJpaRepository orderRepository;
    private final MemberRepository memberRepository;
    private final ObjectMapper objectMapper;

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
        
        if (memberId == null) {
            totalPrice += 3000;
        }

        OrderJpaEntity order = OrderJpaEntity.builder()
                .paymentId(paymentId)
                .memberId(memberId)
                .totalPrice(totalPrice)
                .status(OrderStatus.PENDING)
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
}
