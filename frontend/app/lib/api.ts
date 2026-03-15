/**
 * BFF 패턴에서 사용하는 API 유틸리티
 * 모든 요청은 /api/... 로 보내면, Next.js API Route가
 * 세션 쿠키에서 JWT를 꺼내 Spring Boot에 자동 주입합니다.
 *
 * ★ 클라이언트 코드에서는 JWT를 전혀 신경 쓸 필요 없습니다!
 */
export async function fetchAPI(endpoint: string, options?: RequestInit) {
    try {
        const isFormData = typeof FormData !== 'undefined' && options?.body instanceof FormData;

        const defaultHeaders: Record<string, string> = {
            'Accept': 'application/json',
        };

        if (!isFormData) {
            defaultHeaders['Content-Type'] = 'application/json';
        }

        const res = await fetch(`/api${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
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
                if ((body as { message?: string }).message) {
                    error.message = (body as { message?: string }).message!;
                } else {
                    // 서버에서 메시지가 없으면 상태 코드별 한글 메시지
                    error.message = getStatusMessage(res.status);
                }
            } catch {
                error.message = getStatusMessage(res.status);
            }
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

// 주문 관련 API
export const orderAPI = {
    getMyOrders: () => fetchAPI('/orders/mine'),
    cancelOrder: (paymentId: String) => fetchAPI(`/orders/${paymentId}/cancel`, { method: 'POST' }),
};

// 회원 정보 관련 API
export const memberAPI = {
    getGrowthInfo: () => fetchAPI('/members/growth'),
    updateProfile: (address: string, phone: string) => 
        fetchAPI('/members/profile', {
            method: 'PUT',
            body: JSON.stringify({ address, phone }),
        }),
    updatePassword: (currentPassword: string, newPassword: string) =>
        fetchAPI('/members/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        }),
};

// 찜하기 관련 API
export const favoriteAPI = {
    /** 찜 토글 (이미 찜→해제, 안 찜→추가) */
    toggle: (menuId: number) =>
        fetchAPI(`/favorites/${menuId}`, { method: 'POST' }),
    /** 찜 해제 */
    remove: (menuId: number) =>
        fetchAPI(`/favorites/${menuId}`, { method: 'DELETE' }),
    /** 내 찜 메뉴 ID 목록 조회 */
    getIds: () => fetchAPI('/favorites/ids'),
    /** 특정 메뉴 찜 여부 확인 */
    check: (menuId: number) => fetchAPI(`/favorites/check/${menuId}`),
};

/**
 * HTTP 상태 코드별 사용자 친화적 한글 메시지
 */
function getStatusMessage(status: number): string {
    switch (status) {
        case 400: return '입력 정보를 확인해주세요.';
        case 401: return '로그인이 필요합니다.';
        case 403: return '권한이 없습니다.';
        case 404: return '요청한 정보를 찾을 수 없습니다.';
        case 409: return '이미 존재하는 데이터입니다.';
        case 413: return '파일 크기가 너무 큽니다.';
        case 500: return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        default: return '요청 처리 중 오류가 발생했습니다.';
    }
}

