package com.newlecture.backend.admin.menu.application.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.newlecture.backend.admin.menu.application.port.in.CreateMenuUseCase;
import com.newlecture.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.newlecture.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.newlecture.backend.admin.menu.application.port.in.command.CreateMenuCommand;
import com.newlecture.backend.admin.menu.application.port.in.command.UpdateMenuCommand;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuSaveResult;
import com.newlecture.backend.admin.menu.application.port.out.MenuRepository;
import com.newlecture.backend.admin.menu.domain.Menu;

import com.newlecture.backend.admin.menu.application.port.in.UpdateMenuImagesUseCase;
import com.newlecture.backend.admin.menu.application.port.out.MenuImageRepository;
import com.newlecture.backend.admin.menu.domain.MenuImage;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

@Service("adminMenuCommandService")
public class AdminMenuCommandService
        implements CreateMenuUseCase, UpdateMenuUseCase, DeleteMenuUseCase, UpdateMenuImagesUseCase {

    private final MenuRepository menuRepository;
    private final MenuImageRepository menuImageRepository;

    public AdminMenuCommandService(
            @Qualifier("adminMenuPersistenceAdapter") MenuRepository menuRepository,
            @Qualifier("adminMenuImagePersistenceAdapter") MenuImageRepository menuImageRepository) {
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
    }

    @Override
    public MenuSaveResult createMenu(CreateMenuCommand command) {
        // TODO: 구현
        throw new UnsupportedOperationException("Unimplemented method 'createMenu'");
    }

    @Override
    @Transactional
    public MenuSaveResult updateMenu(UpdateMenuCommand command) {
        Menu menu = menuRepository.findById(command.getId());
        if (menu == null) {
            return MenuSaveResult.builder().success(false).message("메뉴를 찾을 수 없습니다.").build();
        }

        menu.setKorName(command.getKorName());
        menu.setEngName(command.getEngName());
        menu.setDescription(command.getDescription());
        menu.setPrice(command.getPrice());
        menu.setCategoryId(command.getCategoryId());
        menu.setIsAvailable(command.getIsAvailable());
        menu.setUpdatedAt(java.time.LocalDateTime.now());

        Menu updatedMenu = menuRepository.save(menu);

        return MenuSaveResult.builder()
                .id(updatedMenu.getId())
                .success(true)
                .message("수정 성공")
                .build();
    }

    @Override
    @Transactional
    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void updateMenuImages(Long menuId, List<MultipartFile> files, List<Long> retainedImageIds,
            List<String> imageOrder) {
        // 1. 유지할 이미지를 제외한 나머지 이미지 삭제 처리
        menuImageRepository.deleteByMenuIdAndIdNotIn(menuId, retainedImageIds);

        // 2. 새 파일들을 폴더에 저장
        List<String> newFileNames = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            Path uploadDir = Paths.get("upload/images").toAbsolutePath().normalize();
            try {
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }
            } catch (IOException e) {
                throw new RuntimeException("업로드 폴더 생성 실패", e);
            }

            for (MultipartFile file : files) {
                if (file.isEmpty())
                    continue;

                String originalFilename = file.getOriginalFilename();
                String extension = (originalFilename != null && originalFilename.contains("."))
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : "";
                String newFileName = UUID.randomUUID().toString() + extension;
                Path filePath = uploadDir.resolve(newFileName);

                try {
                    java.nio.file.Files.copy(file.getInputStream(), filePath,
                            java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                    newFileNames.add(newFileName);
                } catch (IOException e) {
                    throw new RuntimeException("파일 저장 실패: " + filePath.toString(), e);
                }
            }
        }

        // 3. imageOrder가 있으면 해당 순서대로 모든 이미지 DB 반영
        // imageOrder 예: ["id:10", "file:0", "id:11"]
        if (imageOrder != null && !imageOrder.isEmpty()) {
            List<MenuImage> existingImages = menuImageRepository.findAllByMenuId(menuId);
            List<MenuImage> imagesToSave = new ArrayList<>();

            for (int i = 0; i < imageOrder.size(); i++) {
                String orderItem = imageOrder.get(i);
                final int sortOrder = i;
                if (orderItem.startsWith("id:")) {
                    Long id = Long.parseLong(orderItem.substring(3));
                    existingImages.stream()
                            .filter(img -> img.getId().equals(id))
                            .findFirst()
                            .ifPresent(img -> {
                                img.setSortOrder(sortOrder);
                                imagesToSave.add(img);
                            });
                } else if (orderItem.startsWith("file:")) {
                    int fileIndex = Integer.parseInt(orderItem.substring(5));
                    if (fileIndex < newFileNames.size()) {
                        MenuImage newImage = MenuImage.builder()
                                .menuId(menuId)
                                .srcUrl(newFileNames.get(fileIndex))
                                .sortOrder(i)
                                .createdAt(LocalDateTime.now())
                                .build();
                        imagesToSave.add(newImage);
                    }
                }
            }
            if (!imagesToSave.isEmpty()) {
                menuImageRepository.saveAll(imagesToSave);
            }
        } else {
            // imageOrder가 없는 경우 (하위 호환성 또는 수동 처리)
            int currentSortOrder = 0;
            if (retainedImageIds != null && !retainedImageIds.isEmpty()) {
                List<MenuImage> existingImages = menuImageRepository.findAllByMenuId(menuId);
                for (Long id : retainedImageIds) {
                    final int finalOrder = currentSortOrder++;
                    existingImages.stream()
                            .filter(img -> img.getId().equals(id))
                            .findFirst()
                            .ifPresent(img -> img.setSortOrder(finalOrder));
                }
                menuImageRepository.saveAll(existingImages);
            }

            if (!newFileNames.isEmpty()) {
                List<MenuImage> newImages = new ArrayList<>();
                for (String fileName : newFileNames) {
                    newImages.add(MenuImage.builder()
                            .menuId(menuId)
                            .srcUrl(fileName)
                            .sortOrder(currentSortOrder++)
                            .createdAt(LocalDateTime.now())
                            .build());
                }
                menuImageRepository.saveAll(newImages);
            }
        }

        // 4. 메뉴 테이블의 updatedAt 갱신 (리스트 캐시 방지 등을 위함)
        Menu menu = menuRepository.findById(menuId);
        if (menu != null) {
            menu.setUpdatedAt(LocalDateTime.now());
            menuRepository.save(menu);
        }
    }
}
