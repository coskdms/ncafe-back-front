/**
 * API 응답에서 사용자 친화적 에러 메시지를 추출합니다.
 * 
 * 사용법:
 *   const res = await fetch(url, options);
 *   if (!res.ok) {
 *       const msg = await extractErrorMessage(res, '기본 메시지');
 *       toast.error(msg);
 *   }
 */
export async function extractErrorMessage(
    res: Response, 
    fallback: string = '요청 처리 중 오류가 발생했습니다.'
): Promise<string> {
    try {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data?.message) return data.message;
            if (data?.error) return data.error;
        }
    } catch {
        // JSON 파싱 실패 시 상태 코드 기반 메시지
    }

    // 상태 코드별 기본 메시지
    switch (res.status) {
        case 400: return '입력 정보를 확인해주세요.';
        case 401: return '로그인이 필요합니다.';
        case 403: return '권한이 없습니다.';
        case 404: return '요청한 정보를 찾을 수 없습니다.';
        case 409: return '이미 존재하는 데이터입니다.';
        case 413: return '파일 크기가 너무 큽니다.';
        case 500: return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        default: return fallback;
    }
}

/**
 * catch 블록에서 에러 메시지를 안전하게 추출합니다.
 */
export function getErrorMessage(error: unknown, fallback: string = '오류가 발생했습니다.'): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return fallback;
}
