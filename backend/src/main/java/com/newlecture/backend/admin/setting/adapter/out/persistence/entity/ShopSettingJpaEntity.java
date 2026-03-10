package com.newlecture.backend.admin.setting.adapter.out.persistence.entity;

import com.newlecture.backend.admin.setting.domain.ShopSetting;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shop_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopSettingJpaEntity {

    @Id
    @Builder.Default
    private Long id = 1L; // 항상 1번 레코드만 사용 (Singleton pattern)

    @Column(nullable = false)
    private String shopName;

    private String businessHours;
    private String shopPhone;
    private String shopAddress;

    @Column(columnDefinition = "TEXT")
    private String notice;

    private Integer minOrderAmount;
    private Integer deliveryFee;
    private String estimatedPrepTime;

    @Column(nullable = false)
    private Double pointAccrualRate; // 결제금액의 몇 %를 적립할지 (0.01 = 1%)

    private Integer level1Threshold;
    private Integer level2Threshold;
    private Integer level3Threshold;
    private Integer level4Threshold;

    public ShopSetting toDomain() {
        return ShopSetting.builder()
                .shopName(shopName)
                .businessHours(businessHours)
                .shopPhone(shopPhone)
                .shopAddress(shopAddress)
                .notice(notice)
                .minOrderAmount(minOrderAmount)
                .deliveryFee(deliveryFee)
                .estimatedPrepTime(estimatedPrepTime)
                .pointAccrualRate(pointAccrualRate)
                .level1Threshold(level1Threshold)
                .level2Threshold(level2Threshold)
                .level3Threshold(level3Threshold)
                .level4Threshold(level4Threshold)
                .build();
    }

    public static ShopSettingJpaEntity fromDomain(ShopSetting domain) {
        return ShopSettingJpaEntity.builder()
                .id(1L)
                .shopName(domain.getShopName())
                .businessHours(domain.getBusinessHours())
                .shopPhone(domain.getShopPhone())
                .shopAddress(domain.getShopAddress())
                .notice(domain.getNotice())
                .minOrderAmount(domain.getMinOrderAmount())
                .deliveryFee(domain.getDeliveryFee())
                .estimatedPrepTime(domain.getEstimatedPrepTime())
                .pointAccrualRate(domain.getPointAccrualRate())
                .level1Threshold(domain.getLevel1Threshold())
                .level2Threshold(domain.getLevel2Threshold())
                .level3Threshold(domain.getLevel3Threshold())
                .level4Threshold(domain.getLevel4Threshold())
                .build();
    }
}
