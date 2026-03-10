package com.newlecture.backend.admin.dashboard.application.service;

import com.newlecture.backend.admin.dashboard.dto.DashboardStatsResponse;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuJpaRepository;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.repository.OrderJpaRepository;
import com.newlecture.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final OrderJpaRepository orderRepository;
    private final AdminMenuJpaRepository menuRepository;

    public DashboardStatsResponse getStats() {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        // 오늘 주문건수 (PAID, PREPARING, COMPLETED 상태만 포함)
        List<OrderJpaEntity> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        
        long todayOrderCount = allOrders.stream()
                .filter(o -> o.getCreatedAt().isAfter(startOfDay) && o.getCreatedAt().isBefore(endOfDay))
                .filter(o -> o.getStatus() == OrderStatus.PAID || o.getStatus() == OrderStatus.PREPARING || o.getStatus() == OrderStatus.COMPLETED)
                .count();

        // 오늘 매출액
        long todaySales = allOrders.stream()
                .filter(o -> o.getCreatedAt().isAfter(startOfDay) && o.getCreatedAt().isBefore(endOfDay))
                .filter(o -> o.getStatus() == OrderStatus.PAID || o.getStatus() == OrderStatus.PREPARING || o.getStatus() == OrderStatus.COMPLETED)
                .mapToLong(OrderJpaEntity::getTotalPrice)
                .sum();

        // 총 메뉴 수
        long totalMenuCount = menuRepository.count();

        // 품절 메뉴 수 (isAvailable 이 false인 경우를 품절로 간주)
        // 참고: AdminMenuQueryService에서는 isSoldOut을 false로 하드코딩 중이므로, 
        // 실질적으로 관리가 가능한 isAvailable을 기준으로 집계합니다.
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
