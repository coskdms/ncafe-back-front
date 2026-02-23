package com.newlecture.backend.admin.menu.adapter.in.web.dto;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMenuListRequest {
    private Integer categoryId;
    private String searchQuery;
}
