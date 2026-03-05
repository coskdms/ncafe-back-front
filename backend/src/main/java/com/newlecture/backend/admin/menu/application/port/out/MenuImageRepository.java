package com.newlecture.backend.admin.menu.application.port.out;

import java.util.List;

import com.newlecture.backend.admin.menu.domain.MenuImage;

/**
 * 아웃바운드 포트: 메뉴 이미지 영속성
 */
public interface MenuImageRepository {
    List<MenuImage> findAllByMenuId(Long menuId);

    void deleteByMenuIdAndIdNotIn(Long menuId, List<Long> ids);

    void deleteByMenuId(Long menuId);

    void saveAll(List<MenuImage> menuImages);
}
