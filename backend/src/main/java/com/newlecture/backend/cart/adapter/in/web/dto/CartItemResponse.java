package com.newlecture.backend.cart.adapter.in.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CartItemResponse {
    private Long id;          // 장바구니 아이템 고유 ID (PK)
    private Long menuId;      // 실제 메뉴 ID
    private String korName;
    private Integer price;
    private Integer quantity;
    private String imageSrc;
    private java.util.Map<String, String> options;
}
