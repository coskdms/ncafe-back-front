package com.newlecture.backend.admin.menu.adapter.out.persistence.repository;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuOptionGroupJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AdminMenuOptionGroupJpaRepository extends JpaRepository<MenuOptionGroupJpaEntity, Long> {
    List<MenuOptionGroupJpaEntity> findAllByMenuIdOrderBySortOrderAsc(Long menuId);

    @Modifying
    @Transactional
    void deleteByMenuId(Long menuId);
}
