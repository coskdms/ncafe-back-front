package com.newlecture.backend.public_api.setting.application.service;

import com.newlecture.backend.admin.setting.application.service.AdminSettingService;
import com.newlecture.backend.admin.setting.domain.ShopSetting;
import com.newlecture.backend.public_api.setting.application.port.in.GetPublicSettingUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 공개 설정 조회 서비스 (admin의 SettingService를 위임)
 */
@Service
@RequiredArgsConstructor
public class PublicSettingService implements GetPublicSettingUseCase {

    private final AdminSettingService adminSettingService;

    @Override
    public ShopSetting getPublicSetting() {
        return adminSettingService.getSetting();
    }
}
