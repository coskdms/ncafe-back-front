package com.newlecture.backend.admin.menu.application.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.newlecture.backend.admin.menu.application.port.in.CreateMenuUseCase;
import com.newlecture.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.newlecture.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.newlecture.backend.admin.menu.application.port.in.command.CreateMenuCommand;
import com.newlecture.backend.admin.menu.application.port.in.command.UpdateMenuCommand;
import com.newlecture.backend.admin.menu.application.port.in.result.MenuSaveResult;
import com.newlecture.backend.admin.menu.application.port.out.MenuRepository;

@Service("adminMenuCommandService")
public class AdminMenuCommandService implements CreateMenuUseCase, UpdateMenuUseCase, DeleteMenuUseCase {

    private final MenuRepository menuRepository;

    public AdminMenuCommandService(
            @Qualifier("adminMenuPersistenceAdapter") MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @Override
    public MenuSaveResult createMenu(CreateMenuCommand command) {
        // TODO: 구현
        throw new UnsupportedOperationException("Unimplemented method 'createMenu'");
    }

    @Override
    public MenuSaveResult updateMenu(UpdateMenuCommand command) {
        // TODO: 구현
        throw new UnsupportedOperationException("Unimplemented method 'updateMenu'");
    }

    @Override
    public void deleteMenu(Long id) {
        // TODO: 구현
        throw new UnsupportedOperationException("Unimplemented method 'deleteMenu'");
    }
}
