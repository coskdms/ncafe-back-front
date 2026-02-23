package com.newlecture.backend.admin.menu.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 도메인 엔티티: 메뉴
 * 외부 프레임워크(JPA 등)에 의존하지 않는 순수 POJO입니다.
 * JPA 매핑은 adapter/out/persistence/entity/MenuJpaEntity에서 처리합니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    private Long id;
    private String korName;
    private String engName;
    private String categoryId;
    private Integer price;
    private String description;
    private Boolean isAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
