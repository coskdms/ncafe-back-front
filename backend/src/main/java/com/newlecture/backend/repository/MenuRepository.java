package com.newlecture.backend.repository;

import java.util.List;

import com.newlecture.backend.entity.Menu;

public interface MenuRepository {
    List<Menu> findAllByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery);
}
