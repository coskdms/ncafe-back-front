package com.newlecture.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        // bean은 호출해서 담아놓으라는 얘기
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                // 프론트엔드(Next.js)와 백엔드(Spring)가 분리된 구조에서는
                                // CSRF 토큰을 주고받기 어려우므로 비활성화합니다.
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                // 관리자 API는 ADMIN 권한 필요
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                // 나머지 경로는 누구나 접근 가능
                                                .anyRequest().permitAll())
                                // 폼 로그인 설정: 프론트엔드에서 POST /login 으로 요청하면 처리
                                .formLogin(form -> form
                                                // 로그인 성공 시: 302 리다이렉트 대신 200 OK 반환
                                                .successHandler((request, response, authentication) -> {
                                                        response.setStatus(200);
                                                        response.setContentType("application/json;charset=UTF-8");
                                                        response.getWriter()
                                                                        .write("{\"message\":\"로그인 성공\",\"username\":\""
                                                                                        + authentication.getName()
                                                                                        + "\"}");
                                                })
                                                // 로그인 실패 시: 401 Unauthorized 반환
                                                .failureHandler((request, response, exception) -> {
                                                        response.setStatus(401);
                                                        response.setContentType("application/json;charset=UTF-8");
                                                        response.getWriter()
                                                                        .write("{\"error\":\"아이디 또는 비밀번호가 올바르지 않습니다.\"}");
                                                })
                                                .permitAll())
                                // 로그아웃 설정: 프론트엔드에서 POST /logout 으로 요청하면 처리
                                .logout(logout -> logout
                                                .logoutUrl("/logout")
                                                .logoutSuccessHandler((request, response, authentication) -> {
                                                        response.setStatus(200);
                                                        response.setContentType("application/json;charset=UTF-8");
                                                        response.getWriter().write("{\"message\":\"로그아웃 성공\"}");
                                                })
                                                .invalidateHttpSession(true) // 세션 무효화
                                                .deleteCookies("JSESSIONID") // 세션 쿠키 삭제
                                );

                return http.build();
        }

        // =========================================================================
        // 애플리케이션 전반에서 사용할 "비밀번호 암호화 도구(PasswordEncoder)"를 빈으로 등록합니다.
        // =========================================================================
        @Bean
        public PasswordEncoder passwordEncoder() {
                // 내부적으로 최신 암호화 방식(Bcrypt)을 지원해주며 `{bcrypt}` 등 접두사를 유연하게 처리해주는 강력한 도구입니다!
                return PasswordEncoderFactories.createDelegatingPasswordEncoder();
        }

        // =========================================================================
        // [나중에 사용할 방식] 데이터베이스(JDBC)를 이용해 사용자 정보를 제공하는 방식
        // =========================================================================
        // 나중에 DB 연동을 본격적으로 테스트하실 때, 이 부분의 주석(// @Bean)을 해제하고
        // 위에 있는 userDetailsService() 메서드의 @Bean을 주석 처리하시면 됩니다!
        //
        // ※ 주의: JdbcUserDetailsManager 를 기본 설정으로 사용하려면,
        // 데이터베이스에 아래와 같은 구조의 테이블(users, authorities)이 반드시 존재해야 합니다!
        //
        // [ 1. users 테이블 (회원 정보) ]
        // | column | type | description |
        // |----------|--------------|-------------------------------------------|
        // | username | varchar(50) | (PK) 사용자 아이디 |
        // | password | varchar(500) | 비밀번호 (반드시 해싱된 값, ex: bcrypt) |
        // | enabled | boolean | 계정 활성화 여부 (true/false) |
        //
        // [ 2. authorities 테이블 (권한 정보) ]
        // | column | type | description |
        // |-----------|-------------|-------------------------------------------|
        // | username | varchar(50) | (FK) 사용자 아이디 |
        // | authority | varchar(50) | 권한 이름 (보통 "ROLE_XXX" 형태로 저장) |
        //
        @Bean
        public UserDetailsService jdbcUserDetailsService(DataSource dataSource) {
                JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);

                // 1. 인증(Authentication) 쿼리
                // 스프링 시큐리티는 'username', 'password', 'enabled' 3개의 컬럼을 무조건 기대합니다.
                // 우리 테이블의 nickname 필드를 'username'으로 별칭(AS) 주고,
                // enabled 필드가 없으므로 강제로 'true AS enabled'로 항상 로그인 가능하게 처리합니다!
                manager.setUsersByUsernameQuery(
                                "SELECT nickname AS username, password, true AS enabled FROM users WHERE nickname = ?");

                // 2. 인가(Authorization) 쿼리
                // 스프링 시큐리티는 'username', 'authority' 2개의 컬럼을 기대합니다.
                // 우리는 별도의 authorities 테이블을 안 만들었으니 users 테이블에서
                // nickname을 'username'으로, role을 'authority'별칭(AS) 줘서 해결합니다!
                manager.setAuthoritiesByUsernameQuery(
                                "SELECT nickname AS username, CONCAT('ROLE_', role) AS authority FROM users WHERE nickname = ?");

                return manager;
        }
}
