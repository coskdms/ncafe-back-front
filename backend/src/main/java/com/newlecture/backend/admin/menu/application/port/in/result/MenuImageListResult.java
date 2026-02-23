package com.newlecture.backend.admin.menu.application.port.in.result;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 이미지 목록 조회 결과
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImageListResult {
    private List<MenuImageItemResult> images;
}
