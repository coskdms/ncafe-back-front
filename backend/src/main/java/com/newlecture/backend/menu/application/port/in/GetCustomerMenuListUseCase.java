package com.newlecture.backend.menu.application.port.in;

import com.newlecture.backend.menu.application.port.in.command.GetCustomerMenuListCommand;
import com.newlecture.backend.menu.application.port.in.result.CustomerMenuListResult;

/**
 * 일반 사용자 인바운드 포트: 메뉴 목록 조회 (판매중인 메뉴만)
 */
public interface GetCustomerMenuListUseCase {
    CustomerMenuListResult getMenus(GetCustomerMenuListCommand command);
}
