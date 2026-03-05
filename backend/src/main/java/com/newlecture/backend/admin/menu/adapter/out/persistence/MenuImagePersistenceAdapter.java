package com.newlecture.backend.admin.menu.adapter.out.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuImageJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuImageJpaRepository;
import com.newlecture.backend.admin.menu.application.port.out.MenuImageRepository;
import com.newlecture.backend.admin.menu.domain.MenuImage;

/**
 * 아웃바운드 어댑터: 메뉴 이미지 영속성
 * 아웃바운드 포트(MenuImageRepository)를 구현합니다.
 */
@Repository("adminMenuImagePersistenceAdapter")
public class MenuImagePersistenceAdapter implements MenuImageRepository {

    private final AdminMenuImageJpaRepository menuImageJpaRepository;

    public MenuImagePersistenceAdapter(AdminMenuImageJpaRepository menuImageJpaRepository) {
        this.menuImageJpaRepository = menuImageJpaRepository;
    }

    @Override
    public List<MenuImage> findAllByMenuId(Long menuId) {
        return menuImageJpaRepository.findByMenuIdOrderBySortOrder(menuId)
                .stream()
                .map(MenuImageJpaEntity::toDomain)
                .toList();
    }

    @Override
    public void deleteByMenuIdAndIdNotIn(Long menuId, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            menuImageJpaRepository.deleteByMenuId(menuId);
        } else {
            menuImageJpaRepository.deleteByMenuIdAndIdNotIn(menuId, ids);
        }
    }

    @Override
    public void deleteByMenuId(Long menuId) {
        menuImageJpaRepository.deleteByMenuId(menuId);
    }

    @Override
    public void saveAll(List<MenuImage> menuImages) {
        List<MenuImageJpaEntity> entities = menuImages.stream()
                .map(MenuImageJpaEntity::fromDomain)
                .toList();
        menuImageJpaRepository.saveAll(entities);
    }
}
