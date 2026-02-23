package com.newlecture.backend.admin.menu.application.port.in;

import com.newlecture.backend.admin.menu.application.port.in.command.GetMenuListCommand;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuListResult;

/**
 * 어드민 인바운드 포트: 메뉴 목록 조회 (판매중지 포함)
 */
public interface GetAdminMenuListUseCase {
    MenuListResult getMenus(GetMenuListCommand command);
}
