package com.newlecture.backend.auth.adapter.in.web.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String nickname;
}
