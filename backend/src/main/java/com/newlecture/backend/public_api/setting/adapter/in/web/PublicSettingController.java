package com.newlecture.backend.public_api.setting.adapter.in.web;

import com.newlecture.backend.admin.setting.application.service.AdminSettingService;
import com.newlecture.backend.admin.setting.domain.ShopSetting;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 일반 사용자용 매장 정보 조회 API 🐤☕️
 */
@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class PublicSettingController {

    private final AdminSettingService adminSettingService;

    @GetMapping
    public ResponseEntity<ShopSetting> getPublicSettings() {
        return ResponseEntity.ok(adminSettingService.getSetting());
    }
}
