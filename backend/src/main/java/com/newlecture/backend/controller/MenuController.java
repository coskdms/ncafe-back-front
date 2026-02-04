package com.newlecture.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newlecture.backend.dto.MenuListRequest;
import com.newlecture.backend.dto.MenuListResponse;
import com.newlecture.backend.entity.Menu;
import com.newlecture.backend.service.MenuService;

@RestController
public class MenuController {

    // @Autowired를 이용하면 이게 객체를 생성시켜주는 역할을 한다
    // Service class에는 @Componet 를 붙여주면 된다
    // 이렇게 하면 생성자 함수도 만들 필요 없지롱
    // 필드에다가 injection 했다
    // @Autowired
    // 생성자로 하면 위에 autowired 안붙여도 된다
    private MenuService menuService;

    // 생성자 method를 이용한 injection
    // @Autowired를 안붙여도 된다
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    // setter method를 이용한 injection
    // @Autowired
    // public void setMenuService(MenuService menuService) {
    // this.menuService = menuService;
    // }

    // @RequestParma(name = "cid") --> 넘어온 파람 이름이 cid이니? 그럼 categoryId로 쓸겡
    // required = false --> cid가 없어도 괜찮아~
    // String categoryId --> 기본값은 String인데 Integer로 쓰면 자동 형변환 해줘
    // 목록 조회 데이터 반환
    // @GetMapping("/admin/menus")
    // public List<Menu> menu(@RequestParam(name = "cid", required = false) Integer
    // categoryId) {
    // System.out.println("categoryId: " + categoryId);

    // return menuService.getAll(categoryId);
    // }

    @GetMapping("/admin/menus")
    public MenuListResponse menu(MenuListRequest menuListRequest) {
        System.out.println("categoryId: " + menuListRequest.getCategoryId());
        System.out.println("searchQuery: " + menuListRequest.getSearchQuery());

        MenuListResponse response = menuService.getMenus(menuListRequest);

        return response;
    }

    // 상세 조회 데이터 반환
    @GetMapping("/admin/menus/{id}")
    public String detailMenu() {
        return "detailMenu";
    }

    // 메뉴 생성 데이터 입력
    @PostMapping("/admin/menus")
    public String newMenu(Menu menu) {
        return "newMenu";
    }

    // 메뉴 수정
    @PutMapping("/admin/menus/{id}")
    public String editMenu(Menu menu) {
        return "editMenu";
    }

    // 메뉴 삭제
    @DeleteMapping("admin/menus/{id}")
    public String deleteMenu() {
        return "deleteMenu";
    }

}
