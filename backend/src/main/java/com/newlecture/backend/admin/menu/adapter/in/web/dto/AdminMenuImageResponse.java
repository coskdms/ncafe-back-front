package com.newlecture.backend.admin.menu.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMenuImageResponse {
    private Long id;
    private Long menuId;
    private String srcUrl;
    private String altText;
    private Integer sortOrder;
}
