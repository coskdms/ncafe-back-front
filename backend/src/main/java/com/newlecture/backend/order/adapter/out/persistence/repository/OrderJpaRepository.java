package com.newlecture.backend.order.adapter.out.persistence.repository;

import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderJpaRepository extends JpaRepository<OrderJpaEntity, Long> {
    Optional<OrderJpaEntity> findByPaymentId(String paymentId);
    List<OrderJpaEntity> findAllByMemberIdOrderByCreatedAtDesc(UUID memberId);
    List<OrderJpaEntity> findAllByOrderByCreatedAtDesc();
}
