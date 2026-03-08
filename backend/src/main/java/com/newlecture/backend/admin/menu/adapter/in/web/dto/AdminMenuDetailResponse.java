package com.newlecture.backend.admin.menu.adapter.in.web.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMenuDetailResponse {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private String price;
    private String categoryId;
    private String categoryName;
    private Boolean isAvailable;
    private java.util.List<com.newlecture.backend.admin.menu.application.port.in.result.MenuOptionGroupResult> optionGroups;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
