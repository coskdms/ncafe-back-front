package com.newlecture.backend.admin.menu.application.port.in.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 목록 조회 커맨드
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetMenuListCommand {
    private Integer categoryId;
    private String searchQuery;
}
