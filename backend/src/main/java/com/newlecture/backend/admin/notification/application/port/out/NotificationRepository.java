package com.newlecture.backend.admin.notification.application.port.out;

import java.util.List;

import com.newlecture.backend.admin.notification.domain.Notification;

/**
 * 알림 아웃바운드 포트 (DB 접근 인터페이스)
 */
public interface NotificationRepository {
    List<Notification> findRecent();
    long countUnread();
    Notification save(Notification notification);
    void markAsRead(Long id);
    void markAllAsRead();
}
