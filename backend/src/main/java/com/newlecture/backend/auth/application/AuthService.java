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
}
