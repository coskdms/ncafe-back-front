import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8032';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=kakao_no_code', req.url));
    }

    try {
        // 1. Spring Boot 카카오 로그인 API 호출
        const response = await fetch(`${API_BASE}/auth/kakao?code=${code}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: '카카오 로그인에 실패했습니다.' }));
            console.error('Kakao login fail:', error);
            return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url));
        }

        const data = await response.json();
        const token = data.token;

        if (!token) {
            return NextResponse.redirect(new URL('/login?error=no_token', req.url));
        }

        // 2. iron-session으로 JWT를 암호화된 httpOnly 쿠키에 저장
        const session = await getSession();
        session.token = token;
        session.user = {
            nickname: data.nickname,
            role: data.role,
        };
        await session.save();

        // 3. 성공 시 메인 페이지 또는 마이페이지로 이동
        return NextResponse.redirect(new URL('/', req.url));

    } catch (error) {
        console.error('Kakao auth callback error:', error);
        return NextResponse.redirect(new URL('/login?error=server_error', req.url));
    }
}
