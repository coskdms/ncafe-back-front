package com.newlecture.backend.admin.menu.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.newlecture.backend.admin.menu.domain.Menu;
import com.newlecture.backend.admin.menu.domain.MenuImage;
import com.newlecture.backend.admin.menu.application.port.in.GetAdminMenuImagesUseCase;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuImageItemResult;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuImageListResult;
import com.newlecture.backend.admin.menu.application.port.out.MenuImageRepository;
import com.newlecture.backend.admin.menu.application.port.out.MenuRepository;

@Service("adminMenuImageQueryService")
public class AdminMenuImageQueryService implements GetAdminMenuImagesUseCase {

    private final MenuRepository menuRepository;
    private final MenuImageRepository menuImageRepository;

    public AdminMenuImageQueryService(
            @Qualifier("adminMenuPersistenceAdapter") MenuRepository menuRepository,
            @Qualifier("adminMenuImagePersistenceAdapter") MenuImageRepository menuImageRepository) {
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
    }

    @Override
    public MenuImageListResult getMenuImages(Long id) {
        Menu menu = menuRepository.findById(id);
        String altText = (menu != null) ? menu.getKorName() : "메뉴 이미지";

        List<MenuImage> menuImages = menuImageRepository.findAllByMenuId(id);

        List<MenuImageItemResult> imageResults = menuImages.stream()
                .map(img -> MenuImageItemResult.builder()
                        .id(img.getId())
                        .menuId(img.getMenuId())
                        .srcUrl(img.getSrcUrl())
                        .altText(altText)
                        .sortOrder(img.getSortOrder())
                        .build())
                .toList();

        return MenuImageListResult.builder()
                .images(imageResults)
                .build();
    }
}
