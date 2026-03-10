package com.newlecture.backend.admin.setting.application.service;

import com.newlecture.backend.admin.setting.adapter.out.persistence.entity.ShopSettingJpaEntity;
import com.newlecture.backend.admin.setting.adapter.out.persistence.repository.ShopSettingJpaRepository;
import com.newlecture.backend.admin.setting.domain.ShopSetting;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminSettingService {
    
    private final ShopSettingJpaRepository shopSettingRepository;

    /**
     * 설정 조회 (없을 경우 기본값 생성)
     */
    public ShopSetting getSetting() {
        return shopSettingRepository.findById(1L)
                .map(ShopSettingJpaEntity::toDomain)
                .orElseGet(() -> {
                   ShopSetting defaultSetting = ShopSetting.builder()
                           .shopName("N-Cafe 우리동네 커피숍")
                           .businessHours("09:00 - 20:00")
                           .shopPhone("010-0000-0000")
                           .shopAddress("신흥로 200번길 1층 파덕이네")
                           .notice("오늘도 향기로운 하루 되세요! 🐤☕️")
                           .minOrderAmount(10000)
                           .deliveryFee(3000)
                           .estimatedPrepTime("15분 - 20분")
                           .pointAccrualRate(0.01) // 기본 1% 적립
                           .level1Threshold(0)
                           .level2Threshold(1001)
                           .level3Threshold(5001)
                           .level4Threshold(20001)
                           .build();
                   
                   shopSettingRepository.save(ShopSettingJpaEntity.fromDomain(defaultSetting));
                   return defaultSetting;
                });
    }

    /**
     * 설정 업데이트
     */
    public ShopSetting updateSetting(ShopSetting setting) {
        ShopSettingJpaEntity entity = ShopSettingJpaEntity.fromDomain(setting);
        return shopSettingRepository.save(entity).toDomain();
    }
}
