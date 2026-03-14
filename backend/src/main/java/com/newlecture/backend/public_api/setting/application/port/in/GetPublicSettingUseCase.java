package com.newlecture.backend.public_api.setting.application.port.in;

import com.newlecture.backend.admin.setting.domain.ShopSetting;

/**
 * 공개 설정 조회 UseCase 인터페이스
 */
public interface GetPublicSettingUseCase {
    ShopSetting getPublicSetting();
}
