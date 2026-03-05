import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL ||
    (process.env.NODE_ENV === 'production' ? 'http://backend:8032' : 'http://localhost:8032');

/**
 * Catch-All API 프록시 (BFF 패턴의 핵심)
 *
 * 클라이언트의 모든 /next-api/* 요청을 받아서:
 * 1. 세션 쿠키에서 JWT를 꺼냄
 * 2. Authorization: Bearer {JWT} 헤더를 주입
 * 3. Spring Boot로 전달
 *
 * ★ 클라이언트는 JWT를 전혀 모른 채 그냥 fetch('/next-api/...')만 하면 됩니다!
 */
async function proxyRequest(req: NextRequest) {
    const session = await getSession();

    // /next-api/menus → /menus (Spring Boot 경로)
    // Next.js에서는 /api prefix가 있지만, Spring Boot에는 없음
    const path = req.nextUrl.pathname.replace(/^\/next-api/, '');
    const search = req.nextUrl.search;
    const targetUrl = `${API_BASE}${path}${search}`;

    // 요청 헤더 구성
    const headers: Record<string, string> = {};

    const contentType = req.headers.get('content-type');
    if (contentType) {
        headers['Content-Type'] = contentType;
    }

    const accept = req.headers.get('accept');
    if (accept) {
        headers['Accept'] = accept;
    }

    // ★ 핵심: 세션에 JWT가 있으면 Authorization 헤더 주입
    if (session.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
    }

    // 요청 본문 전달
    let body: BodyInit | null = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (contentType?.includes('multipart/form-data')) {
            body = await req.blob();  // 파일 업로드
            delete headers['Content-Type'];  // multipart는 boundary가 자동 설정되어야 함
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
