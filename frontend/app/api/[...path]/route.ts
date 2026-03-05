import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL ||
    (process.env.NODE_ENV === 'production' ? 'http://backend:8032' : 'http://localhost:8032');

/**
 * Catch-All API 프록시 (BFF 패턴의 핵심)
 *
 * 클라이언트의 모든 /api/* 요청을 받아서:
 * 1. 세션 쿠키에서 JWT를 꺼냄
 * 2. Authorization: Bearer {JWT} 헤더를 주입
 * 3. Spring Boot로 전달
 *
 * ★ 클라이언트는 JWT를 전혀 모른 채 그냥 fetch('/api/...')만 하면 됩니다!
 */
async function proxyRequest(req: NextRequest) {
    const session = await getSession();

    // /api/menus → /menus (Spring Boot 경로)
    // Next.js에서는 /api prefix가 있지만, Spring Boot에는 없음
    const path = req.nextUrl.pathname.replace(/^\/api/, '');
    const search = req.nextUrl.search;
    const targetUrl = `${API_BASE}${path}${search}`;

    // 1. 요청 헤더 구성 (백엔드로 전달할 송장 만들기)
    const headers = new Headers();

    // 2. 백엔드로 전달하지 않을 헤더 목록 (hop-by-hop 헤더 등)
    // 브라우저-BFF 사이의 연결 설정을 백엔드-BFF 사이로 그대로 넘기면 에러가 발생하므로 필터링이 필수입니다.
    const skipHeaders = [
        'host',               // 대상 서버(백엔드)의 호스트로 자동 재설정되어야 함
        'cookie',             // 브라우저 쿠키는 직접 전달하지 않고 세션에서 꺼낸 JWT만 사용
        'connection',         // 연결 제어용 (Node.js fetch에서 'invalid connection header' 에러 유발 주범)
        'keep-alive',         // 연결 유지용
        'proxy-authenticate', // 프록시 인증 관련
        'proxy-authorization',
        'te',                 // 전송 인코딩 관련
        'trailers',
        'transfer-encoding',
        'upgrade'             // 프로토콜 업그레이드 (WebSocket 등)
    ];

    // 3. 안전한 헤더물만 선별하여 새 헤더 바구니에 담기
    req.headers.forEach((value, key) => {
        if (!skipHeaders.includes(key.toLowerCase())) {
            headers.set(key, value);
        }
    });

    // ★ 핵심: 세션에 JWT가 있으면 Authorization 헤더 주입
    if (session.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
    }

    // 요청 본문 전달
    let body: BodyInit | null = null;
    const contentType = req.headers.get('content-type');

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (contentType?.includes('multipart/form-data')) {
            const formData = await req.formData();
            body = formData as unknown as BodyInit;  // 파일 업로드
            headers.delete('Content-Type');  // multipart는 boundary가 자동 설정되어야 함
        } else {
            body = await req.text();  // JSON 등
        }
    }

    const proxyRes = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
    });

    // 401 응답 시 세션 삭제 (JWT 만료)
    if (proxyRes.status === 401 && session.token) {
        session.destroy();
    }

    // 응답 전달
    const responseHeaders = new Headers();
    const resContentType = proxyRes.headers.get('content-type');
    if (resContentType) {
        responseHeaders.set('Content-Type', resContentType);
    }

    return new NextResponse(proxyRes.body, {
        status: proxyRes.status,
        statusText: proxyRes.statusText,
        headers: responseHeaders,
    });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
