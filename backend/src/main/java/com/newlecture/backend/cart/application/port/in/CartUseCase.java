package com.newlecture.backend.cart.application.port.in;

import com.newlecture.backend.cart.adapter.in.web.dto.CartItemAddRequest;

import java.util.List;
import java.util.Map;

/**
 * 장바구니 UseCase 인터페이스
 */
public interface CartUseCase {
    List<?> getCartItems();
    void addItem(Long menuId, Integer quantity, Map<String, String> options);
    void addItems(List<CartItemAddRequest> requests);
    void updateQuantity(Long cartItemId, Integer quantity);
    void removeItem(Long cartItemId);
    void clearCart();
}
