package com.newlecture.backend.admin.menu.application.port.out;

import com.newlecture.backend.admin.menu.domain.MenuOptionGroup;

import java.util.List;

public interface MenuOptionRepository {
    List<MenuOptionGroup> findByMenuId(Long menuId);
    void deleteByMenuId(Long menuId);
    MenuOptionGroup save(MenuOptionGroup optionGroup);
}
