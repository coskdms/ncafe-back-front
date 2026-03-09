package com.newlecture.backend.auth.adapter.in.web;

import com.newlecture.backend.auth.application.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/growth")
    public ResponseEntity<?> getGrowthInfo() {
        try {
            return ResponseEntity.ok(memberService.getGrowthInfo());
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @org.springframework.web.bind.annotation.PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@org.springframework.web.bind.annotation.RequestBody ProfileRequest request) {
        try {
            memberService.updateProfile(request.getAddress(), request.getPhone());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @org.springframework.web.bind.annotation.PutMapping("/password")
    public ResponseEntity<?> updatePassword(@org.springframework.web.bind.annotation.RequestBody PasswordRequest request) {
        try {
            memberService.updatePassword(request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @lombok.Data
    public static class ProfileRequest {
        private String address;
        private String phone;
    }

    @lombok.Data
    public static class PasswordRequest {
        private String currentPassword;
        private String newPassword;
    }
}
