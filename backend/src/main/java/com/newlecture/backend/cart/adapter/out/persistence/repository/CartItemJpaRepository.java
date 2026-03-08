package com.newlecture.backend.cart.adapter.out.persistence.repository;

import com.newlecture.backend.cart.adapter.out.persistence.entity.CartItemJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemJpaRepository extends JpaRepository<CartItemJpaEntity, Long> {
    List<CartItemJpaEntity> findByMemberId(UUID memberId);
    Optional<CartItemJpaEntity> findByMemberIdAndMenuIdAndOptions(UUID memberId, Long menuId, String options);

    @Modifying
    @Transactional
    void deleteByMemberId(UUID memberId);
}
