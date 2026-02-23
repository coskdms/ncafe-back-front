package com.newlecture.backend.menu.application.port.in.result;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 고객 메뉴 상세 조회 결과
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerMenuDetailResult {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private String categoryName;
    private String imagesSrc;
}
