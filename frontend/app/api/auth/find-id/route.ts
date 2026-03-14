import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8032';

export async function GET(req: NextRequest) {
    const phone = req.nextUrl.searchParams.get('phone') || '';

    const res = await fetch(`${API_BASE}/auth/find-id?phone=${encodeURIComponent(phone)}`);
    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
}
