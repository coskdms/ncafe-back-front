package com.newlecture.backend.admin.dashboard.application.service;

import com.newlecture.backend.admin.dashboard.dto.DashboardStatsResponse;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuJpaRepository;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.repository.OrderJpaRepository;
import com.newlecture.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final OrderJpaRepository orderRepository;
    private final AdminMenuJpaRepository menuRepository;

    // 한국 표준시 (Docker 컨테이너가 UTC로 동작해도 올바른 날짜 계산)
    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    public DashboardStatsResponse getStats() {
        // KST 기준 오늘의 시작과 끝
        LocalDateTime startOfDay = LocalDate.now(KST).atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now(KST).atTime(LocalTime.MAX);

        // 오늘 주문건수 (PAID, PREPARING, COMPLETED 상태만 포함)
        List<OrderJpaEntity> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        
        long todayOrderCount = allOrders.stream()
                .filter(o -> !o.getCreatedAt().isBefore(startOfDay) && !o.getCreatedAt().isAfter(endOfDay))
                .filter(o -> o.getStatus() == OrderStatus.PAID || o.getStatus() == OrderStatus.PREPARING || o.getStatus() == OrderStatus.COMPLETED)
                .count();

        // 오늘 매출액
        long todaySales = allOrders.stream()
                .filter(o -> !o.getCreatedAt().isBefore(startOfDay) && !o.getCreatedAt().isAfter(endOfDay))
                .filter(o -> o.getStatus() == OrderStatus.PAID || o.getStatus() == OrderStatus.PREPARING || o.getStatus() == OrderStatus.COMPLETED)
                .mapToLong(OrderJpaEntity::getTotalPrice)
                .sum();

        // 총 메뉴 수
        long totalMenuCount = menuRepository.count();

        // 품절 메뉴 수
        long soldOutMenuCount = menuRepository.findAll().stream()
                .filter(m -> m.getIsAvailable() != null && !m.getIsAvailable())
                .count();

        return DashboardStatsResponse.builder()
                .todayOrderCount(todayOrderCount)
                .totalMenuCount(totalMenuCount)
                .soldOutMenuCount(soldOutMenuCount)
                .todaySales(todaySales)
                .build();
    }
}
