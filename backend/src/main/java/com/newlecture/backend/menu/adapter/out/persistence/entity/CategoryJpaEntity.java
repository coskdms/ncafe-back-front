package com.newlecture.backend.menu.adapter.out.persistence.entity;

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

import com.newlecture.backend.menu.domain.Category;

/**
 * JPA 엔티티: categories 테이블 매핑
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "CustomerCategory")
@Table(name = "categories")
public class CategoryJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String icon;

    @Column(name = "sort_order")
    private Integer sortOrder;

    /**
     * JPA 엔티티 → 도메인 객체 변환
     */
    public Category toDomain() {
        return Category.builder()
                .id(this.id)
                .name(this.name)
                .icon(this.icon)
                .sortOrder(this.sortOrder)
                .build();
    }

    /**
     * 도메인 객체 → JPA 엔티티 변환
     */
    public static CategoryJpaEntity fromDomain(Category category) {
        return CategoryJpaEntity.builder()
                .id(category.getId())
                .name(category.getName())
                .icon(category.getIcon())
                .sortOrder(category.getSortOrder())
                .build();
    }
}
