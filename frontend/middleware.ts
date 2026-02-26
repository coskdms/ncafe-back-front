import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8032';

    // 1. 브라우저의 JSESSIONID 쿠키를 가져옴
    const sessionCookie = request.cookies.get('JSESSIONID');

    // 쿠키 자체가 없으면 → 바로 로그인 페이지로
    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // 2. 백엔드에 "이 세션의 사용자가 누구인지, 권한이 뭔지" 직접 물어봄
        const res = await fetch(`${backendUrl}/auth/me`, {
            headers: {
                Cookie: `JSESSIONID=${sessionCookie.value}`,
            },
        });

        // 세션이 만료되었거나 유효하지 않은 경우
        if (!res.ok) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const userData = await res.json();

        // 3. 권한에 ROLE_ADMIN이 포함되어있는지 확인
        if (!userData.role || !userData.role.includes('ROLE_ADMIN')) {
            // ADMIN이 아니면 → 메인 페이지로 돌려보냄
            return NextResponse.redirect(new URL('/', request.url));
        }

        // ADMIN 권한 확인 완료 → 통과!
        return NextResponse.next();
    } catch {
        // 백엔드 서버에 접속할 수 없는 경우
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// /admin 으로 시작하는 모든 경로에서만 이 미들웨어가 작동합니다.
export const config = {
    matcher: ['/admin/:path*'],
};
