package com.newlecture.backend.auth.adapter.in.web;

import com.newlecture.backend.auth.adapter.in.web.dto.LoginRequest;
import com.newlecture.backend.auth.adapter.in.web.dto.LoginResponse;
import com.newlecture.backend.auth.adapter.in.web.dto.SignupRequest;
import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.port.in.AuthUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 인바운드 어댑터: REST 컨트롤러
 * AuthUseCase(인바운드 포트)에만 의존합니다.
 * 서비스 구현 방식이 바뀌어도 컨트롤러는 변하지 않습니다.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthUseCase authUseCase;

    public AuthController(AuthUseCase authUseCase) {
        this.authUseCase = authUseCase;
    }

    /**
     * POST /api/v1/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Member member = authUseCase.login(request.getEmail(), request.getPassword());

            LoginResponse response = LoginResponse.builder()
                    .id(member.getId())
                    .email(member.getEmail())
                    .nickname(member.getNickname())
                    .role(member.getRole())
                    .build();

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/v1/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            Member member = Member.builder()
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .nickname(request.getNickname())
                    .build();

            Member created = authUseCase.signup(member);

            LoginResponse response = LoginResponse.builder()
                    .id(created.getId())
                    .email(created.getEmail())
                    .nickname(created.getNickname())
                    .role(created.getRole())
                    .build();

            return ResponseEntity.status(201).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/v1/auth/check-email?email=xxx
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean duplicated = authUseCase.isEmailDuplicated(email);
        return ResponseEntity.ok(Map.of("duplicated", duplicated));
    }
}
