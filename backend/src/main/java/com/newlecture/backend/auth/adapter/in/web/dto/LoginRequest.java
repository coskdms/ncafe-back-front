package com.newlecture.backend.auth.adapter.in.web.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String nickname; // 아이디
    private String password;
}
