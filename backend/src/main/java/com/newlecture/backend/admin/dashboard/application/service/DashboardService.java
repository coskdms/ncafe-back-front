package com.newlecture.backend.admin.dashboard.application.service;

import com.newlecture.backend.admin.dashboard.adapter.in.web.dto.DashboardStatsResponse;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuJpaRepository;
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

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");
    private static final List<OrderStatus> ACTIVE_STATUSES =
            List.of(OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.COMPLETED);

    public DashboardStatsResponse getStats() {
        LocalDateTime startOfDay = LocalDate.now(KST).atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now(KST).atTime(LocalTime.MAX);

        long todayOrderCount = orderRepository.countByCreatedAtBetweenAndStatusIn(startOfDay, endOfDay, ACTIVE_STATUSES);
        long todaySales = orderRepository.sumTotalPriceByCreatedAtBetweenAndStatusIn(startOfDay, endOfDay, ACTIVE_STATUSES);
        long totalMenuCount = menuRepository.count();
        long soldOutMenuCount = menuRepository.countByIsAvailableFalse();

        return DashboardStatsResponse.builder()
                .todayOrderCount(todayOrderCount)
                .totalMenuCount(totalMenuCount)
                .soldOutMenuCount(soldOutMenuCount)
                .todaySales(todaySales)
                .build();
    }
}
