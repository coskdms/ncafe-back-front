package com.newlecture.backend.admin.menu.application.port.in.result;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 이미지 항목 결과
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImageItemResult {
    private Long id;
    private Long menuId;
    private String srcUrl;
    private String altText;
    private Integer sortOrder;
}
