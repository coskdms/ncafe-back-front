package com.newlecture.backend.admin.category.adapter.in.web;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newlecture.backend.admin.category.domain.Category;
import com.newlecture.backend.admin.category.application.port.in.AdminCategoryUseCase;

/**
 * 어드민 인바운드 어댑터: 카테고리 관리 REST 컨트롤러
 * AdminCategoryUseCase(인바운드 포트)에만 의존합니다.
 */
@RestController
@RequestMapping("/admin/categories")
public class AdminCategoryController {

    private final AdminCategoryUseCase adminCategoryUseCase;

    public AdminCategoryController(AdminCategoryUseCase adminCategoryUseCase) {
        this.adminCategoryUseCase = adminCategoryUseCase;
    }

    // 목록 조회
    @GetMapping
    public List<Category> categories() {
        return adminCategoryUseCase.getAll();
    }

    // 상세 조회
    @GetMapping("/{id}")
    public String detailCategory() {
        return "detailCategory";
    }

    // 카테고리 생성
    @PostMapping
    public String newCategory(Category category) {
        return "newCategory";
    }

    // 카테고리 수정
    @PutMapping("/{id}")
    public String editCategory(Category category) {
        return "editCategory";
    }

    // 카테고리 삭제
    @DeleteMapping("/{id}")
    public String deleteCategory() {
        return "deleteCategory";
    }
}
