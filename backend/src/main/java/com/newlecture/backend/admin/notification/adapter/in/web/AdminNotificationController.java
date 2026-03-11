package com.newlecture.backend.admin.notification.adapter.in.web;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.newlecture.backend.admin.notification.application.service.NotificationService;
import com.newlecture.backend.admin.notification.domain.Notification;

import lombok.RequiredArgsConstructor;

/**
 * 관리자 알림 REST 컨트롤러 🔔
 */
@RestController
@RequestMapping("/admin/notifications")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final NotificationService notificationService;

    /**
     * 최근 알림 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        return ResponseEntity.ok(notificationService.getRecentNotifications());
    }

    /**
     * 읽지 않은 알림 수 조회
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = notificationService.getUnreadCount();
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * 특정 알림 읽음 처리
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "읽음 처리 완료"));
    }

    /**
     * 모든 알림 읽음 처리
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(Map.of("message", "모든 알림 읽음 처리 완료"));
    }
}
