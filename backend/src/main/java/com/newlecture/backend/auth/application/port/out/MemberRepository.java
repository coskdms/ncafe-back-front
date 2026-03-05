package com.newlecture.backend.auth.application.port.out;

import com.newlecture.backend.auth.domain.Member;

import java.util.Optional;

/**
 * 아웃바운드 포트: 회원 영속성 인터페이스
 * users 테이블에 접근합니다.
 */
public interface MemberRepository {

    /**
     * 닉네임으로 회원 조회
     */
    Optional<Member> findByNickname(String nickname);

    /**
     * 회원 저장 (가입)
     */
    Member save(Member member);

    /**
     * 닉네임 존재 여부 확인
     */
    boolean existsByNickname(String nickname);
}
