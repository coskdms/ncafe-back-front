package com.newlecture.backend.admin.notification.adapter.out.persistence;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.newlecture.backend.admin.notification.adapter.out.persistence.entity.NotificationJpaEntity;
import com.newlecture.backend.admin.notification.adapter.out.persistence.repository.NotificationJpaRepository;
import com.newlecture.backend.admin.notification.application.port.out.NotificationRepository;
import com.newlecture.backend.admin.notification.domain.Notification;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationPersistenceAdapter implements NotificationRepository {

    private final NotificationJpaRepository jpaRepository;

    @Override
    public List<Notification> findRecent() {
        return jpaRepository.findTop20ByOrderByCreatedAtDesc()
                .stream()
                .map(NotificationJpaEntity::toDomain)
                .toList();
    }

    @Override
    public long countUnread() {
        return jpaRepository.countByIsReadFalse();
    }

    @Override
    public Notification save(Notification notification) {
        NotificationJpaEntity entity = NotificationJpaEntity.fromDomain(notification);
        return jpaRepository.save(entity).toDomain();
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        jpaRepository.findById(id).ifPresent(entity -> {
            entity.setIsRead(true);
            jpaRepository.save(entity);
        });
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        jpaRepository.markAllAsRead();
    }
}
