package com.newlecture.backend.auth.application.port.in;

import com.newlecture.backend.auth.domain.Member;

/**
 * 인바운드 포트: 인증 유스케이스 인터페이스
 * 컨트롤러(어댑터)가 이 인터페이스를 통해 서비스를 호출합니다.
 * 인증 방식이 바뀌어도 이 인터페이스는 변하지 않습니다.
 */
public interface AuthUseCase {

    /**
     * 로그인
     * 
     * @param email    이메일
     * @param password 비밀번호
     * @return 인증된 회원 정보 (실패 시 null 또는 예외)
     */
    Member login(String email, String password);

    /**
     * 회원가입
     * 
     * @param member 가입할 회원 정보
     * @return 생성된 회원 정보
     */
    Member signup(Member member);

    /**
     * 이메일 중복 확인
     */
    boolean isEmailDuplicated(String email);
}
