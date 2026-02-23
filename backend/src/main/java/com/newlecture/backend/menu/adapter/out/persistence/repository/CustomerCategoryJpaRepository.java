package com.newlecture.backend.menu.adapter.out.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlecture.backend.menu.adapter.out.persistence.entity.CategoryJpaEntity;

/**
 * Spring Data JPA Repository: categories 테이블
 */
public interface CustomerCategoryJpaRepository extends JpaRepository<CategoryJpaEntity, Integer> {
}
