package com.newlecture.backend.cart.application.port.out;

import com.newlecture.backend.cart.adapter.out.persistence.entity.CartItemJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * 장바구니 Repository 포트 (Driven Adapter 인터페이스)
 */
public interface CartItemRepository {
    List<CartItemJpaEntity> findByMemberId(UUID memberId);
    Optional<CartItemJpaEntity> findById(Long id);
    Optional<CartItemJpaEntity> findByMemberIdAndMenuIdAndOptions(UUID memberId, Long menuId, String options);
    CartItemJpaEntity save(CartItemJpaEntity entity);
    void delete(CartItemJpaEntity entity);
    void deleteByMemberId(UUID memberId);
}
