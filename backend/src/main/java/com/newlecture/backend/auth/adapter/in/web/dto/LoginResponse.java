package com.newlecture.backend.auth.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String email;
    private String nickname;
    private String role;
}
