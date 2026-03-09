package com.newlecture.backend.admin.category.adapter.in.web;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public Category detailCategory(@PathVariable Integer id) {
        return adminCategoryUseCase.getAll().stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    // 카테고리 생성
    @PostMapping
    public Category newCategory(@RequestBody Category category) {
        return adminCategoryUseCase.create(category);
    }

    // 카테고리 수정
    @PutMapping("/{id}")
    public Category editCategory(@PathVariable Integer id, @RequestBody Category category) {
        return adminCategoryUseCase.update(id, category);
    }

    // 카테고리 삭제
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        adminCategoryUseCase.delete(id);
    }

    // 순서 변경
    @PostMapping("/reorder")
    public void reorder(@RequestBody List<Integer> categoryIds) {
        adminCategoryUseCase.updateSortOrder(categoryIds);
    }
}
