package com.newlecture.backend.auth.application.port.in;

import com.newlecture.backend.auth.domain.Member;

/**
 * 인바운드 포트: 인증 유스케이스 인터페이스
 */
public interface AuthUseCase {

    /**
     * 로그인
     * 
     * @param nickname 닉네임 (아이디)
     * @param password 비밀번호
     * @return 인증된 회원 정보
     */
    Member login(String nickname, String password);

    /**
     * 회원가입
     * 
     * @param member 가입할 회원 정보
     * @return 생성된 회원 정보
     */
    Member signup(Member member);

    /**
     * 카카오 로그인 / 회원가입
     * @param code 카카오 인증 코드
     * @return 로그인 된 회원 정보
     */
    Member kakaoLogin(String code);

    /**
     * 닉네임 중복 확인

     */
    boolean isNicknameDuplicated(String nickname);
}
