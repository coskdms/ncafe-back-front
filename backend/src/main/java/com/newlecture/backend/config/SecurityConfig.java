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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.List;

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
                                // CORS 설정 활성화 (corsConfigurationSource 빈 사용)
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                // CSRF 비활성화 (JWT는 쿠키 기반이지만 Stateless이므로 CSRF 불필요)
                                .csrf(csrf -> csrf.disable())

                                // ★ 핵심: 세션을 생성하지 않음 (STATELESS)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // 경로별 권한 설정
                                .authorizeHttpRequests(auth -> auth
                                                // Preflight (OPTIONS) 요청은 모두 허용
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                // 인증 관련 API는 누구나 접근 가능
                                                .requestMatchers("/auth/**").permitAll()
                                                // 관리자 API는 ADMIN 권한 필요
                                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                                // 나머지는 누구나 접근 가능 (기존 설정)
                                                .anyRequest().permitAll())

                                // ★ 폼 로그인 비활성화
                                .formLogin(form -> form.disable())

                                // ★ 기본 로그아웃 비활성화
                                .logout(logout -> logout.disable())

                                // ★ JWT 필터를 UsernamePasswordAuthenticationFilter 앞에 등록
                                .addFilterBefore(jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("*")); // 모든 출처 허용
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setExposedHeaders(List.of("Authorization"));
                
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return PasswordEncoderFactories.createDelegatingPasswordEncoder();
        }
}
