package com.newlecture.backend.menu.application.port.in;

import com.newlecture.backend.menu.application.port.in.result.CustomerMenuDetailResult;

/**
 * 일반 사용자 인바운드 포트: 메뉴 상세 조회 (공개 정보만)
 */
public interface GetCustomerMenuDetailUseCase {
    CustomerMenuDetailResult getMenuDetailById(Long id);
}
