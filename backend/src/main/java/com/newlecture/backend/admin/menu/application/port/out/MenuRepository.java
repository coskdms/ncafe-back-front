package com.newlecture.backend.admin.menu.application.port.out;

import java.util.List;

import com.newlecture.backend.admin.menu.domain.Menu;

/**
 * 아웃바운드 포트: 메뉴 영속성
 */
public interface MenuRepository {
    List<Menu> findAllByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery);

    Menu findById(Long id);
}
