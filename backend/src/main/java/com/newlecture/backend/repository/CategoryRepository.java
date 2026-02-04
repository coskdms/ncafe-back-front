package com.newlecture.backend.repository;

import java.util.List;

import com.newlecture.backend.entity.Category;

public interface CategoryRepository {
    List<Category> findAll();

    Category findById(Integer id);
}
