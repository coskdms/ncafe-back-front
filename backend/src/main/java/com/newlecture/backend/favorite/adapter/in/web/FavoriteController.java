package com.newlecture.backend.favorite.adapter.in.web;

import com.newlecture.backend.favorite.application.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * 찜 토글 (POST /favorites/{menuId})
     * 이미 찜했으면 해제, 안 했으면 추가
     */
    @PostMapping("/{menuId}")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long menuId) {
        boolean favorited = favoriteService.toggleFavorite(menuId);
        return ResponseEntity.ok(Map.of(
                "favorited", favorited,
                "message", favorited ? "찜 완료! ❤️" : "찜 해제! 🤍"
        ));
    }

    /**
     * 찜 해제 (DELETE /favorites/{menuId})
     */
    @DeleteMapping("/{menuId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long menuId) {
        favoriteService.removeFavorite(menuId);
        return ResponseEntity.ok(Map.of(
                "favorited", false,
                "message", "찜 해제! 🤍"
        ));
    }

    /**
     * 내 찜 목록 ID 조회 (GET /favorites/ids)
     */
    @GetMapping("/ids")
    public ResponseEntity<?> getMyFavoriteIds() {
        return ResponseEntity.ok(favoriteService.getMyFavoriteIds());
    }

    /**
     * 특정 메뉴 찜 여부 확인 (GET /favorites/check/{menuId})
     */
    @GetMapping("/check/{menuId}")
    public ResponseEntity<?> isFavorited(@PathVariable Long menuId) {
        return ResponseEntity.ok(Map.of("favorited", favoriteService.isFavorited(menuId)));
    }
}
