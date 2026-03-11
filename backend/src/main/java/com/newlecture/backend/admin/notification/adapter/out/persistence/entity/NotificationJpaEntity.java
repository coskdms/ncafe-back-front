package com.newlecture.backend.admin.notification.adapter.out.persistence.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

import com.newlecture.backend.admin.notification.domain.Notification;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admin_notifications")
public class NotificationJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String type;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(length = 500)
    private String link;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ========== 변환 메서드 ==========

    public Notification toDomain() {
        return Notification.builder()
                .id(this.id)
                .type(this.type)
                .title(this.title)
                .message(this.message)
                .link(this.link)
                .isRead(this.isRead)
                .createdAt(this.createdAt)
                .build();
    }

    public static NotificationJpaEntity fromDomain(Notification n) {
        return NotificationJpaEntity.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .link(n.getLink())
                .isRead(n.getIsRead() != null ? n.getIsRead() : false)
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt() : LocalDateTime.now())
                .build();
    }
}
