package com.newlecture.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                // CSRF 비활성화 (JWT는 쿠키 기반이지만 Stateless이므로 CSRF 불필요)
                                .csrf(csrf -> csrf.disable())

                                // ★ 핵심: 세션을 생성하지 않음 (STATELESS)
                                // 서버가 더 이상 JSESSIONID를 만들지 않습니다.
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // 경로별 권한 설정
                                .authorizeHttpRequests(auth -> auth
                                                // 인증 관련 API는 누구나 접근 가능
                                                .requestMatchers("/auth/**").permitAll()
                                                // 관리자 API는 ADMIN 권한 필요
                                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                                // 나머지는 누구나 접근 가능 (기존 설정)
                                                .anyRequest().permitAll())

                                // ★ 폼 로그인 비활성화 (더 이상 Spring Security의 /login 사용 안 함)
                                .formLogin(form -> form.disable())

                                // ★ 기본 로그아웃 비활성화 (우리가 직접 처리)
                                .logout(logout -> logout.disable())

                                // ★ JWT 필터를 UsernamePasswordAuthenticationFilter 앞에 등록
                                // 요청이 들어오면 JWT 필터가 먼저 실행되어 인증 처리
                                .addFilterBefore(jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return PasswordEncoderFactories.createDelegatingPasswordEncoder();
        }

        // ★ 기존 JdbcUserDetailsService 빈 삭제
        // JWT 방식에서는 Spring Security의 UserDetailsService가 필요 없습니다.
        // 우리가 직접 member 테이블에서 조회하고 비밀번호를 검증합니다.
}
