package com.newlecture.backend.admin.menu.adapter.in.web;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newlecture.backend.admin.menu.adapter.in.web.dto.AdminMenuDetailResponse;
import com.newlecture.backend.admin.menu.adapter.in.web.dto.AdminMenuImageListResponse;
import com.newlecture.backend.admin.menu.adapter.in.web.dto.AdminMenuImageResponse;
import com.newlecture.backend.admin.menu.adapter.in.web.dto.AdminMenuListRequest;
import com.newlecture.backend.admin.menu.adapter.in.web.dto.AdminMenuListResponse;
import com.newlecture.backend.admin.menu.adapter.in.web.dto.AdminMenuResponse;
import com.newlecture.backend.admin.menu.application.port.in.GetAdminMenuListUseCase;
import com.newlecture.backend.admin.menu.application.port.in.GetAdminMenuDetailUseCase;
import com.newlecture.backend.admin.menu.application.port.in.GetAdminMenuImagesUseCase;
import com.newlecture.backend.admin.menu.application.port.in.CreateMenuUseCase;
import com.newlecture.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.newlecture.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.newlecture.backend.admin.menu.application.port.in.command.GetMenuListCommand;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuDetailResult;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuImageListResult;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuListResult;

/**
 * 어드민 인바운드 어댑터: 메뉴 관리 REST 컨트롤러
 * DTO ↔ Command/Result 변환을 담당합니다.
 */
@RestController
@RequestMapping("/admin/menus")
public class AdminMenuController {

    private final GetAdminMenuListUseCase getAdminMenuListUseCase;
    private final GetAdminMenuDetailUseCase getAdminMenuDetailUseCase;
    private final GetAdminMenuImagesUseCase getAdminMenuImagesUseCase;
    private final CreateMenuUseCase createMenuUseCase;
    private final UpdateMenuUseCase updateMenuUseCase;
    private final DeleteMenuUseCase deleteMenuUseCase;

    public AdminMenuController(GetAdminMenuListUseCase getAdminMenuListUseCase,
            GetAdminMenuDetailUseCase getAdminMenuDetailUseCase,
            GetAdminMenuImagesUseCase getAdminMenuImagesUseCase,
            CreateMenuUseCase createMenuUseCase,
            UpdateMenuUseCase updateMenuUseCase,
            DeleteMenuUseCase deleteMenuUseCase) {
        this.getAdminMenuListUseCase = getAdminMenuListUseCase;
        this.getAdminMenuDetailUseCase = getAdminMenuDetailUseCase;
        this.getAdminMenuImagesUseCase = getAdminMenuImagesUseCase;
        this.createMenuUseCase = createMenuUseCase;
        this.updateMenuUseCase = updateMenuUseCase;
        this.deleteMenuUseCase = deleteMenuUseCase;
    }

    // 메뉴 목록 조회 (판매중지 포함)
    @GetMapping
    public AdminMenuListResponse getMenus(AdminMenuListRequest request) {
        // DTO → Command 변환
        GetMenuListCommand command = GetMenuListCommand.builder()
                .categoryId(request.getCategoryId())
                .searchQuery(request.getSearchQuery())
                .build();

        // UseCase 호출
        MenuListResult result = getAdminMenuListUseCase.getMenus(command);

        // Result → DTO 변환
        return AdminMenuListResponse.builder()
                .menus(result.getMenus().stream()
                        .map(item -> AdminMenuResponse.builder()
                                .id(item.getId())
                                .korName(item.getKorName())
                                .engName(item.getEngName())
                                .description(item.getDescription())
                                .price(item.getPrice())
                                .categoryName(item.getCategoryName())
                                .imagesSrc(item.getImagesSrc())
                                .isAvailable(item.getIsAvailable())
                                .isSoldOut(item.getIsSoldOut())
                                .sortOrder(item.getSortOrder())
                                .createdAt(item.getCreatedAt())
                                .updatedAt(item.getUpdatedAt())
                                .build())
                        .toList())
                .totalCount(result.getTotalCount())
                .build();
    }

    // 메뉴 상세 조회
    @GetMapping("/{id}")
    public AdminMenuDetailResponse getMenuDetailById(@PathVariable Long id) {
        // UseCase 호출
        MenuDetailResult result = getAdminMenuDetailUseCase.getMenuDetailById(id);

        if (result == null) {
            return null;
        }

        // Result → DTO 변환
        return AdminMenuDetailResponse.builder()
                .id(result.getId())
                .korName(result.getKorName())
                .engName(result.getEngName())
                .description(result.getDescription())
                .price(String.valueOf(result.getPrice()))
                .categoryId(result.getCategoryId())
                .categoryName(result.getCategoryName())
                .isAvailable(result.getIsAvailable())
                .createdAt(result.getCreatedAt())
                .updatedAt(result.getUpdatedAt())
                .build();
    }

    // 메뉴 생성
    @PostMapping
    public String createMenu() {
        return "createMenu";
    }

    // 메뉴 수정
    @PutMapping("/{id}")
    public String updateMenu(@PathVariable Long id) {
        return "updateMenu";
    }

    // 메뉴 삭제
    @DeleteMapping("/{id}")
    public String deleteMenu(@PathVariable Long id) {
        return "deleteMenu";
    }

    // 메뉴 이미지 목록 조회
    @GetMapping("/{id}/menu-images")
    public AdminMenuImageListResponse getMenuImages(@PathVariable Long id) {
        // UseCase 호출
        MenuImageListResult result = getAdminMenuImagesUseCase.getMenuImages(id);

        // Result → DTO 변환
        return AdminMenuImageListResponse.builder()
                .images(result.getImages().stream()
                        .map(img -> AdminMenuImageResponse.builder()
                                .id(img.getId())
                                .menuId(img.getMenuId())
                                .srcUrl(img.getSrcUrl())
                                .altText(img.getAltText())
                                .sortOrder(img.getSortOrder())
                                .build())
                        .toList())
                .build();
    }
}
