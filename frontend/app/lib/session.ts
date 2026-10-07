import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// ──────────────────────────────────────
// 세션에 저장할 사용자 정보 타입
// Spring Boot의 /v1/auth/me 응답에 맞춤
// ──────────────────────────────────────
export interface SessionUser {
    nickname: string;
    role: string;
}

export interface SessionData {
    token: string;      // Spring Boot에서 발급받은 JWT (브라우저는 모름!)
    user: SessionUser;  // 사용자 정보
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || 'default-secret-change-in-production-32-chars-min',
    cookieName: 'app_session',
    cookieOptions: {
        httpOnly: true,                                   // JavaScript 접근 차단
        secure: process.env.NODE_ENV === 'production',    // 운영에서만 HTTPS 필수
        sameSite: 'lax' as const,                         // CSRF 기본 방어
        path: '/',
        maxAge: 60 * 60 * 24,                             // 24시간
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}

// ──────────────────────────────────────
// 관리자 전용 API Route 가드
// 미들웨어는 /api 경로를 검사하지 않으므로, 관리자 전용 API는 여기서 직접 막는다.
// ADMIN이면 null, 아니면 바로 반환할 401/403 응답을 돌려준다.
// ──────────────────────────────────────
export async function requireAdmin(): Promise<NextResponse | null> {
    const session = await getSession();
    if (!session.user) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }
    if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: '관리자만 사용할 수 있는 기능입니다.' }, { status: 403 });
    }
    return null;
}
