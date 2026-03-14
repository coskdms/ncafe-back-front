package com.newlecture.backend.admin.category.adapter.in.web;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> newCategory(@RequestBody Category category) {
        if (!isValidEmoji(category.getIcon())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "아이콘은 이모지만 사용할 수 있습니다."));
        }
        return ResponseEntity.ok(adminCategoryUseCase.create(category));
    }

    // 카테고리 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> editCategory(@PathVariable Integer id, @RequestBody Category category) {
        if (!isValidEmoji(category.getIcon())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "아이콘은 이모지만 사용할 수 있습니다."));
        }
        return ResponseEntity.ok(adminCategoryUseCase.update(id, category));
    }

    /**
     * 문자열이 이모지인지 검증
     * - null/빈문자열 거부
     * - 일반 ASCII 텍스트 거부 (숫자, 영문, 한글 등)
     * - 이모지만 허용
     */
    private boolean isValidEmoji(String icon) {
        if (icon == null || icon.isBlank()) return false;
        // 일반 텍스트(ASCII 영숫자, 한글, 공백 등)가 포함되면 거부
        return !icon.matches(".*[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\\s].*");
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
