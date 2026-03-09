package com.newlecture.backend.admin.menu.adapter.out.persistence.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.newlecture.backend.admin.menu.domain.Menu;

/**
 * JPA 엔티티: menus 테이블 매핑
 * 인프라(DB) 관심사는 이 클래스에서만 처리합니다.
 * 도메인 객체(Menu)와의 변환 메서드를 제공합니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "AdminMenu")
@Table(name = "menus")
public class MenuJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kor_name")
    private String korName;

    @Column(name = "eng_name")
    private String engName;

    @Column(name = "category_id")
    private String categoryId;

    private Integer price;

    private String description;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ========== 도메인 ↔ JPA 엔티티 변환 ==========

    /**
     * JPA 엔티티 → 도메인 객체 변환
     */
    public Menu toDomain() {
        return Menu.builder()
                .id(this.id)
                .korName(this.korName)
                .engName(this.engName)
                .categoryId(this.categoryId)
                .price(this.price)
                .description(this.description)
                .isAvailable(this.isAvailable)
                .sortOrder(this.sortOrder)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }

    /**
     * 도메인 객체 → JPA 엔티티 변환
     */
    public static MenuJpaEntity fromDomain(Menu menu) {
        return MenuJpaEntity.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .categoryId(menu.getCategoryId())
                .price(menu.getPrice())
                .description(menu.getDescription())
                .isAvailable(menu.getIsAvailable())
                .sortOrder(menu.getSortOrder())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
