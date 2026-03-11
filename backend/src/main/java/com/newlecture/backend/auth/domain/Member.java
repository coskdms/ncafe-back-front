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
    
    @Builder.Default
    private String role = "USER"; // "USER", "ADMIN"

    @Builder.Default
    private String socialProvider = "LOCAL"; // LOCAL, KAKAO
    
    private String socialId;
    
    @Builder.Default
    private Integer currentPoints = 0;
    
    @Builder.Default
    private Integer totalAccumulatedPoints = 0;
    
    private LocalDateTime lastOrderDate;

    @Builder.Default
    private String growthLevel = "Lv.1 갓 태어난 알";

    private String address;
    private String phone;
    
    @Builder.Default
    private Boolean isActive = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public int getLevelInt() {
        try {
            if (growthLevel == null) return 1;
            // "Lv.4 현자 고라파덕" -> 4
            String levelStr = growthLevel.split(" ")[0].replace("Lv.", "");
            return Integer.parseInt(levelStr);
        } catch (Exception e) {
            return 1;
        }
    }

    public double getPointAccrualMultiplier() {
        int level = getLevelInt();
        return switch (level) {
            case 2 -> 2.0;
            case 3 -> 4.0;
            case 4 -> 7.0;
            default -> 1.0;
        };
    }

    public int getImmediateDiscount() {
        int level = getLevelInt();
        if (level == 4) return 1000;
        if (level == 3) return 500;
        return 0;
    }

    // 소셜 로그인 회원 생성을 위한 편의 메서드
    public static Member createSocialMember(String nickname, String provider, String socialId) {
        return Member.builder()
                .nickname(nickname)
                .password("") // 소셜 회원은 비밀번호 불필요
                .role("USER")
                .socialProvider(provider)
                .socialId(socialId)
                .currentPoints(0)
                .totalAccumulatedPoints(0)
                .growthLevel("Lv.1 갓 태어난 알")
                .isActive(true)
                .build();
    }
}
