package com.newlecture.backend.admin.menu.application.port.in;

import com.newlecture.backend.admin.menu.application.port.in.result.MenuDetailResult;

/**
 * 어드민 인바운드 포트: 메뉴 상세 조회
 */
public interface GetAdminMenuDetailUseCase {
    MenuDetailResult getMenuDetailById(Long id);
}
