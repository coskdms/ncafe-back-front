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
    Optional<Member> findById(String id);

    /**
     * 회원 저장 (가입)
     */
    Member save(Member member);

    boolean existsByNickname(String nickname);

    /**
     * 소셜 프로바이더와 소셜 ID로 회원 조회
     */
    Optional<Member> findBySocialId(String provider, String socialId);

    /**
     * 전화번호로 회원 조회 (아이디 찾기용)
     */
    Optional<Member> findByPhone(String phone);

}
