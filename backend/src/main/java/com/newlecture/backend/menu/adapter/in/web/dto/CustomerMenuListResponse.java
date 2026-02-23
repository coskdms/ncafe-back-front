package com.newlecture.backend.menu.adapter.in.web.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerMenuListResponse {
    private List<CustomerMenuResponse> menus;
    private int totalCount;
}
