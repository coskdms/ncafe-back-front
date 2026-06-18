package com.newlecture.backend.admin.menu.adapter.out.persistence.entity;

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
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "menu_option_groups", indexes = {
    @Index(name = "idx_menu_option_groups_menu_id", columnList = "menu_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuOptionGroupJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id", nullable = false)
    private Long menuId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired;

    @Column(name = "is_multiple", nullable = false)
    private Boolean isMultiple;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
