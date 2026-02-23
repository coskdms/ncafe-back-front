package com.newlecture.backend.admin.menu.application.port.out;

import java.util.List;

import com.newlecture.backend.admin.menu.domain.Category;

/**
 * 아웃바운드 포트: 카테고리 영속성
 */
public interface CategoryRepository {
    List<Category> findAll();

    Category findById(Integer id);
}
