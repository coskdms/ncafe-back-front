package com.newlecture.backend.auth.application.service;

import com.newlecture.backend.auth.application.port.out.MemberRepository;
import com.newlecture.backend.auth.domain.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public Member getMyInfo() {
        String nickname = SecurityContextHolder.getContext().getAuthentication().getName();
        return memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    /**
     * 포인트 사용
     */
    public void usePoints(String nickname, int points) {
        if (points <= 0) return;
        
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (member.getCurrentPoints() < points) {
            throw new RuntimeException("보유 포인트가 부족합니다.");
        }

        member.setCurrentPoints(member.getCurrentPoints() - points);
        memberRepository.save(member);
    }

    /**
     * 포인트 환불 (주문 취소 시)
     */
    public void refundPoints(String nickname, int points) {
        if (points <= 0) return;
        
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        member.setCurrentPoints(member.getCurrentPoints() + points);
        memberRepository.save(member);
    }

    /**
     * 포인트 회수 (주문 취소 시 적립되었던 포인트 차감)
     */
    public void revokePoints(String nickname, int price) {
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        int earnedPoints = (int) (price * 0.05);
        member.setCurrentPoints(Math.max(0, member.getCurrentPoints() - earnedPoints));
        member.setTotalAccumulatedPoints(Math.max(0, member.getTotalAccumulatedPoints() - earnedPoints));

        // 성장 단계 재계산
        updateGrowthLevel(member);

        memberRepository.save(member);
    }

    /**
     * 포인트 적립 및 성장 단계 업데이트
     */
    public void addPoints(String nickname, int price) {
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        int earnedPoints = (int) (price * 0.05); // 5% 적립
        member.setCurrentPoints(member.getCurrentPoints() + earnedPoints);
        member.setTotalAccumulatedPoints(member.getTotalAccumulatedPoints() + earnedPoints);
        member.setLastOrderDate(LocalDateTime.now());

        // 성장 단계 업데이트 로직
        updateGrowthLevel(member);

        memberRepository.save(member);
    }

    private void updateGrowthLevel(Member member) {
        int total = member.getTotalAccumulatedPoints();

        if (total >= 20000) {
            member.setGrowthLevel("Lv.4 현자 고라파덕");
        } else if (total >= 5000) {
            member.setGrowthLevel("Lv.3 청소년 골덕");
        } else if (total >= 1000) {
            member.setGrowthLevel("Lv.2 아기 파덕");
        } else {
            member.setGrowthLevel("Lv.1 갓 태어난 알");
        }
    }

    /**
     * 마이페이지 성장 정보 조회용 (다음 단계까지 남은 포인트 등)
     */
    public Map<String, Object> getGrowthInfo() {
        Member member = getMyInfo();
        int total = member.getTotalAccumulatedPoints();
        
        int nextGoal = 0;
        String nextLevel = "";
        
        if (total < 1000) {
            nextGoal = 1000;
            nextLevel = "Lv.2 아기 파덕";
        } else if (total < 5000) {
            nextGoal = 5000;
            nextLevel = "Lv.3 청소년 골덕";
        } else if (total < 20000) {
            nextGoal = 20000;
            nextLevel = "Lv.4 현자 고라파덕";
        }

        return Map.of(
            "nickname", member.getNickname(),
            "currentLevel", member.getGrowthLevel(),
            "currentPoints", member.getCurrentPoints(),
            "totalAccumulatedPoints", total,
            "nextLevel", nextLevel,
            "nextGoal", nextGoal,
            "remainingForNext", Math.max(0, nextGoal - total),
            "address", member.getAddress() != null ? member.getAddress() : "",
            "phone", member.getPhone() != null ? member.getPhone() : "",
            "lastOrderDate", member.getLastOrderDate() != null ? member.getLastOrderDate() : ""
        );
    }

    /**
     * 회원 프로필 수정 (주소, 전화번호)
     */
    public void updateProfile(String address, String phone) {
        Member member = getMyInfo();
        member.setAddress(address);
        member.setPhone(phone);
        member.setUpdatedAt(LocalDateTime.now());
        memberRepository.save(member);
    }

    /**
     * 비밀번호 수정
     */
    public void updatePassword(String currentPassword, String newPassword) {
        Member member = getMyInfo();

        if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        member.setPassword(passwordEncoder.encode(newPassword));
        member.setUpdatedAt(LocalDateTime.now());
        memberRepository.save(member);
    }
}
