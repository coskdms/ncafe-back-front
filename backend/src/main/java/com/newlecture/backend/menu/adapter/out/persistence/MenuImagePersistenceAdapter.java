package com.newlecture.backend.menu.adapter.out.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.newlecture.backend.menu.adapter.out.persistence.entity.MenuImageJpaEntity;
import com.newlecture.backend.menu.adapter.out.persistence.repository.CustomerMenuImageJpaRepository;
import com.newlecture.backend.menu.application.port.out.MenuImageRepository;
import com.newlecture.backend.menu.domain.MenuImage;

/**
 * 아웃바운드 어댑터: 메뉴 이미지 영속성
 * 아웃바운드 포트(MenuImageRepository)를 구현합니다.
 */
@Repository("customerMenuImagePersistenceAdapter")
public class MenuImagePersistenceAdapter implements MenuImageRepository {

    private final CustomerMenuImageJpaRepository menuImageJpaRepository;

    public MenuImagePersistenceAdapter(CustomerMenuImageJpaRepository menuImageJpaRepository) {
        this.menuImageJpaRepository = menuImageJpaRepository;
    }

    @Override
    public List<MenuImage> findAllByMenuId(Long menuId) {
        return menuImageJpaRepository.findByMenuIdOrderBySortOrder(menuId)
                .stream()
                .map(MenuImageJpaEntity::toDomain)
                .toList();
    }
}
