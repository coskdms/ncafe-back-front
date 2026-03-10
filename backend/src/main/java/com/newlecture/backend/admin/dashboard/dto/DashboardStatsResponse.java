package com.newlecture.backend.admin.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardStatsResponse {
    private long todayOrderCount;
    private long totalMenuCount;
    private long soldOutMenuCount;
    private long todaySales;
}
