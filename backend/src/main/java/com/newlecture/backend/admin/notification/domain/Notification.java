package com.newlecture.backend.admin.notification.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 관리자 알림 도메인
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private Long id;
    private String type;        // NEW_ORDER, SOLD_OUT, ORDER_STATUS, SYSTEM
    private String title;
    private String message;
    private String link;        // 클릭 시 이동 경로
    private Boolean isRead;
    private LocalDateTime createdAt;
}
