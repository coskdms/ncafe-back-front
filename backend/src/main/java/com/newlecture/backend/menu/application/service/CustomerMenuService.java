package com.newlecture.backend.menu.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.newlecture.backend.menu.domain.Category;
import com.newlecture.backend.menu.domain.Menu;
import com.newlecture.backend.menu.domain.MenuImage;
import com.newlecture.backend.menu.application.port.in.GetCustomerMenuDetailUseCase;
import com.newlecture.backend.menu.application.port.in.GetCustomerMenuListUseCase;
import com.newlecture.backend.menu.application.port.in.command.GetCustomerMenuListCommand;
import com.newlecture.backend.menu.application.port.in.result.CustomerMenuDetailResult;
import com.newlecture.backend.menu.application.port.in.result.CustomerMenuItemResult;
import com.newlecture.backend.menu.application.port.in.result.CustomerMenuListResult;
import com.newlecture.backend.menu.application.port.out.CategoryRepository;
import com.newlecture.backend.menu.application.port.out.MenuImageRepository;
import com.newlecture.backend.menu.application.port.out.MenuRepository;
import com.newlecture.backend.admin.menu.application.port.out.MenuOptionRepository;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuOptionGroupResult;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuOptionDetailResult;
import com.newlecture.backend.admin.menu.domain.MenuOptionGroup;

/**
 * 일반 사용자 메뉴 서비스
 * 판매중인 메뉴만 조회하고, 공개 정보만 반환합니다.
 * 어댑터의 DTO를 모르고, Command/Result만 사용합니다.
 */
@Service("customerMenuService")
public class CustomerMenuService implements GetCustomerMenuListUseCase,
        GetCustomerMenuDetailUseCase {

    private final MenuRepository menuRepository;
    private final MenuImageRepository menuImageRepository;
    private final CategoryRepository categoryRepository;
    private final MenuOptionRepository menuOptionRepository;

    public CustomerMenuService(
            @Qualifier("customerMenuPersistenceAdapter") MenuRepository menuRepository,
            @Qualifier("customerMenuImagePersistenceAdapter") MenuImageRepository menuImageRepository,
            @Qualifier("customerCategoryPersistenceAdapter") CategoryRepository categoryRepository,
            @Qualifier("adminMenuOptionPersistenceAdapter") MenuOptionRepository menuOptionRepository) {
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
        this.categoryRepository = categoryRepository;
        this.menuOptionRepository = menuOptionRepository;
    }

    @Override
    public CustomerMenuListResult getMenus(GetCustomerMenuListCommand command) {
        Integer categoryId = command.getCategoryId();
        String searchQuery = command.getSearchQuery();

        List<Menu> menuList = menuRepository.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery);

        List<CustomerMenuItemResult> menuResults = menuList
                .stream()
                .filter(menu -> menu.getIsAvailable() != null && menu.getIsAvailable())
                .map(menu -> {
                    String categoryName = getCategoryName(menu.getCategoryId());
                    String imagesSrc = getAllImageSrcs(menu.getId());

                    return CustomerMenuItemResult.builder()
                            .id(menu.getId())
                            .korName(menu.getKorName())
                            .engName(menu.getEngName())
                            .description(menu.getDescription())
                            .price(menu.getPrice())
                            .categoryName(categoryName)
                            .imagesSrc(imagesSrc)
                            .build();
                })
                .toList();

        return CustomerMenuListResult.builder()
                .menus(menuResults)
                .totalCount(menuResults.size())
                .build();
    }

    @Override
    public CustomerMenuDetailResult getMenuDetailById(Long id) {
        Menu menu = menuRepository.findById(id);

        if (menu == null) {
            return null;
        }

        // 판매중이 아닌 메뉴는 일반 사용자에게 보이지 않음
        if (menu.getIsAvailable() != null && !menu.getIsAvailable()) {
            return null;
        }

        String categoryName = getCategoryName(menu.getCategoryId());
        String imagesSrc = getAllImageSrcs(menu.getId());

        List<MenuOptionGroup> optionGroupsDomain = menuOptionRepository.findByMenuId(menu.getId());
        List<MenuOptionGroupResult> optionGroups = optionGroupsDomain.stream().map(g -> {
            List<MenuOptionDetailResult> details = new java.util.ArrayList<>();
            if (g.getOptionDetails() != null) {
                details = g.getOptionDetails().stream()
                        .map(d -> MenuOptionDetailResult.builder()
                                .id(d.getId())
                                .name(d.getName())
                                .additionalPrice(d.getAdditionalPrice())
                                .sortOrder(d.getSortOrder())
                                .build())
                        .toList();
            }
            return MenuOptionGroupResult.builder()
                    .id(g.getId())
                    .name(g.getName())
                    .isRequired(g.getIsRequired())
                    .isMultiple(g.getIsMultiple())
                    .sortOrder(g.getSortOrder())
                    .optionDetails(details)
                    .build();
        }).toList();

        return CustomerMenuDetailResult.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryName(categoryName)
                .imagesSrc(imagesSrc)
                .optionGroups(optionGroups)
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

    private String getAllImageSrcs(Long menuId) {
        List<MenuImage> menuImages = menuImageRepository.findAllByMenuId(menuId);
        if (menuImages == null || menuImages.isEmpty()) {
            return "blank.png";
        }
        return menuImages.stream()
                .map(MenuImage::getSrcUrl)
                .collect(java.util.stream.Collectors.joining(","));
    }
}
