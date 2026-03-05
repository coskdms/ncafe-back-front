package com.newlecture.backend.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    private String id; // UUID 문자열
    private String nickname; // 로그인 식별자 (아이디)
    private String password;
    private String role; // "USER", "ADMIN"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
