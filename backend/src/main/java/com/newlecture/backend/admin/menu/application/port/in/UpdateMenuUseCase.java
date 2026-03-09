package com.newlecture.backend.admin.menu.application.port.in;

import java.util.List;

import com.newlecture.backend.admin.menu.application.port.in.command.UpdateMenuCommand;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuSaveResult;

/**
 * 어드민 인바운드 포트: 메뉴 수정
 */
public interface UpdateMenuUseCase {
    MenuSaveResult updateMenu(UpdateMenuCommand command);
    void updateAvailability(Long id, boolean isAvailable);
    void updateSortOrder(List<Long> menuIds);
}
