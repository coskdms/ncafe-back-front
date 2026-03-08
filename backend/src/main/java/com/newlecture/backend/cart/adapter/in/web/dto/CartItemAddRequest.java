package com.newlecture.backend.cart.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemAddRequest {
    private Long menuId;
    private Integer quantity;
    private java.util.Map<String, String> options;
}
