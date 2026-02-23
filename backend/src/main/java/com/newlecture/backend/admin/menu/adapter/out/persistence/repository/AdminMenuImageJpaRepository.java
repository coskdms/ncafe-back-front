package com.newlecture.backend.admin.menu.adapter.out.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuImageJpaEntity;

/**
 * Spring Data JPA Repository: menu_images 테이블
 */
public interface AdminMenuImageJpaRepository extends JpaRepository<MenuImageJpaEntity, Long> {

    List<MenuImageJpaEntity> findByMenuIdOrderBySortOrder(Long menuId);
}
