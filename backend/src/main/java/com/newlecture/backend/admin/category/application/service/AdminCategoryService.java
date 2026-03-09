package com.newlecture.backend.admin.category.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.newlecture.backend.admin.category.domain.Category;
import com.newlecture.backend.admin.category.application.port.in.AdminCategoryUseCase;
import com.newlecture.backend.admin.category.application.port.out.CategoryRepository;

/**
 * 어드민 카테고리 서비스
 */
@Service("adminCategoryService")
public class AdminCategoryService implements AdminCategoryUseCase {

    private final CategoryRepository categoryRepository;

    public AdminCategoryService(
            @Qualifier("adminCategoryPersistenceAdapter") CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category create(Category category) {
        // 새 카테고리의 정렬 순서를 마지막으로 설정
        int nextOrder = categoryRepository.findAll().size() + 1;
        category.setSortOrder(nextOrder);
        return categoryRepository.save(category);
    }

    @Override
    public Category update(Integer id, Category category) {
        Category existing = categoryRepository.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Category not found with id: " + id);
        }
        
        existing.setName(category.getName());
        existing.setIcon(category.getIcon());
        // sortOrder는 updateSortOrder에서 별도로 처리하거나 보존
        
        return categoryRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public void updateSortOrder(List<Integer> categoryIds) {
        for (int i = 0; i < categoryIds.size(); i++) {
            Integer id = categoryIds.get(i);
            Category category = categoryRepository.findById(id);
            if (category != null) {
                category.setSortOrder(i + 1);
                categoryRepository.save(category);
            }
        }
    }
}
