/**
 * BFF 패턴에서 사용하는 API 유틸리티
 * 모든 요청은 /next-api/... 로 보내면, Next.js API Route가
 * 세션 쿠키에서 JWT를 꺼내 Spring Boot에 자동 주입합니다.
 *
 * ★ 클라이언트 코드에서는 JWT를 전혀 신경 쓸 필요 없습니다!
 */
export async function fetchAPI(endpoint: string, options?: RequestInit) {
    try {
        const res = await fetch(`/next-api${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options?.headers,
            },
            // credentials: 'same-origin' 이 기본값이므로 쿠키 자동 전송
        });

        if (!res.ok) {
            // 401이면 로그인 페이지로 리다이렉트 (이미 로그인 페이지면 제외)
            if (res.status === 401 && typeof window !== 'undefined'
                && !window.location.pathname.startsWith('/login')) {
                const currentPath = window.location.pathname;
                window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
                return;
            }
            const error: Error & { status?: number } = new Error(`API Error: ${res.status}`);
            error.status = res.status;
            try {
                const body = await res.json();
                error.message = (body as { message?: string }).message || error.message;
            } catch { /* no json body */ }
            throw error;
        }

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.json();
        }
        return null;
    } catch (error: unknown) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            const networkError: Error & { status?: number } = new Error('Network Error: 서버에 연결할 수 없습니다.');
            networkError.status = 0;
            throw networkError;
        }
        throw error;
    }
}

// 인증 API 모음
export const authAPI = {
    login: (nickname: string, password: string) =>
        fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ nickname, password }),
        }),

    logout: () =>
        fetchAPI('/auth/logout', { method: 'POST' }),

    signup: (nickname: string, password: string) =>
        fetchAPI('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ nickname, password }),
        }),

    getSession: () => fetchAPI('/auth/session'),
};
