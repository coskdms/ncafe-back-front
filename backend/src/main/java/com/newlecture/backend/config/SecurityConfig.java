package com.newlecture.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
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
                                .authorizeHttpRequests(auth -> auth
                                                // /cookie/create 경로는 인증(로그인)된 사용자만 접근 가능
                                                // .requestMatchers("/api/admin/**").hasAuthority("MENU_CREATE")
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN") // DB에서는 ROLE_ADMIN으로
                                                                                                   // 저장됨, ROLE이 안붙으면
                                                                                                   // 에러남
                                                .requestMatchers("/cookie/create").authenticated()
                                                .requestMatchers("/cookie/session/create").authenticated()
                                                // 나머지 경로는 누구나 접근 가능
                                                .anyRequest().permitAll())
                                // 권한이 필요한 페이지 접근 시 기본 로그인 폼으로 이동
                                // .formLogin(form -> form.permitAll());
                                // customer 설정 가능
                                .formLogin(Customizer.withDefaults());
                // 사용자 정보를 제공하는 프로바이더를 만들 생각이야

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
        // [현재 사용 중인 방식] 메모리(InMemory)에 임시로 사용자를 만들어두는 방식
        // =========================================================================
        // @Bean
        public UserDetailsService userDetailsService() {

                // --- 1. 유저님이 제일 처음 작성하셨던 기존 방식 (주석 처리) ---
                /*
                 * // 테스트용 일반 사용자 계정 (chaena / 1234)
                 * // {noop}을 붙이면 비밀번호를 별도로 암호화(해싱)하지 않고 그대로 사용하겠다는 뜻입니다.
                 * UserDetails user = User.builder()
                 * .username("chaena")
                 * .password("{noop}1234")
                 * .roles("USER")
                 * .build();
                 * 
                 * // 관리자 계정 (admin / 1234)
                 * UserDetails admin = User.builder()
                 * .username("admin")
                 * .password("{noop}1234")
                 * .roles("ADMIN")
                 * .build();
                 * 
                 * return new InMemoryUserDetailsManager(user, admin);
                 */

                // --- 2. 캡처로 보여주신 withDefaultPasswordEncoder() 방식 (현재 활성화) ---
                // 이 방식은 스프링에서 내부적으로 BCrypt 로 암호화를 자동으로 해줍니다.
                // 하지만 최신 버전에서는 "보안상 위험하니 쓰지 말라"는 의미로
                // 메서드에 취소선(Deprecated)이 그어지는 것을 보실 수 있습니다.
                var admin = User.withDefaultPasswordEncoder()
                                .username("admin")
                                .password("1234")
                                .roles("ADMIN")
                                .build();

                var user = User.withDefaultPasswordEncoder()
                                .username("user")
                                .password("1234")
                                .roles("USER")
                                .build();

                // 위에서 생성한 유저 정보를 메모리(InMemory)에 담아서 스프링 시큐리티에 제공(Manager)
                return new InMemoryUserDetailsManager(admin, user);
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
