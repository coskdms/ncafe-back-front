package com.newlecture.backend.admin.menu.adapter.out.persistence.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.newlecture.backend.admin.menu.domain.MenuImage;

/**
 * JPA 엔티티: menu_images 테이블 매핑
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "AdminMenuImage")
@Table(name = "menu_images", indexes = {
    @Index(name = "idx_menu_images_menu_id", columnList = "menu_id")
})
public class MenuImageJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id")
    private Long menuId;

    @Column(name = "src_url")
    private String srcUrl;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * JPA 엔티티 → 도메인 객체 변환
     */
    public MenuImage toDomain() {
        return MenuImage.builder()
                .id(this.id)
                .menuId(this.menuId)
                .srcUrl(this.srcUrl)
                .sortOrder(this.sortOrder)
                .createdAt(this.createdAt)
                .build();
    }

    /**
     * 도메인 객체 → JPA 엔티티 변환
     */
    public static MenuImageJpaEntity fromDomain(MenuImage menuImage) {
        return MenuImageJpaEntity.builder()
                .id(menuImage.getId())
                .menuId(menuImage.getMenuId())
                .srcUrl(menuImage.getSrcUrl())
                .sortOrder(menuImage.getSortOrder())
                .createdAt(menuImage.getCreatedAt())
                .build();
    }
}
