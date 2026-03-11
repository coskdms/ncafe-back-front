package com.newlecture.backend.admin.notification.application.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.newlecture.backend.admin.notification.application.port.out.NotificationRepository;
import com.newlecture.backend.admin.notification.domain.Notification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * 최근 알림 목록 조회 (최대 20건)
     */
    public List<Notification> getRecentNotifications() {
        return notificationRepository.findRecent();
    }

    /**
     * 읽지 않은 알림 수
     */
    public long getUnreadCount() {
        return notificationRepository.countUnread();
    }

    /**
     * 알림 생성 (다른 서비스에서 호출)
     */
    public Notification createNotification(String type, String title, String message, String link) {
        Notification notification = Notification.builder()
                .type(type)
                .title(title)
                .message(message)
                .link(link)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    /**
     * 단일 알림 읽음 처리
     */
    public void markAsRead(Long id) {
        notificationRepository.markAsRead(id);
    }

    /**
     * 모든 알림 읽음 처리
     */
    public void markAllAsRead() {
        notificationRepository.markAllAsRead();
    }
}
