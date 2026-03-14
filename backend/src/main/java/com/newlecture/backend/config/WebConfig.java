package com.newlecture.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// CORS 설정 + SSE 비동기 지원을 위한 configuration
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해
                .allowedOrigins("*") // 모든 출처 허용 (Docker 배포 환경 포함)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"); // 허용할 HTTP 메서드
    }

    @Override
    public void addResourceHandlers(
            org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:./upload/images/");
    }

    /**
     * SSE를 위한 비동기 요청 타임아웃 설정 (10분)
     * 기본값 30초로는 SSE 연결이 너무 빨리 끊김
     */
    @Override
    public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
        configurer.setDefaultTimeout(600000); // 10분
    }
}
