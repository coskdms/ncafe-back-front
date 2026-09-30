package com.newlecture.backend.admin.menu.adapter.out.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuJpaEntity;

/**
 * Spring Data JPA Repository: menus 테이블
 * 인프라 기술(JPA)에 의존하는 인터페이스로, 어댑터 레이어에만 존재합니다.
 */
public interface AdminMenuJpaRepository extends JpaRepository<MenuJpaEntity, Long> {

    List<MenuJpaEntity> findByCategoryId(String categoryId);

    List<MenuJpaEntity> findByKorNameContaining(String korName);

    List<MenuJpaEntity> findByCategoryIdAndKorNameContaining(String categoryId, String korName);

    long countByIsAvailableFalse();
}
