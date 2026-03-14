package com.newlecture.backend.auth.adapter.in.web;

import com.newlecture.backend.auth.adapter.in.web.dto.LoginRequest;
import com.newlecture.backend.auth.adapter.in.web.dto.SignupRequest;
import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.port.in.AuthUseCase;
import com.newlecture.backend.auth.application.AuthService;
import com.newlecture.backend.config.JwtProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthUseCase authUseCase;
    private final AuthService authService;
    private final JwtProvider jwtProvider;

    public AuthController(AuthUseCase authUseCase, AuthService authService, JwtProvider jwtProvider) {
        this.authUseCase = authUseCase;
        this.authService = authService;
        this.jwtProvider = jwtProvider;
    }

    /**
     * POST /v1/auth/login
     * 로그인 성공 시 JWT를 JSON body로 반환 (BFF 서버가 받음)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // ... 기존 코드
        return loginProcess(request.getNickname(), request.getPassword());
    }

    /**
     * GET /auth/kakao?code=xxx
     * 카카오 인증 완료 후 리다이렉트되어 오는 엔드포인트
     */
    @GetMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestParam String code) {
        try {
            Member member = authUseCase.kakaoLogin(code);
            return createAuthResponse(member);
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "카카오 로그인 실패: " + e.getMessage()));
        }
    }

    private ResponseEntity<?> loginProcess(String nickname, String password) {
        try {
            Member member = authUseCase.login(nickname, password);
            return createAuthResponse(member);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    private ResponseEntity<?> createAuthResponse(Member member) {
        String accessToken = jwtProvider.createAccessToken(member.getNickname(), member.getRole());
        return ResponseEntity.ok(Map.of(
                "token", accessToken,
                "id", member.getId(),
                "nickname", member.getNickname(),
                "role", member.getRole(),
                "socialProvider", member.getSocialProvider()));
    }


    /**
     * GET /v1/auth/me
     * Authorization: Bearer {JWT} 헤더에서 인증 정보 추출
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "로그인되지 않았습니다."));
        }

        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

        return ResponseEntity.ok(Map.of(
                "username", username,
                "role", role));
    }

    /**
     * POST /v1/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            Member member = Member.builder()
                    .nickname(request.getNickname())
                    .password(request.getPassword())
                    .phone(request.getPhone())
                    .securityQuestion(request.getSecurityQuestion())
                    .securityAnswer(request.getSecurityAnswer())
                    .build();

            Member created = authUseCase.signup(member);

            return ResponseEntity.status(201).body(Map.of(
                    "id", created.getId(),
                    "nickname", created.getNickname(),
                    "role", created.getRole()));
        } catch (IllegalArgumentException e) {
            // 비즈니스 로직 에러 (닉네임 중복 등) → 사용자에게 실제 메시지 전달
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            // 예상치 못한 시스템 에러 (DB 오류 등) → 내부 정보 숨김
            System.err.println("[회원가입 오류] " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("message", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
        }
    }

    /**
     * GET /v1/auth/check-nickname?nickname=xxx
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean duplicated = authUseCase.isNicknameDuplicated(nickname);
        return ResponseEntity.ok(Map.of("duplicated", duplicated));
    }

    /**
     * GET /v1/auth/find-id?phone=010...
     * 전화번호로 아이디 찾기
     */
    @GetMapping("/find-id")
    public ResponseEntity<?> findId(@RequestParam String phone) {
        try {
            String maskedNickname = authService.findIdByPhone(phone);
            return ResponseEntity.ok(Map.of("found", true, "nickname", maskedNickname));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(Map.of("found", false, "message", e.getMessage()));
        }
    }

    /**
     * POST /v1/auth/find-password/verify
     * 닉네임 + 전화번호 검증 → 보안질문 반환
     */
    @PostMapping("/find-password/verify")
    public ResponseEntity<?> findPasswordVerify(@RequestBody Map<String, String> request) {
        try {
            String nickname = request.get("nickname");
            String phone = request.get("phone");
            String question = authService.getSecurityQuestion(nickname, phone);
            return ResponseEntity.ok(Map.of("verified", true, "question", question));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("verified", false, "message", e.getMessage()));
        }
    }

    /**
     * POST /v1/auth/find-password/reset
     * 보안질문 답변 검증 + 비밀번호 재설정
     */
    @PostMapping("/find-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String nickname = request.get("nickname");
            String phone = request.get("phone");
            String securityAnswer = request.get("securityAnswer");
            String newPassword = request.get("newPassword");
            authService.resetPassword(nickname, phone, securityAnswer, newPassword);
            return ResponseEntity.ok(Map.of("success", true, "message", "비밀번호가 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
