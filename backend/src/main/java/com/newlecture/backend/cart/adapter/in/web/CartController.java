package com.newlecture.backend.cart.adapter.in.web;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuImageJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuImageJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuJpaRepository;
import com.newlecture.backend.cart.adapter.in.web.dto.CartItemAddRequest;
import com.newlecture.backend.cart.adapter.in.web.dto.CartItemResponse;
import com.newlecture.backend.cart.application.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AdminMenuJpaRepository menuRepository;
    private final AdminMenuImageJpaRepository menuImageRepository;

    @GetMapping
    public ResponseEntity<?> getCart() {
        try {
            List<CartItemResponse> responses = cartService.getCartItems().stream().map(item -> {
                MenuJpaEntity menu = menuRepository.findById(item.getMenuId()).orElse(null);
                if (menu == null)
                    return null;

                // 첫 번째 이미지를 대표 이미지로 사용
                String imageSrc = menuImageRepository.findByMenuIdOrderBySortOrder(menu.getId()).stream()
                        .findFirst()
                        .map(MenuImageJpaEntity::getSrcUrl)
                        .orElse("");

                return CartItemResponse.builder()
                        .id(menu.getId())
                        .korName(menu.getKorName())
                        .price(menu.getPrice())
                        .quantity(item.getQuantity())
                        .imageSrc(imageSrc)
                        .build();
            }).filter(item -> item != null).collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            System.err.println("[장바구니 조회 오류] " + e.getMessage());
            return ResponseEntity.status(500).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/items")
    public ResponseEntity<?> addItem(@RequestBody CartItemAddRequest request) {
        try {
            cartService.addItem(request.getMenuId(), request.getQuantity());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("[장바구니 추가 오류] " + e.getMessage());
            return ResponseEntity.status(500).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/items/bulk")
    public ResponseEntity<Void> addItems(@RequestBody List<CartItemAddRequest> requests) {
        cartService.addItems(requests);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/items/{menuId}")
    public ResponseEntity<Void> updateQuantity(@PathVariable Long menuId, @RequestParam Integer quantity) {
        cartService.updateQuantity(menuId, quantity);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items/{menuId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long menuId) {
        cartService.removeItem(menuId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok().build();
    }
}
