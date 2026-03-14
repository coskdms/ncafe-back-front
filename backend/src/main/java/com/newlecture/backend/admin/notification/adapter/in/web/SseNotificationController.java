package com.newlecture.backend.admin.notification.adapter.in.web;

import com.newlecture.backend.admin.notification.application.service.SseNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * SSE 실시간 알림 구독 컨트롤러 📡
 */
@RestController
@RequestMapping("/sse")
@RequiredArgsConstructor
public class SseNotificationController {

    private final SseNotificationService sseService;

    /**
     * 관리자 실시간 알림 구독
     * GET /sse/admin
     */
    @GetMapping(value = "/admin", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeAdmin() {
        return sseService.subscribeAdmin();
    }

    /**
     * 사용자 실시간 알림 구독
     * GET /sse/user/{memberId}
     */
    @GetMapping(value = "/user/{memberId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeUser(@PathVariable String memberId) {
        return sseService.subscribeUser(memberId);
    }
}
