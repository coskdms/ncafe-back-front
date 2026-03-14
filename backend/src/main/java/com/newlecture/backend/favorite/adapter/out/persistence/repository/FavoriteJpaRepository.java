package com.newlecture.backend.favorite.adapter.out.persistence.repository;

import com.newlecture.backend.favorite.adapter.out.persistence.entity.FavoriteJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoriteJpaRepository extends JpaRepository<FavoriteJpaEntity, Long> {

    List<FavoriteJpaEntity> findByMemberIdOrderByCreatedAtDesc(UUID memberId);

    Optional<FavoriteJpaEntity> findByMemberIdAndMenuId(UUID memberId, Long menuId);

    boolean existsByMemberIdAndMenuId(UUID memberId, Long menuId);

    void deleteByMemberIdAndMenuId(UUID memberId, Long menuId);

    @Query("SELECT f.menuId FROM FavoriteJpaEntity f WHERE f.memberId = :memberId")
    List<Long> findMenuIdsByMemberId(UUID memberId);

    long countByMemberId(UUID memberId);
}
