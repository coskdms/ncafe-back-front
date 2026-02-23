package com.newlecture.backend.menu.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 일반 사용자용 메뉴 상세 응답 DTO
 * 공개 정보만 노출 (관리 정보 제외)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerMenuDetailResponse {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private String categoryName;
    private String imagesSrc;
}
