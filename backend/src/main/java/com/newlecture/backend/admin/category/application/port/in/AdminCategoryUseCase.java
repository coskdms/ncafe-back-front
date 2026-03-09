package com.newlecture.backend.admin.category.application.port.in;

import java.util.List;

import com.newlecture.backend.admin.category.domain.Category;

/**
 * 어드민 인바운드 포트: 카테고리 관리 유스케이스
 */
public interface AdminCategoryUseCase {
    List<Category> getAll();
    Category create(Category category);
    Category update(Integer id, Category category);
    void delete(Integer id);
    void updateSortOrder(List<Integer> categoryIds);
}