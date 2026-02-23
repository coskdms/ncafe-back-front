package com.newlecture.backend.admin.menu.application.port.in;

import com.newlecture.backend.admin.menu.application.port.in.command.UpdateMenuCommand;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuSaveResult;

/**
 * 어드민 인바운드 포트: 메뉴 수정
 */
public interface UpdateMenuUseCase {
    MenuSaveResult updateMenu(UpdateMenuCommand command);
}
