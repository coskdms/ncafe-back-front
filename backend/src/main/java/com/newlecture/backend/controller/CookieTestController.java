package com.newlecture.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CookieValue;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

@Controller
@RequestMapping("/cookie")
public class CookieTestController {

    @GetMapping("/test")
    public String cookieTest(
            @CookieValue(value = "age", required = false) String ageCookie,
            Model model, HttpServletRequest request) {

        if (ageCookie != null) {
            System.out.println("age 쿠키 값: " + ageCookie);
        }

        // 데이터(Model)를 마련하고
        model.addAttribute("name", "chaena");
        model.addAttribute("age", ageCookie != null ? ageCookie : "20");

        HttpSession session = request.getSession();
        // session.getAttribute("...") 의 원래 반환 타입은 Object
        // Object 타입으로 직접 받는 것이 훨씬 더 안전하고 좋음
        // 하나는 Object로 받는거고 하나는 String으로 캐스팅(형변환)해서 받는거
        String name = (String) session.getAttribute("name");
        Object age = session.getAttribute("age");

        if (name != null) {
            model.addAttribute("sessionName", name);
        }
        if (age != null) {
            model.addAttribute("sessionAge", age);
        }

        // ====== 추가된 부분: Spring Security 인증 정보 확인 ======
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();

        // 익명 사용자(미로그인)가 아닌 진짜 로그인한 사용자일 경우에만 정보를 담습니다.
        if (authentication != null && authentication.isAuthenticated()
                && !authentication.getPrincipal().equals("anonymousUser")) {
            model.addAttribute("securityUsername", authentication.getName()); // 로그인한 아이디(nickname)
            model.addAttribute("securityAuthorities", authentication.getAuthorities()); // 권한 목록 (ROLE_XXX)
        }

        // test.html로 전달
        return "test";
    }

    @GetMapping("/create")
    public String createCookie() {
        return "create";
    }

    @PostMapping("/create")
    public String createCookie(String name, String value, HttpServletResponse response) {
        System.out.println("쿠키 생성");
        System.out.println("name: " + name);
        System.out.println("value: " + value);

        Cookie cookie = new Cookie(name, value);
        // cookie.setPath("/");
        // cookie.setHttpOnly(true);
        // cookie.setSecure(true);

        // 생성된 쿠키를 클라이언트(브라우저)에게 응답으로 전송
        response.addCookie(cookie);

        return "redirect:/cookie/test";
    }

    @GetMapping("/session/create")
    public String createSession(Model model) {

        return "create";

        // 이렇게 쓰면 session 폴더안에 create.html 파일을 찾는거니까 폴더 만들어줘야됨
        // 근데 귀찮으니까 그냥 쿠키 create랑 같이 쓸게
        // return "session/create";
    }

    @PostMapping("/session/create")
    public String createSession(String userName, String userAge,
            HttpServletRequest request) {
        System.out.println("세션 생성");
        System.out.println("userName: " + userName);
        System.out.println("userAge: " + userAge);

        // 세션에다 담게되면 쿠키 하나가 반드시 만들어져
        // 이 세션이라고하는 캐비넷을 네가 씀으로써 이 케비넷에 대한 키를 너가 항상 가지고 와야돼 라고 하는 키가 만들어짐
        // 이 키를 가지고 서버에 요청을 하면 서버는 이 키를 보고 네가 어떤 캐비넷을 썼는지 알 수 있음
        HttpSession session = request.getSession();
        session.setAttribute("name", userName);
        session.setAttribute("age", userAge);
        // 만약 그냥 name, age 이렇게 이름 똑같이 썼으면 걍
        // session.setAttribute(name, age); 이렇게 넣어도됨

        return "redirect:/cookie/test";
    }

}
