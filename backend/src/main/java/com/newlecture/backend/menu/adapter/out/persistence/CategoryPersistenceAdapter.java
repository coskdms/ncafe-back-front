package com.newlecture.backend.menu.adapter.out.persistence;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import com.newlecture.backend.menu.adapter.out.persistence.entity.CategoryJpaEntity;
import com.newlecture.backend.menu.adapter.out.persistence.repository.CustomerCategoryJpaRepository;
import com.newlecture.backend.menu.application.port.out.CategoryRepository;
import com.newlecture.backend.menu.domain.Category;

/**
 * 아웃바운드 어댑터: 카테고리 영속성
 * 아웃바운드 포트(CategoryRepository)를 구현합니다.
 */
@Repository("customerCategoryPersistenceAdapter")
public class CategoryPersistenceAdapter implements CategoryRepository {

    private final CustomerCategoryJpaRepository categoryJpaRepository;

    public CategoryPersistenceAdapter(CustomerCategoryJpaRepository categoryJpaRepository) {
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
