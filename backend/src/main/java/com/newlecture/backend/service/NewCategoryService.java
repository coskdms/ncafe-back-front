package com.newlecture.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.newlecture.backend.entity.Category;
import com.newlecture.backend.repository.CategoryRepository;

@Service
public class NewCategoryService implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        List<Category> categories = categoryRepository.findAll();
        return categories;
    }

}
