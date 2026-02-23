package com.newlecture.backend.menu.adapter.in.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newlecture.backend.menu.adapter.in.web.dto.CustomerMenuDetailResponse;
import com.newlecture.backend.menu.adapter.in.web.dto.CustomerMenuListRequest;
import com.newlecture.backend.menu.adapter.in.web.dto.CustomerMenuListResponse;
import com.newlecture.backend.menu.adapter.in.web.dto.CustomerMenuResponse;
import com.newlecture.backend.menu.application.port.in.GetCustomerMenuListUseCase;
import com.newlecture.backend.menu.application.port.in.GetCustomerMenuDetailUseCase;
import com.newlecture.backend.menu.application.port.in.command.GetCustomerMenuListCommand;
import com.newlecture.backend.menu.application.port.in.result.CustomerMenuDetailResult;
import com.newlecture.backend.menu.application.port.in.result.CustomerMenuListResult;

/**
 * 일반 사용자 인바운드 어댑터: 메뉴 조회 REST 컨트롤러
 * DTO ↔ Command/Result 변환을 담당합니다.
 */
@RestController
@RequestMapping("/menus")
public class CustomerMenuController {

    private final GetCustomerMenuListUseCase getCustomerMenuListUseCase;
    private final GetCustomerMenuDetailUseCase getCustomerMenuDetailUseCase;

    public CustomerMenuController(GetCustomerMenuListUseCase getCustomerMenuListUseCase,
            GetCustomerMenuDetailUseCase getCustomerMenuDetailUseCase) {
        this.getCustomerMenuListUseCase = getCustomerMenuListUseCase;
        this.getCustomerMenuDetailUseCase = getCustomerMenuDetailUseCase;
    }

    // 메뉴 목록 조회 (판매중인 메뉴만)
    @GetMapping
    public CustomerMenuListResponse getMenus(CustomerMenuListRequest request) {
        // DTO → Command 변환
        GetCustomerMenuListCommand command = GetCustomerMenuListCommand.builder()
                .categoryId(request.getCategoryId())
                .searchQuery(request.getSearchQuery())
                .build();

        // UseCase 호출
        CustomerMenuListResult result = getCustomerMenuListUseCase.getMenus(command);

        // Result → DTO 변환
        return CustomerMenuListResponse.builder()
                .menus(result.getMenus().stream()
                        .map(item -> CustomerMenuResponse.builder()
                                .id(item.getId())
                                .korName(item.getKorName())
                                .engName(item.getEngName())
                                .description(item.getDescription())
                                .price(item.getPrice())
                                .categoryName(item.getCategoryName())
                                .imagesSrc(item.getImagesSrc())
                                .build())
                        .toList())
                .totalCount(result.getTotalCount())
                .build();
    }

    // 메뉴 상세 조회 (공개 정보만)
    @GetMapping("/{id}")
    public CustomerMenuDetailResponse getMenuDetailById(@PathVariable Long id) {
        // UseCase 호출
        CustomerMenuDetailResult result = getCustomerMenuDetailUseCase.getMenuDetailById(id);

        if (result == null) {
            return null;
        }

        // Result → DTO 변환
        return CustomerMenuDetailResponse.builder()
                .id(result.getId())
                .korName(result.getKorName())
                .engName(result.getEngName())
                .description(result.getDescription())
                .price(result.getPrice())
                .categoryName(result.getCategoryName())
                .imagesSrc(result.getImagesSrc())
                .build();
    }
}
