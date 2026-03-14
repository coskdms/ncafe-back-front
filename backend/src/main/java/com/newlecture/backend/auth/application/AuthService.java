package com.newlecture.backend.auth.application;

import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.port.in.AuthUseCase;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 인증 서비스: AuthUseCase 구현체
 * - 로그인: nickname으로 회원 조회 → PasswordEncoder로 비밀번호 검증
 * - 회원가입: 비밀번호를 해싱하여 users 테이블에 저장
 */
@Service
public class AuthService implements AuthUseCase {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final KakaoService kakaoService;

    public AuthService(MemberRepository memberRepository, PasswordEncoder passwordEncoder, KakaoService kakaoService) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.kakaoService = kakaoService;
    }

    @Override
    public Member login(String nickname, String password) {
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    @Override
    public Member signup(Member member) {
        if (memberRepository.existsByNickname(member.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        member.setPassword(passwordEncoder.encode(member.getPassword()));
        member.setRole("USER");
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());

        return memberRepository.save(member);
    }

    @Override
    public boolean isNicknameDuplicated(String nickname) {
        return memberRepository.existsByNickname(nickname);
    }

    @Override
    public Member kakaoLogin(String code) {
        String accessToken = kakaoService.getAccessToken(code);
        Map<String, Object> userInfo = kakaoService.getUserInfo(accessToken);
        String socialId = String.valueOf(userInfo.get("id"));
        
        @SuppressWarnings("unchecked")
        Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");
        String kakaoNickname = (properties != null && properties.get("nickname") != null) 
                          ? (String) properties.get("nickname") 
                          : "카카오유저_" + socialId;

        return memberRepository.findBySocialId("KAKAO", socialId)
                .orElseGet(() -> {
                    String finalNickname = kakaoNickname;
                    int suffix = 1;
                    while (memberRepository.existsByNickname(finalNickname)) {
                        finalNickname = kakaoNickname + "_" + (socialId.length() > 4 ? socialId.substring(socialId.length()-4) : socialId) + (suffix > 1 ? suffix : "");
                        suffix++;
                    }

                    Member newMember = Member.createSocialMember(finalNickname, "KAKAO", socialId);
                    newMember.setCreatedAt(LocalDateTime.now());
                    newMember.setUpdatedAt(LocalDateTime.now());
                    return memberRepository.save(newMember);
                });
    }

    /**
     * 전화번호로 아이디 찾기 → 마스킹된 닉네임 반환
     */
    public String findIdByPhone(String phone) {
        Member member = memberRepository.findByPhone(phone)
                .orElseThrow(() -> new IllegalArgumentException("등록된 전화번호가 없습니다."));
        return maskNickname(member.getNickname());
    }

    /**
     * 비밀번호 찾기 1단계: 닉네임 + 전화번호 → 보안질문 반환
     */
    public String getSecurityQuestion(String nickname, String phone) {
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        if (member.getPhone() == null || !member.getPhone().equals(phone)) {
            throw new IllegalArgumentException("등록된 전화번호와 일치하지 않습니다.");
        }

        if (member.getSecurityQuestion() == null) {
            throw new IllegalArgumentException("보안 질문이 설정되지 않은 계정입니다.");
        }

        return member.getSecurityQuestion();
    }

    /**
     * 비밀번호 찾기 2단계: 보안질문 답변 검증 + 비밀번호 재설정
     */
    public void resetPassword(String nickname, String phone, String securityAnswer, String newPassword) {
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        if (member.getPhone() == null || !member.getPhone().equals(phone)) {
            throw new IllegalArgumentException("등록된 전화번호와 일치하지 않습니다.");
        }

        if (member.getSecurityAnswer() == null || !member.getSecurityAnswer().equals(securityAnswer)) {
            throw new IllegalArgumentException("보안 질문 답변이 일치하지 않습니다.");
        }

        member.setPassword(passwordEncoder.encode(newPassword));
        member.setUpdatedAt(LocalDateTime.now());
        memberRepository.save(member);
    }

    /**
     * 닉네임 마스킹: chaena → ch***a
     */
    private String maskNickname(String nickname) {
        if (nickname == null || nickname.length() <= 2) return nickname;
        int len = nickname.length();
        int show = Math.max(2, len / 3);
        String start = nickname.substring(0, show);
        String end = nickname.substring(len - 1);
        return start + "*".repeat(len - show - 1) + end;
    }
}
