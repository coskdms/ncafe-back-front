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
    private Long id;
    private String email;
    private String password;
    private String nickname;
    private String role; // "USER", "ADMIN"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
