package com.newlecture.backend.admin.notification.application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * SSE 실시간 알림 서비스 📡
 * - 관리자/사용자 구독 관리
 * - 이벤트 브로드캐스트
 */
@Slf4j
@Service
public class SseNotificationService {

    // 관리자 SSE 구독 (여러 관리자 동시 접속 가능)
    private final CopyOnWriteArrayList<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();

    // 사용자별 SSE 구독 (memberId → emitter)
    private final Map<String, SseEmitter> userEmitters = new ConcurrentHashMap<>();

    private static final long SSE_TIMEOUT = 5 * 60 * 1000L; // 5분

    /**
     * 관리자 구독
     */
    public SseEmitter subscribeAdmin() {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        adminEmitters.add(emitter);

        emitter.onCompletion(() -> adminEmitters.remove(emitter));
        emitter.onTimeout(() -> adminEmitters.remove(emitter));
        emitter.onError(e -> adminEmitters.remove(emitter));

        // 연결 성공 이벤트
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("관리자 실시간 알림 연결 성공! 🐤"));
        } catch (IOException e) {
            adminEmitters.remove(emitter);
        }

        log.info("[SSE] Admin subscribed. Total admin connections: {}", adminEmitters.size());
        return emitter;
    }

    /**
     * 사용자 구독 (멤버 ID로 식별)
     */
    public SseEmitter subscribeUser(String memberId) {
        // 기존 연결 제거
        SseEmitter old = userEmitters.remove(memberId);
        if (old != null) {
            old.complete();
        }

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        userEmitters.put(memberId, emitter);

        emitter.onCompletion(() -> userEmitters.remove(memberId));
        emitter.onTimeout(() -> userEmitters.remove(memberId));
        emitter.onError(e -> userEmitters.remove(memberId));

        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("실시간 알림 연결 완료다덕! 🐤"));
        } catch (IOException e) {
            userEmitters.remove(memberId);
        }

        log.info("[SSE] User {} subscribed. Total user connections: {}", memberId, userEmitters.size());
        return emitter;
    }

    /**
     * 관리자 전체에게 이벤트 발송
     */
    public void notifyAdmins(String eventName, Object data) {
        log.info("[SSE] Broadcasting to {} admins: {} - {}", adminEmitters.size(), eventName, data);
        for (SseEmitter emitter : adminEmitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
            } catch (IOException e) {
                adminEmitters.remove(emitter);
            }
        }
    }

    /**
     * 특정 사용자에게 이벤트 발송
     */
    public void notifyUser(String memberId, String eventName, Object data) {
        SseEmitter emitter = userEmitters.get(memberId);
        if (emitter != null) {
            try {
                log.info("[SSE] Sending to user {}: {} - {}", memberId, eventName, data);
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
            } catch (IOException e) {
                userEmitters.remove(memberId);
            }
        }
    }
}
