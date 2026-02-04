package com.newlecture.backend.filter;

import java.io.IOException;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

// 어떤 url을 요청해도 여기가 실행이 됨
// 필터를 실행코드보다 이것을 먼저 실행을 함
// 이 코드의 판단에 따라서 실행을 할지 말지를 결정할 수 있음
// 필터 파일위치는 아무곳에서 넣어도 상관 없음
// 필터를 상속받아야하고 Component로 객체를 생성해야함
@Component
// @Order(1) : 순서를 정하는 것
@Order(1)
public class TestFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        System.out.println("TestFilter 실행 전");
        chain.doFilter(request, response);
        System.out.println("TestFilter 실행 후");

    }

}
