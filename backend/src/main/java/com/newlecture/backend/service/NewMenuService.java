package com.newlecture.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.newlecture.backend.dto.MenuCreateRequest;
import com.newlecture.backend.dto.MenuCreateResponse;
import com.newlecture.backend.dto.MenuDetailResponse;
import com.newlecture.backend.dto.MenuListRequest;
import com.newlecture.backend.dto.MenuListResponse;
import com.newlecture.backend.dto.MenuResponse;
import com.newlecture.backend.dto.MenuUpdateRequest;
import com.newlecture.backend.dto.MenuUpdateResponse;
import com.newlecture.backend.entity.Category;
import com.newlecture.backend.entity.Menu;
import com.newlecture.backend.entity.MenuImage;
import com.newlecture.backend.repository.CategoryRepository;
import com.newlecture.backend.repository.MenuImageRepository;
import com.newlecture.backend.repository.MenuRepository;

@Service
public class NewMenuService implements MenuService {
    private MenuImageRepository menuImageRepository; // menuImageRepository에서 필요한 기능은 .findAllByMenuId(menu.getId())
    private CategoryRepository categoryRepository;
    private MenuRepository menuRepository;

    public NewMenuService(MenuRepository menuRepository, MenuImageRepository menuImageRepository,
            CategoryRepository categoryRepository) {
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public MenuListResponse getMenus(MenuListRequest request) {
        Integer categoryId = request.getCategoryId();
        String searchQuery = request.getSearchQuery();

        // Menu <---> MenuResponse ----> [] ---> MenuListResponse

        // 지금 응답이 Menu와 실제 데이터인 MenuResponse의 데이터가 달라서
        // Menu 로 데이터를 가져오고 MenuResponse로 변환해서 반환
        List<Menu> menuList = menuRepository.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery);
        List<MenuResponse> menuResponseList = menuList
                .stream()
                .map(menu -> {
                    // 카테고리 정보 가져오기
                    String categoryName = "";
                    if (menu.getCategoryId() != null) {
                        Category category = categoryRepository.findById(Integer.parseInt(menu.getCategoryId()));
                        if (category != null) {
                            categoryName = category.getName();
                        }
                    }

                    // 이미지 정보 가져오기 (첫 번째 이미지의 srcUrl 사용)
                    String imagesSrc = "";
                    List<MenuImage> menuImages = menuImageRepository.findAllByMenuId(menu.getId());

                    if (!menuImages.isEmpty()) {
                        imagesSrc = menuImages.get(0).getSrcUrl();
                    }

                    return MenuResponse
                            .builder()
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

        return MenuListResponse
                .builder()
                .menus(menuResponseList)
                .totalCount(menuResponseList.size())
                .build();
    }

    @Override
    public MenuDetailResponse getMenu(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMenu'");
    }

    @Override
    public MenuCreateResponse createMenu(MenuCreateRequest request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createMenu'");
    }

    @Override
    public MenuUpdateResponse updateMenu(MenuUpdateRequest request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateMenu'");
    }

    @Override
    public void deleteMenu(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteMenu'");
    }

}
