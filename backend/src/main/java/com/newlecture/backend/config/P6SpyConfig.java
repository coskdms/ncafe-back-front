package com.newlecture.backend.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

/**
 * p6spy.enabled=true 일 때만 활성화.
 * DataSource URL을 jdbc:p6spy:postgresql://... 로 교체해 실행 시간 측정을 시작한다.
 * Spring Boot DataSourceAutoConfiguration은 DataSource 빈이 이미 있으면 동작하지 않으므로
 * 이 설정이 활성화될 때 auto-configuration 대신 이 빈이 사용된다.
 */
@Configuration
@ConditionalOnProperty(name = "p6spy.enabled", havingValue = "true")
public class P6SpyConfig {

    @Value("${spring.datasource.url}")
    private String originalUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setDriverClassName("com.p6spy.engine.spy.P6SpyDriver");
        ds.setJdbcUrl(originalUrl.replace("jdbc:", "jdbc:p6spy:"));
        ds.setUsername(username);
        ds.setPassword(password);
        return ds;
    }
}