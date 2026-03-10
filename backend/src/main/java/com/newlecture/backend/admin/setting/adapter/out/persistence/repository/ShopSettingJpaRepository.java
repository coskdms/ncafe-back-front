package com.newlecture.backend.admin.setting.adapter.out.persistence.repository;

import com.newlecture.backend.admin.setting.adapter.out.persistence.entity.ShopSettingJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopSettingJpaRepository extends JpaRepository<ShopSettingJpaEntity, Long> {
}
