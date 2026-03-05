import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8032';

export async function POST(req: NextRequest) {
    const body = await req.json();

    // 1. Spring Boot 로그인 API 호출 (서버 → 서버, 직접 통신)
    const loginRes = await fetch(`${API_BASE}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!loginRes.ok) {
        const error = await loginRes.json().catch(() => ({ message: '로그인에 실패했습니다.' }));
        return NextResponse.json(error, { status: loginRes.status });
    }

    const loginData = await loginRes.json();
    // loginData = { id, nickname, role }

    // 2. Spring Boot에서 JWT 토큰 받기
    // ★ 기존: Spring Boot가 쿠키로 JWT를 주었음
    // ★ BFF: Spring Boot가 JSON body로 JWT를 줌 → Next.js 서버가 관리
    const token = loginData.token;

    if (!token) {
        return NextResponse.json({ message: '토큰을 받지 못했습니다.' }, { status: 500 });
    }

    // 3. iron-session으로 JWT를 암호화된 httpOnly 쿠키에 저장
    const session = await getSession();
    session.token = token;
    session.user = {
        nickname: loginData.nickname,
        role: loginData.role,
    };
    await session.save();

    // 4. 클라이언트에 user 정보만 반환 (★ JWT는 절대 반환하지 않음!)
    return NextResponse.json({ user: session.user });
}
