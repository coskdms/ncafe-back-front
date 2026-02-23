package com.newlecture.backend.admin.menu.application.port.in.result;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 상세 조회 결과
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuDetailResult {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private String categoryId;
    private String categoryName;
    private Boolean isAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
