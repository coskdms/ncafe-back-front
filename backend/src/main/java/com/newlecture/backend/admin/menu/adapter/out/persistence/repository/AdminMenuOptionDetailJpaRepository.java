package com.newlecture.backend.admin.menu.adapter.out.persistence.repository;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuOptionDetailJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AdminMenuOptionDetailJpaRepository extends JpaRepository<MenuOptionDetailJpaEntity, Long> {
    List<MenuOptionDetailJpaEntity> findAllByOptionGroupIdOrderBySortOrderAsc(Long optionGroupId);
    List<MenuOptionDetailJpaEntity> findAllByOptionGroupIdInOrderBySortOrderAsc(List<Long> optionGroupIds);

    @Modifying
    @Transactional
    void deleteByOptionGroupIdIn(List<Long> optionGroupIds);
}
