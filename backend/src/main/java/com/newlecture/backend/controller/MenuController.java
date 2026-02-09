package com.newlecture.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newlecture.backend.dto.MenuDetailResponse;
import com.newlecture.backend.dto.MenuImageListResponse;
import com.newlecture.backend.dto.MenuListRequest;
import com.newlecture.backend.dto.MenuListResponse;
import com.newlecture.backend.entity.Menu;
import com.newlecture.backend.service.MenuService;

@RestController
@RequestMapping("/admin/menus")
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
    // 메뉴 목록 조회
    @GetMapping
    public MenuListResponse getMenus(MenuListRequest menuListRequest) {
        System.out.println("categoryId: " + menuListRequest.getCategoryId());
        System.out.println("searchQuery: " + menuListRequest.getSearchQuery());

        MenuListResponse response = menuService.getMenus(menuListRequest);

        return response;
    }

    // 메뉴 상세 조회
    // @PathVariable: 경로중에 오는것중에서 {id}를 가져와서 @PathVariable로 id 변수에 넣어줘
    @GetMapping("/{id}")
    public MenuDetailResponse getMenuDetailById(@PathVariable Long id) {
        return menuService.getMenuDetailById(id);
    }

    // 메뉴 생성
    @PostMapping
    public String createMenu(Menu menu) {
        return "createMenu";
    }

    // 메뉴 수정
    @PutMapping("/{id}")
    public String updateMenu(Menu menu) {
        return "updateMenu";
    }

    // 메뉴 삭제
    @DeleteMapping("/{id}")
    public String deleteMenu() {
        return "deleteMenu";
    }

    @GetMapping("{id}/menu-images")
    public MenuImageListResponse getMenuImages(@PathVariable Long id) {
        return menuService.getMenuImages(id);
    }

}
