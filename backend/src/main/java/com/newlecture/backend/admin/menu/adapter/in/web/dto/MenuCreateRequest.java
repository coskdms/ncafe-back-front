package com.newlecture.backend.admin.menu.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuCreateRequest {
    private String korName;
    private String engName;
    private String description;
    private String price;
    private String categoryId;
    private String imageSrc;
    private Boolean isAvailable;
    private int sortOrder;
}
