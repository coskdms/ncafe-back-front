package com.newlecture.backend.admin.menu.application.port.in;

import com.newlecture.backend.admin.menu.application.port.in.result.MenuImageListResult;

/**
 * 어드민 인바운드 포트: 메뉴 이미지 목록 조회
 */
public interface GetAdminMenuImagesUseCase {
    MenuImageListResult getMenuImages(Long id);
}
