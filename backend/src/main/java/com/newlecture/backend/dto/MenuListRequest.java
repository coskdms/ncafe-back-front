package com.newlecture.backend.dto;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuListRequest {
    private Integer categoryId;
    private String searchQuery;
}
