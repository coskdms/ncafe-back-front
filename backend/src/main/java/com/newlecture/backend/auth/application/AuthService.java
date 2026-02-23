package com.newlecture.backend.auth.application;

import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.port.in.AuthUseCase;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 애플리케이션 서비스: AuthUseCase 구현체
 * 인바운드 포트를 구현하고, 아웃바운드 포트를 사용합니다.
 * 
 * TODO: 여기에 실제 인증 로직을 구현하세요
 * - 비밀번호 해싱, 검증
 * - 세션/토큰 관리 등
 */
@Service
public class AuthService implements AuthUseCase {

    private final MemberRepository memberRepository;

    public AuthService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public Member login(String email, String password) {
        // TODO: 여기에 실제 인증 로직을 구현하세요
        // 1. 이메일로 회원 조회
        // 2. 비밀번호 검증 (해싱 비교)
        // 3. 인증 성공 시 회원 정보 반환

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 이메일입니다."));

        // TODO: 비밀번호 비교 로직 구현
        // 예: if (!passwordEncoder.matches(password, member.getPassword())) { throw ...
        // }
        if (!member.getPassword().equals(password)) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    @Override
    public Member signup(Member member) {
        // TODO: 여기에 가입 로직을 구현하세요
        // 1. 이메일 중복 확인
        // 2. 비밀번호 해싱
        // 3. 회원 저장

        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // TODO: 비밀번호 해싱 구현
        // 예: member.setPassword(passwordEncoder.encode(member.getPassword()));

        member.setRole("USER");
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());

        return memberRepository.save(member);
    }

    @Override
    public boolean isEmailDuplicated(String email) {
        return memberRepository.existsByEmail(email);
    }
}
