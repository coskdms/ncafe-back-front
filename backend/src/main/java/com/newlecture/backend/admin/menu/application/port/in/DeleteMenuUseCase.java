package com.newlecture.backend.admin.menu.application.port.in;

/**
 * 어드민 인바운드 포트: 메뉴 삭제
 */
public interface DeleteMenuUseCase {
    void deleteMenu(Long id);
}
