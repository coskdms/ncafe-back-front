import { create } from 'zustand';
import { favoriteAPI } from '@/app/lib/api';

interface FavoriteStore {
    /** 찜한 메뉴 ID Set (O(1) 조회) */
    favoriteIds: Set<number>;
    /** 초기 로딩 완료 여부 */
    isLoaded: boolean;
    /** 로딩 중 여부 */
    isLoading: boolean;

    /** 서버에서 찜 목록 로드 */
    loadFavorites: () => Promise<void>;
    /** 찜 토글 (서버 반영 + 로컬 상태 업데이트) */
    toggleFavorite: (menuId: number) => Promise<boolean>;
    /** 특정 메뉴 찜 여부 확인 */
    isFavorited: (menuId: number) => boolean;
    /** 스토어 초기화 (로그아웃 시) */
    reset: () => void;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
    favoriteIds: new Set<number>(),
    isLoaded: false,
    isLoading: false,

    loadFavorites: async () => {
        if (get().isLoading) return;
        set({ isLoading: true });
        try {
            const ids: number[] = await favoriteAPI.getIds();
            if (Array.isArray(ids)) {
                set({ favoriteIds: new Set(ids), isLoaded: true });
            }
        } catch {
            // 비로그인이면 빈 목록 유지
            set({ favoriteIds: new Set(), isLoaded: true });
        } finally {
            set({ isLoading: false });
        }
    },

    toggleFavorite: async (menuId: number) => {
        const { favoriteIds } = get();

        // 옵티미스틱 업데이트 (즉시 UI 반영)
        const newIds = new Set(favoriteIds);
        const wasActive = newIds.has(menuId);
        if (wasActive) {
            newIds.delete(menuId);
        } else {
            newIds.add(menuId);
        }
        set({ favoriteIds: newIds });

        try {
            const result = await favoriteAPI.toggle(menuId);
            return result?.favorited ?? !wasActive;
        } catch {
            // 실패 시 롤백
            set({ favoriteIds: favoriteIds });
            return wasActive;
        }
    },

    isFavorited: (menuId: number) => {
        return get().favoriteIds.has(menuId);
    },

    reset: () => {
        set({ favoriteIds: new Set(), isLoaded: false, isLoading: false });
    },
}));
