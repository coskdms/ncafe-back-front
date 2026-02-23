package com.newlecture.backend.admin.menu.adapter.in.web.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMenuListResponse {
    private List<AdminMenuResponse> menus;
    private int totalCount;
}
