package com.newlecture.backend.admin.menu.application.port.in.result;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 목록 항목 결과
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResult {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private String categoryName;
    private String imagesSrc;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
