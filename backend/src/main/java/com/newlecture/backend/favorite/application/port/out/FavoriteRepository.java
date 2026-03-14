package com.newlecture.backend.favorite.application.port.out;

import com.newlecture.backend.favorite.adapter.out.persistence.entity.FavoriteJpaEntity;

import java.util.List;
import java.util.UUID;

/**
 * 찜(즐겨찾기) Repository 포트 (Driven Adapter 인터페이스)
 */
public interface FavoriteRepository {
    boolean existsByMemberIdAndMenuId(UUID memberId, Long menuId);
    void deleteByMemberIdAndMenuId(UUID memberId, Long menuId);
    FavoriteJpaEntity save(FavoriteJpaEntity entity);
    List<Long> findMenuIdsByMemberId(UUID memberId);
    long countByMemberId(UUID memberId);
}
