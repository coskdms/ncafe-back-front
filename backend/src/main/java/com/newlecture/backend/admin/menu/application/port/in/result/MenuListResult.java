package com.newlecture.backend.admin.menu.application.port.in.result;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 목록 조회 결과
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuListResult {
    private List<MenuItemResult> menus;
    private int totalCount;
}
