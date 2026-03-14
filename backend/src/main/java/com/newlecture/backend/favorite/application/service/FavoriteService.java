package com.newlecture.backend.favorite.application.service;

import com.newlecture.backend.auth.application.port.out.MemberRepository;
import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.favorite.adapter.out.persistence.entity.FavoriteJpaEntity;
import com.newlecture.backend.favorite.adapter.out.persistence.repository.FavoriteJpaRepository;
import com.newlecture.backend.favorite.application.port.in.FavoriteUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteService implements FavoriteUseCase {

    private final FavoriteJpaRepository favoriteRepository;
    private final MemberRepository memberRepository;

    private UUID getCurrentMemberId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        String nickname = auth.getName();
        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        return UUID.fromString(member.getId());
    }

    /**
     * 찜 토글 — 이미 찜했으면 해제, 안 했으면 추가
     */
    public boolean toggleFavorite(Long menuId) {
        UUID memberId = getCurrentMemberId();
        if (favoriteRepository.existsByMemberIdAndMenuId(memberId, menuId)) {
            favoriteRepository.deleteByMemberIdAndMenuId(memberId, menuId);
            return false; // 찜 해제됨
        } else {
            FavoriteJpaEntity favorite = FavoriteJpaEntity.builder()
                    .memberId(memberId)
                    .menuId(menuId)
                    .build();
            favoriteRepository.save(favorite);
            return true; // 찜 추가됨
        }
    }

    /**
     * 찜 추가
     */
    public void addFavorite(Long menuId) {
        UUID memberId = getCurrentMemberId();
        if (!favoriteRepository.existsByMemberIdAndMenuId(memberId, menuId)) {
            FavoriteJpaEntity favorite = FavoriteJpaEntity.builder()
                    .memberId(memberId)
                    .menuId(menuId)
                    .build();
            favoriteRepository.save(favorite);
        }
    }

    /**
     * 찜 해제
     */
    public void removeFavorite(Long menuId) {
        UUID memberId = getCurrentMemberId();
        favoriteRepository.deleteByMemberIdAndMenuId(memberId, menuId);
    }

    /**
     * 내 찜 목록 (메뉴 ID 목록)
     */
    @Transactional(readOnly = true)
    public List<Long> getMyFavoriteIds() {
        return favoriteRepository.findMenuIdsByMemberId(getCurrentMemberId());
    }

    /**
     * 특정 메뉴 찜 여부
     */
    @Transactional(readOnly = true)
    public boolean isFavorited(Long menuId) {
        return favoriteRepository.existsByMemberIdAndMenuId(getCurrentMemberId(), menuId);
    }

    /**
     * 찜 개수
     */
    @Transactional(readOnly = true)
    public long getFavoriteCount() {
        return favoriteRepository.countByMemberId(getCurrentMemberId());
    }
}
