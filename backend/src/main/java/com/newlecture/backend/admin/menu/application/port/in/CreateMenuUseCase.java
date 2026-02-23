package com.newlecture.backend.admin.menu.application.port.in;

import com.newlecture.backend.admin.menu.application.port.in.command.CreateMenuCommand;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuSaveResult;

/**
 * 어드민 인바운드 포트: 메뉴 생성
 */
public interface CreateMenuUseCase {
    MenuSaveResult createMenu(CreateMenuCommand command);
}
