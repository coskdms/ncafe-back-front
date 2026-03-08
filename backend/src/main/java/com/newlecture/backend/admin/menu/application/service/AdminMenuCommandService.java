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
    private final com.newlecture.backend.admin.menu.application.port.out.MenuOptionRepository menuOptionRepository;

    public AdminMenuCommandService(
            @Qualifier("adminMenuPersistenceAdapter") MenuRepository menuRepository,
            @Qualifier("adminMenuImagePersistenceAdapter") MenuImageRepository menuImageRepository,
            @Qualifier("adminMenuOptionPersistenceAdapter") com.newlecture.backend.admin.menu.application.port.out.MenuOptionRepository menuOptionRepository) {
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
        this.menuOptionRepository = menuOptionRepository;
    }

    @Override
    @Transactional
    public MenuSaveResult createMenu(CreateMenuCommand command) {
        Menu menu = Menu.builder()
                .korName(command.getKorName())
                .engName(command.getEngName())
                .description(command.getDescription())
                .price(command.getPrice() != null ? command.getPrice() : 0)
                .categoryId(command.getCategoryId())
                .isAvailable(command.getIsAvailable() != null ? command.getIsAvailable() : true)
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();

        Menu savedMenu = menuRepository.save(menu);

        saveMenuOptions(savedMenu.getId(), command.getOptionGroups());

        return MenuSaveResult.builder()
                .id(savedMenu.getId())
                .success(true)
                .message("메뉴가 성공적으로 생성되었습니다.")
                .build();
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

        // Delete existing options and insert new ones
        menuOptionRepository.deleteByMenuId(updatedMenu.getId());
        saveMenuOptions(updatedMenu.getId(), command.getOptionGroups());

        return MenuSaveResult.builder()
                .id(updatedMenu.getId())
                .success(true)
                .message("수정 성공")
                .build();
    }

    private void saveMenuOptions(Long menuId, List<com.newlecture.backend.admin.menu.application.port.in.command.MenuOptionGroupCommand> optionGroups) {
        if (optionGroups == null || optionGroups.isEmpty()) {
            return;
        }
        for (var groupCmd : optionGroups) {
            List<com.newlecture.backend.admin.menu.domain.MenuOptionDetail> details = new ArrayList<>();
            if (groupCmd.getOptionDetails() != null) {
                for (var detailCmd : groupCmd.getOptionDetails()) {
                    details.add(com.newlecture.backend.admin.menu.domain.MenuOptionDetail.builder()
                            .name(detailCmd.getName())
                            .additionalPrice(detailCmd.getAdditionalPrice() != null ? detailCmd.getAdditionalPrice() : 0)
                            .sortOrder(detailCmd.getSortOrder() != null ? detailCmd.getSortOrder() : 1)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build());
                }
            }
            com.newlecture.backend.admin.menu.domain.MenuOptionGroup group = com.newlecture.backend.admin.menu.domain.MenuOptionGroup.builder()
                    .menuId(menuId)
                    .name(groupCmd.getName())
                    .isRequired(groupCmd.getIsRequired() != null ? groupCmd.getIsRequired() : false)
                    .isMultiple(groupCmd.getIsMultiple() != null ? groupCmd.getIsMultiple() : false)
                    .sortOrder(groupCmd.getSortOrder() != null ? groupCmd.getSortOrder() : 1)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .optionDetails(details)
                    .build();
            menuOptionRepository.save(group);
        }
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

        // retainedImageIds가 null이면 빈 리스트로 초기화 (방어 로직)
        List<Long> finalRetainedIds = retainedImageIds != null ? retainedImageIds : new ArrayList<>();

        // 1. 유지할 이미지를 제외한 나머지 이미지 삭제 처리
        menuImageRepository.deleteByMenuIdAndIdNotIn(menuId, finalRetainedIds);

        // 2. 새 파일들을 폴더에 저장
        List<String> newFileNames = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            // "upload/images" 경로를 현재 실행 위치 기준으로 확보
            Path uploadDir = Paths.get("upload", "images").toAbsolutePath().normalize();
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
        if (imageOrder != null && !imageOrder.isEmpty()) {
            List<MenuImage> existingImages = menuImageRepository.findAllByMenuId(menuId);
            List<MenuImage> imagesToSave = new ArrayList<>();

            for (int i = 0; i < imageOrder.size(); i++) {
                String orderItem = imageOrder.get(i);
                final int sortOrder = i;
                try {
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
                        if (fileIndex >= 0 && fileIndex < newFileNames.size()) {
                            MenuImage newImage = MenuImage.builder()
                                    .menuId(menuId)
                                    .srcUrl(newFileNames.get(fileIndex))
                                    .sortOrder(sortOrder)
                                    .createdAt(LocalDateTime.now())
                                    .build();
                            imagesToSave.add(newImage);
                        }
                    }
                } catch (Exception e) {
                    // 개별 파싱 에러가 전체 프로세스를 중단시키지 않도록 로깅 후 스킵
                    System.err.println("[이미지 순서 파싱 오류] orderItem: " + orderItem + ", error: " + e.getMessage());
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
