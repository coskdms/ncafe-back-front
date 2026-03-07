package com.newlecture.backend.admin.category.adapter.out.persistence;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import com.newlecture.backend.admin.category.adapter.out.persistence.entity.CategoryJpaEntity;
import com.newlecture.backend.admin.category.adapter.out.persistence.repository.AdminCategoryJpaRepository;
import com.newlecture.backend.admin.category.application.port.out.CategoryRepository;
import com.newlecture.backend.admin.category.domain.Category;

/**
 * 아웃바운드 어댑터: 카테고리 영속성
 * 아웃바운드 포트(CategoryRepository)를 구현합니다.
 */
@Repository("adminCategoryPersistenceAdapter")
public class CategoryPersistenceAdapter implements CategoryRepository {

    private final AdminCategoryJpaRepository categoryJpaRepository;

    public CategoryPersistenceAdapter(AdminCategoryJpaRepository categoryJpaRepository) {
        this.categoryJpaRepository = categoryJpaRepository;
    }

    @Override
    public List<Category> findAll() {
        return categoryJpaRepository.findAll(Sort.by("sortOrder"))
                .stream()
                .map(CategoryJpaEntity::toDomain)
                .toList();
    }

    @Override
    public Category findById(Integer id) {
        return categoryJpaRepository.findById(id)
                .map(CategoryJpaEntity::toDomain)
                .orElse(null);
    }
}
