package com.newlecture.backend.admin.setting.adapter.in.web;

import com.newlecture.backend.admin.setting.application.service.AdminSettingService;
import com.newlecture.backend.admin.setting.domain.ShopSetting;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/settings")
@RequiredArgsConstructor
public class AdminSettingController {

    private final AdminSettingService adminSettingService;

    @GetMapping
    public ResponseEntity<ShopSetting> getSettings() {
        return ResponseEntity.ok(adminSettingService.getSetting());
    }

    @PutMapping
    public ResponseEntity<ShopSetting> updateSettings(@RequestBody ShopSetting setting) {
        return ResponseEntity.ok(adminSettingService.updateSetting(setting));
    }
}
