package com.newlecture.backend.service;

import com.newlecture.backend.dto.MenuCreateRequest;
import com.newlecture.backend.dto.MenuCreateResponse;
import com.newlecture.backend.dto.MenuDetailResponse;
import com.newlecture.backend.dto.MenuListRequest;
import com.newlecture.backend.dto.MenuListResponse;
import com.newlecture.backend.dto.MenuUpdateRequest;
import com.newlecture.backend.dto.MenuUpdateResponse;

public interface MenuService {
    MenuListResponse getMenus(MenuListRequest request);

    MenuDetailResponse getMenu(Long id);

    MenuCreateResponse createMenu(MenuCreateRequest request);

    MenuUpdateResponse updateMenu(MenuUpdateRequest request);

    void deleteMenu(Long id);
}
