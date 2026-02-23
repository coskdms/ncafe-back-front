package com.newlecture.backend.auth.application.port.out;

import com.newlecture.backend.auth.domain.Member;

import java.util.Optional;

/**
 * 아웃바운드 포트: 회원 영속성 인터페이스
 * 서비스가 이 인터페이스를 통해 DB에 접근합니다.
 * DB 기술이 바뀌어도(JDBC → JPA 등) 서비스 코드는 변하지 않습니다.
 */
public interface MemberRepository {

    /**
     * 이메일로 회원 조회
     */
    Optional<Member> findByEmail(String email);

    /**
     * 회원 저장 (가입)
     */
    Member save(Member member);

    /**
     * 이메일 존재 여부 확인
     */
    boolean existsByEmail(String email);
}
