package com.newlecture.backend.menu.application.port.in.result;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 고객 메뉴 목록 조회 결과
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerMenuListResult {
    private List<CustomerMenuItemResult> menus;
    private int totalCount;
}
