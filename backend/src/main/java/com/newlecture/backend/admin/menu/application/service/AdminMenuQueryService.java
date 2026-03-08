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
    private final com.newlecture.backend.admin.menu.application.port.out.MenuOptionRepository menuOptionRepository;

    public AdminMenuQueryService(
            @Qualifier("adminMenuPersistenceAdapter") MenuRepository menuRepository,
            @Qualifier("adminMenuImagePersistenceAdapter") MenuImageRepository menuImageRepository,
            @Qualifier("adminCategoryPersistenceAdapter") CategoryRepository categoryRepository,
            @Qualifier("adminMenuOptionPersistenceAdapter") com.newlecture.backend.admin.menu.application.port.out.MenuOptionRepository menuOptionRepository) {
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
        this.categoryRepository = categoryRepository;
        this.menuOptionRepository = menuOptionRepository;
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

        List<com.newlecture.backend.admin.menu.domain.MenuOptionGroup> optionGroupsDomain = menuOptionRepository.findByMenuId(menu.getId());
        List<com.newlecture.backend.admin.menu.application.port.in.result.MenuOptionGroupResult> optionGroupResults = optionGroupsDomain.stream().map(g -> {
            List<com.newlecture.backend.admin.menu.application.port.in.result.MenuOptionDetailResult> detailResults = new java.util.ArrayList<>();
            if (g.getOptionDetails() != null) {
                detailResults = g.getOptionDetails().stream().map(d -> com.newlecture.backend.admin.menu.application.port.in.result.MenuOptionDetailResult.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .additionalPrice(d.getAdditionalPrice())
                        .sortOrder(d.getSortOrder())
                        .build()).toList();
            }
            return com.newlecture.backend.admin.menu.application.port.in.result.MenuOptionGroupResult.builder()
                    .id(g.getId())
                    .name(g.getName())
                    .isRequired(g.getIsRequired())
                    .isMultiple(g.getIsMultiple())
                    .sortOrder(g.getSortOrder())
                    .optionDetails(detailResults)
                    .build();
        }).toList();

        return MenuDetailResult.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .categoryName(categoryName)
                .isAvailable(menu.getIsAvailable())
                .optionGroups(optionGroupResults)
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