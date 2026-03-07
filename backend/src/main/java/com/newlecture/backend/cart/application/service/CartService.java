package com.newlecture.backend.cart.application.service;

import com.newlecture.backend.auth.application.port.out.MemberRepository;
import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.cart.adapter.in.web.dto.CartItemAddRequest;
import com.newlecture.backend.cart.adapter.out.persistence.entity.CartItemJpaEntity;
import com.newlecture.backend.cart.adapter.out.persistence.repository.CartItemJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemJpaRepository cartItemRepository;
    private final MemberRepository memberRepository;

    /**
     * 현재 로그인한 사용자의 UUID를 가져옵니다.
     */
    private UUID getCurrentMemberId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            System.err.println("[CartService] Authentication failed: " + (auth == null ? "null" : auth.getName()));
            throw new RuntimeException("User is not authenticated. (Cart operations require login)");
        }

        String nickname = auth.getName();
        System.out.println("[CartService] Fetching member for nickname: " + nickname);

        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> {
                    System.err.println("[CartService] Member NOT FOUND in DB for nickname: " + nickname);
                    return new RuntimeException("Member not found for nickname: " + nickname);
                });
        
        String memberIdStr = member.getId();
        System.out.println("[CartService] Found member ID string: " + memberIdStr);

        try {
            UUID uuid = UUID.fromString(memberIdStr);
            System.out.println("[CartService] Successfully converted to UUID: " + uuid);
            return uuid;
        } catch (Exception e) {
            System.err.println("[CartService] UUID Conversion FAILED for ID [" + memberIdStr + "]: " + e.getMessage());
            throw new RuntimeException("Invalid member ID format: " + memberIdStr);
        }
    }

    public List<CartItemJpaEntity> getCartItems() {
        return cartItemRepository.findByMemberId(getCurrentMemberId());
    }

    public void addItem(Long menuId, Integer quantity) {
        addItems(List.of(new CartItemAddRequest(menuId, quantity)));
    }

    public void addItems(List<CartItemAddRequest> requests) {
        UUID memberId = getCurrentMemberId();
        for (var request : requests) {
            Long menuId = request.getMenuId();
            Integer quantity = request.getQuantity();
            
            Optional<CartItemJpaEntity> existing = cartItemRepository.findByMemberIdAndMenuId(memberId, menuId);
            if (existing.isPresent()) {
                CartItemJpaEntity item = existing.get();
                item.setQuantity(item.getQuantity() + quantity);
                cartItemRepository.save(item);
            } else {
                CartItemJpaEntity newItem = CartItemJpaEntity.builder()
                        .memberId(memberId)
                        .menuId(menuId)
                        .quantity(quantity)
                        .build();
                cartItemRepository.save(newItem);
            }
        }
    }

    public void updateQuantity(Long menuId, Integer quantity) {
        UUID memberId = getCurrentMemberId();
        cartItemRepository.findByMemberIdAndMenuId(memberId, menuId)
                .ifPresent(item -> {
                    if (quantity <= 0) {
                        cartItemRepository.delete(item);
                    } else {
                        item.setQuantity(quantity);
                        cartItemRepository.save(item);
                    }
                });
    }

    public void removeItem(Long menuId) {
        UUID memberId = getCurrentMemberId();
        cartItemRepository.findByMemberIdAndMenuId(memberId, menuId)
                .ifPresent(cartItemRepository::delete);
    }

    public void clearCart() {
        cartItemRepository.deleteByMemberId(getCurrentMemberId());
    }
}
