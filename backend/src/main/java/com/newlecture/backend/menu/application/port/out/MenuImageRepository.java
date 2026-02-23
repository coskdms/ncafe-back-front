package com.newlecture.backend.menu.application.port.out;

import java.util.List;

import com.newlecture.backend.menu.domain.MenuImage;

/**
 * 아웃바운드 포트: 메뉴 이미지 영속성
 */
public interface MenuImageRepository {
    List<MenuImage> findAllByMenuId(Long menuId);
}
