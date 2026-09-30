package com.newlecture.backend.order.adapter.out.persistence.repository;

import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface OrderJpaRepository extends JpaRepository<OrderJpaEntity, Long> {
    Optional<OrderJpaEntity> findByPaymentId(String paymentId);
    List<OrderJpaEntity> findAllByMemberIdOrderByCreatedAtDesc(UUID memberId);
    List<OrderJpaEntity> findAllByOrderByCreatedAtDesc();
    List<OrderJpaEntity> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime dateTime);

    @Query("SELECT COUNT(o) FROM OrderJpaEntity o WHERE o.createdAt BETWEEN :start AND :end AND o.status IN :statuses")
    long countByCreatedAtBetweenAndStatusIn(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end,
        @Param("statuses") List<OrderStatus> statuses
    );

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM OrderJpaEntity o WHERE o.createdAt BETWEEN :start AND :end AND o.status IN :statuses")
    long sumTotalPriceByCreatedAtBetweenAndStatusIn(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end,
        @Param("statuses") List<OrderStatus> statuses
    );
}
