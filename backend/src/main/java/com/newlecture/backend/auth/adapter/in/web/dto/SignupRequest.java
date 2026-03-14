package com.newlecture.backend.auth.adapter.in.web.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String nickname;
    private String password;
    private String phone;
    private String securityQuestion;
    private String securityAnswer;
}
