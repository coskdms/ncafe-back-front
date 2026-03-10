package com.newlecture.backend.admin.setting.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopSetting {
    private String shopName;
    private String businessHours;
    private String shopPhone;
    private String shopAddress;
    private String notice;
    
    private Integer minOrderAmount;
    private Integer deliveryFee;
    private String estimatedPrepTime;
    
    private Double pointAccrualRate; // 0.01 = 1%
    private Integer level1Threshold;
    private Integer level2Threshold;
    private Integer level3Threshold;
    private Integer level4Threshold;
}
