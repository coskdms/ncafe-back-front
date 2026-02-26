import { create } from 'zustand';

// 사용자 인증 정보 타입
interface AuthUser {
    username: string;
    role: string;
}

// 인증 스토어 상태 타입
interface AuthState {
    user: AuthUser | null;       // 로그인된 사용자 정보 (null이면 비로그인)
    isLoading: boolean;          // 인증 상태 확인 중인지 여부
    isAuthenticated: boolean;    // 로그인 여부 (편의용)

    // 액션들
    login: (nickname: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;  // 현재 세션이 유효한지 서버에 확인
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,  // 초기에는 세션 확인 중이므로 true
    isAuthenticated: false,

    // ============================
    // 로그인: Spring Security의 POST /login 으로 폼 데이터 전송
    // ============================
    login: async (nickname: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append('username', nickname);
        formData.append('password', password);

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });

        if (!res.ok) {
            throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
        }

        // 로그인 성공 후 사용자 정보를 서버에서 가져옴
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
            const userData: AuthUser = await meRes.json();
            set({ user: userData, isAuthenticated: true, isLoading: false });
        }
    },

    // ============================
    // 로그아웃: Spring Security의 POST /logout 으로 요청
    // ============================
    logout: async () => {
        await fetch('/api/logout', { method: 'POST' });
        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    // ============================
    // 세션 확인: 페이지 새로고침 시 서버에 현재 세션이 유효한지 확인
    // ============================
    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const userData: AuthUser = await res.json();
                set({ user: userData, isAuthenticated: true, isLoading: false });
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } catch {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
