package com.newlecture.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuDetailResponse {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private String price;
    private String categoryId;
    private String categoryName;
    private String imageSrc;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private int sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
