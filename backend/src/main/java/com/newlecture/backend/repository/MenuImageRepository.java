package com.newlecture.backend.repository;

import java.util.List;

import com.newlecture.backend.entity.MenuImage;

public interface MenuImageRepository {
    List<MenuImage> findAllByMenuId(Long menuId);
}
