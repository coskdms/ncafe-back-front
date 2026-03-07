package com.newlecture.backend.cart.adapter.in.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CartItemResponse {
    private Long id;          // menuId
    private String korName;
    private Integer price;
    private Integer quantity;
    private String imageSrc;
}
