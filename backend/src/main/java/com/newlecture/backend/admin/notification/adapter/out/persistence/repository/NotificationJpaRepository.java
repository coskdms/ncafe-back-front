package com.newlecture.backend.admin.notification.adapter.out.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.newlecture.backend.admin.notification.adapter.out.persistence.entity.NotificationJpaEntity;

public interface NotificationJpaRepository extends JpaRepository<NotificationJpaEntity, Long> {

    List<NotificationJpaEntity> findTop20ByOrderByCreatedAtDesc();

    long countByIsReadFalse();

    @Modifying
    @Query("UPDATE NotificationJpaEntity n SET n.isRead = true WHERE n.isRead = false")
    void markAllAsRead();
}
