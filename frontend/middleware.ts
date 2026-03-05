import { NextRequest, NextResponse } from 'next/server';
import { getIronSession, SessionOptions } from 'iron-session';

// ======================================================
// ★ session.ts를 import하지 않고 직접 정의
// session.ts는 `cookies()` from 'next/headers'를 import하는데,
// 미들웨어는 Edge Runtime이라 'next/headers'를 사용할 수 없음!
// ======================================================
interface SessionUser {
    nickname: string;
    role: string;
}

interface SessionData {
    token: string;
    user: SessionUser;
}

const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || 'default-secret-change-in-production-32-chars-min',
    cookieName: 'app_session',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24,
    },
};

// 로그인 필요한 경로
const PROTECTED_PATHS = ['/admin'];

// 인증 체크 건너뛸 경로
const PUBLIC_PATHS = ['/login', '/signup', '/api', '/_next'];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 공개 경로는 건너뜀
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // 정적 파일은 건너뜀
    if (pathname.includes('.')) {
        return NextResponse.next();
    }

    // 보호 경로인지 확인
    const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
    if (!isProtected) {
        return NextResponse.next();
    }

    // Next.js Response 생성 (getIronSession에 필요)
    const res = NextResponse.next();

    try {
        // 세션 복호화 및 유저 정보 확인
        const session = await getIronSession<SessionData>(req, res, sessionOptions);

        if (!session.user) {
            // 로그인 안됨
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // 권한 확인 (admin 페이지 접근 시 role 이 ADMIN인지 확인)
        if (session.user.role !== 'ADMIN') {
            // 권한 없음 → 홈으로 리다이렉트 (안내 메시지를 위한 쿼리 파라미터 추가)
            return NextResponse.redirect(new URL('/?error=admin-only', req.url));
        }

        return res;
    } catch (e) {
        // 세션 복호화 실패 시 로그인 페이지로 이동
        console.error('Middleware session error:', e);
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
