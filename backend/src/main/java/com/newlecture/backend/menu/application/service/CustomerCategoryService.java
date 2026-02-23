package com.newlecture.backend.menu.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.newlecture.backend.menu.domain.Category;
import com.newlecture.backend.menu.application.port.in.GetCustomerCategoryUseCase;
import com.newlecture.backend.menu.application.port.out.CategoryRepository;

@Service("customerCategoryService")
public class CustomerCategoryService implements GetCustomerCategoryUseCase {

    private final CategoryRepository categoryRepository;

    public CustomerCategoryService(
            @Qualifier("customerCategoryPersistenceAdapter") CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }
}
