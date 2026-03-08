package com.newlecture.backend.admin.category.adapter.out.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlecture.backend.admin.category.adapter.out.persistence.entity.CategoryJpaEntity;

import java.util.Optional;

/**
 * Spring Data JPA Repository: categories 테이블
 */
public interface AdminCategoryJpaRepository extends JpaRepository<CategoryJpaEntity, Integer> {
    Optional<CategoryJpaEntity> findByName(String name);
}
