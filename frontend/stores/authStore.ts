import { create } from 'zustand';
import { authAPI } from '@/app/lib/api';

interface AuthUser {
    nickname: string;
    role: string;
}

interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    login: (nickname: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    // ============================
    // BFF 방식 로그인
    // JWT는 Next.js 서버가 iron-session으로 관리
    // 브라우저에는 user 정보만 반환됨!
    // ============================
    login: async (nickname: string, password: string) => {
        const data = await authAPI.login(nickname, password);
        if (data?.user) {
            set({ user: data.user, isAuthenticated: true, isLoading: false });
            // 로그인 성공 시 서버에서 장바구니 데이터를 가져와 동기화 (isLoginAction: true)
            const { useCartStore } = await import('@/stores/cartStore');
            await useCartStore.getState().syncWithServer(true);
            window.dispatchEvent(new Event('login'));
        }
    },

    // ============================
    // BFF 방식 로그아웃
    // iron-session 세션 쿠키 삭제
    // ============================
    logout: async () => {
        await authAPI.logout();
        set({ user: null, isAuthenticated: false, isLoading: false });
        // 찜 스토어 초기화
        const { useFavoriteStore } = await import('@/stores/favoriteStore');
        useFavoriteStore.getState().reset();
        window.dispatchEvent(new Event('logout'));
    },

    // ============================
    // 세션 확인: iron-session 쿠키가 유효한지 Next.js 서버에 확인
    // (이전: 백엔드에 직접 확인 → 현재: Next.js API Route에 확인)
    // ============================
    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const data = await authAPI.getSession();
            if (data?.user) {
                set({ user: data.user, isAuthenticated: true, isLoading: false });
                // 세션 유지 중이면 서버에서 장바구니 데이터를 가져와 동기화
                const { useCartStore } = await import('@/stores/cartStore');
                await useCartStore.getState().syncWithServer();
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } catch {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
