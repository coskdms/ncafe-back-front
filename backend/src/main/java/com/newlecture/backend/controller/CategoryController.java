package com.newlecture.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newlecture.backend.entity.Category;
import com.newlecture.backend.service.CategoryService;

@RestController
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // 목록 조회 데이터 반환
    @GetMapping("/admin/categories")
    public List<Category> categories() {
        return categoryService.getAll();
    }

    // 상세 조회 데이터 반환
    @GetMapping("/admin/categories/{id}")
    public String detailCategory() {
        return "detailCategory";
    }

    // 카테고리 생성 데이터 입력
    @PostMapping("/admin/categories")
    public String newCategory(Category category) {
        return "newCategory";
    }

    // 카테고리 수정
    @PutMapping("/admin/categories/{id}")
    public String editCategory(Category category) {
        return "editCategory";
    }

    // 카테고리 삭제
    @DeleteMapping("/admin/categories/{id}")
    public String deleteCategory() {
        return "deleteCategory";
    }

}
