package com.newlecture.backend.auth.application;

import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.port.in.AuthUseCase;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 인증 서비스: AuthUseCase 구현체
 * - 로그인: nickname으로 회원 조회 → PasswordEncoder로 비밀번호 검증
 * - 회원가입: 비밀번호를 해싱하여 users 테이블에 저장
 */
@Service
public class AuthService implements AuthUseCase {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Member login(String nickname, String password) {
        // 1. 닉네임(아이디)으로 회원 조회
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

        // 2. PasswordEncoder로 비밀번호 검증
        // DB에 저장된 비밀번호: {bcrypt}$2a$10$... ← DelegatingPasswordEncoder가 자동 처리
        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    @Override
    public Member signup(Member member) {
        // 1. 닉네임 중복 확인
        if (memberRepository.existsByNickname(member.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 2. 비밀번호 해싱 (DelegatingPasswordEncoder → {bcrypt} 접두사 자동 추가)
        member.setPassword(passwordEncoder.encode(member.getPassword()));

        // 3. 기본값 설정
        member.setRole("USER");
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());

        return memberRepository.save(member);
    }

    @Override
    public boolean isNicknameDuplicated(String nickname) {
        return memberRepository.existsByNickname(nickname);
    }
}
