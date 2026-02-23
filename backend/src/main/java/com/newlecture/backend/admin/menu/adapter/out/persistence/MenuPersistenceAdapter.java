package com.newlecture.backend.admin.menu.adapter.out.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuJpaRepository;
import com.newlecture.backend.admin.menu.application.port.out.MenuRepository;
import com.newlecture.backend.admin.menu.domain.Menu;

/**
 * 아웃바운드 어댑터: 메뉴 영속성
 * 아웃바운드 포트(MenuRepository)를 구현하고,
 * JPA를 사용하여 DB에 접근한 뒤 도메인 객체로 변환하여 반환합니다.
 *
 * [Service] → [MenuRepository(포트)] → [MenuPersistenceAdapter(어댑터)]
 * │
 * AdminMenuJpaRepository (Spring Data JPA)
 * │
 * MenuJpaEntity ↔ Menu(도메인) 변환
 */
@Repository("adminMenuPersistenceAdapter")
public class MenuPersistenceAdapter implements MenuRepository {

    private final AdminMenuJpaRepository menuJpaRepository;

    public MenuPersistenceAdapter(AdminMenuJpaRepository menuJpaRepository) {
        this.menuJpaRepository = menuJpaRepository;
    }

    @Override
    public List<Menu> findAllByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery) {
        List<MenuJpaEntity> entities;

        boolean hasCategoryId = categoryId != null;
        boolean hasSearchQuery = searchQuery != null && !searchQuery.trim().isEmpty();

        if (hasCategoryId && hasSearchQuery) {
            entities = menuJpaRepository.findByCategoryIdAndKorNameContaining(
                    String.valueOf(categoryId), searchQuery.trim());
        } else if (hasCategoryId) {
            entities = menuJpaRepository.findByCategoryId(String.valueOf(categoryId));
        } else if (hasSearchQuery) {
            entities = menuJpaRepository.findByKorNameContaining(searchQuery.trim());
        } else {
            entities = menuJpaRepository.findAll();
        }

        return entities.stream()
                .map(MenuJpaEntity::toDomain)
                .toList();
    }

    @Override
    public Menu findById(Long id) {
        return menuJpaRepository.findById(id)
                .map(MenuJpaEntity::toDomain)
                .orElse(null);
    }
}
