package com.newlecture.backend.admin.menu.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.newlecture.backend.admin.menu.domain.Category;
import com.newlecture.backend.admin.menu.application.port.in.AdminCategoryUseCase;
import com.newlecture.backend.admin.menu.application.port.out.CategoryRepository;

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
}
