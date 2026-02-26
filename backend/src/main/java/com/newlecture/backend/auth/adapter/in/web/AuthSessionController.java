package com.newlecture.backend.auth.adapter.in.web;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * 현재 로그인된 사용자의 인증 정보를 제공하는 API
 * 프론트엔드에서 페이지 새로고침 시에도 로그인 상태를 유지하기 위해 사용됩니다.
 */
@RestController
@RequestMapping("/auth")
public class AuthSessionController {

        /**
         * GET /api/auth/me
         * 현재 로그인된 사용자의 정보를 반환합니다.
         * 로그인되지 않은 경우 401 Unauthorized를 반환합니다.
         */
        @GetMapping("/me")
        public ResponseEntity<?> getCurrentUser() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                // 로그인하지 않았거나 익명 사용자인 경우
                if (authentication == null || !authentication.isAuthenticated()
                                || "anonymousUser".equals(authentication.getPrincipal())) {
                        return ResponseEntity.status(401)
                                        .body(Map.of("error", "로그인되지 않았습니다."));
                }

                // 로그인된 사용자 정보 반환
                String username = authentication.getName();
                String role = authentication.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.joining(","));

                return ResponseEntity.ok(Map.of(
                                "username", username,
                                "role", role));
        }
}
