package com.newlecture.backend.favorite.application.port.in;

import java.util.List;

/**
 * 찜(즐겨찾기) UseCase 인터페이스
 */
public interface FavoriteUseCase {
    boolean toggleFavorite(Long menuId);
    void addFavorite(Long menuId);
    void removeFavorite(Long menuId);
    List<Long> getMyFavoriteIds();
    boolean isFavorited(Long menuId);
    long getFavoriteCount();
}
