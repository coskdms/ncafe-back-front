package com.newlecture.backend.admin.menu.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.newlecture.backend.admin.category.domain.Category;
import com.newlecture.backend.admin.menu.domain.Menu;
import com.newlecture.backend.admin.menu.domain.MenuImage;
import com.newlecture.backend.admin.menu.application.port.in.GetAdminMenuDetailUseCase;
import com.newlecture.backend.admin.menu.application.port.in.GetAdminMenuListUseCase;
import com.newlecture.backend.admin.menu.application.port.in.command.GetMenuListCommand;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuDetailResult;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuItemResult;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuListResult;
import com.newlecture.backend.admin.category.application.port.out.CategoryRepository;
import com.newlecture.backend.admin.menu.application.port.out.MenuImageRepository;
import com.newlecture.backend.admin.menu.application.port.out.MenuRepository;

@Service("adminMenuQueryService")
public class AdminMenuQueryService
        implements GetAdminMenuListUseCase, GetAdminMenuDetailUseCase {

    private final MenuRepository menuRepository;
    private final MenuImageRepository menuImageRepository;
    private final CategoryRepository categoryRepository;

    public AdminMenuQueryService(
            @Qualifier("adminMenuPersistenceAdapter") MenuRepository menuRepository,
            @Qualifier("adminMenuImagePersistenceAdapter") MenuImageRepository menuImageRepository,
            @Qualifier("adminCategoryPersistenceAdapter") CategoryRepository categoryRepository) {
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public MenuListResult getMenus(GetMenuListCommand command) {
        Integer categoryId = command.getCategoryId();
        String searchQuery = command.getSearchQuery();

        List<Menu> menuList = menuRepository.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery);
        List<MenuItemResult> menuResults = menuList
                .stream()
                .map(menu -> {
                    String categoryName = getCategoryName(menu.getCategoryId());
                    String imagesSrc = getFirstImageSrc(menu.getId());

                    return MenuItemResult.builder()
                            .id(menu.getId())
                            .korName(menu.getKorName())
                            .engName(menu.getEngName())
                            .description(menu.getDescription())
                            .price(menu.getPrice())
                            .categoryName(categoryName)
                            .imagesSrc(imagesSrc)
                            .isAvailable(menu.getIsAvailable())
                            .isSoldOut(false)
                            .sortOrder(1)
                            .createdAt(menu.getCreatedAt())
                            .updatedAt(menu.getUpdatedAt())
                            .build();
                })
                .toList();

        return MenuListResult.builder()
                .menus(menuResults)
                .totalCount(menuResults.size())
                .build();
    }

    @Override
    public MenuDetailResult getMenuDetailById(Long id) {
        Menu menu = menuRepository.findById(id);

        if (menu == null) {
            return null;
        }

        String categoryName = getCategoryName(menu.getCategoryId());

        return MenuDetailResult.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .categoryName(categoryName)
                .isAvailable(menu.getIsAvailable())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }

    // ========== Private Helper Methods ==========

    private String getCategoryName(String categoryId) {
        if (categoryId == null) {
            return "";
        }
        Category category = categoryRepository.findById(Integer.parseInt(categoryId));
        return (category != null) ? category.getName() : "";
    }

    private String getFirstImageSrc(Long menuId) {
        List<MenuImage> menuImages = menuImageRepository.findAllByMenuId(menuId);
        return menuImages.isEmpty() ? "blank.png" : menuImages.get(0).getSrcUrl();
    }
}