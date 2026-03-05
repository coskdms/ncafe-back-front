package com.newlecture.backend.auth.adapter.in.web.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String nickname;
    private String password;
}
