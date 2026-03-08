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
import java.util.Map;
import java.util.stream.Collectors;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AdminMenuJpaRepository menuRepository;
    private final AdminMenuImageJpaRepository menuImageRepository;
    private final ObjectMapper objectMapper;

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

                Map<String, String> parsedOptions = null;
                try {
                    if (item.getOptions() != null && !item.getOptions().isEmpty() && !item.getOptions().equals("{}")) {
                        parsedOptions = objectMapper.readValue(item.getOptions(), new TypeReference<Map<String, String>>() {});
                    }
                } catch (Exception e) {
                    System.err.println("[CartController] Failed to parse options " + item.getOptions());
                }

                return CartItemResponse.builder()
                        .id(item.getId()) 
                        .menuId(item.getMenuId()) // 실제 메뉴 ID 추가
                        .korName(menu.getKorName())
                        .price(menu.getPrice())
                        .quantity(item.getQuantity())
                        .imageSrc(imageSrc)
                        .options(parsedOptions)
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
            cartService.addItem(request.getMenuId(), request.getQuantity(), request.getOptions());
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

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<Void> updateQuantity(@PathVariable Long cartItemId, @RequestParam Integer quantity) {
        cartService.updateQuantity(cartItemId, quantity);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long cartItemId) {
        cartService.removeItem(cartItemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok().build();
    }
}
