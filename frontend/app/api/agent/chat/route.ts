import { NextRequest, NextResponse } from 'next/server';

const AGENT_BASE = process.env.AGENT_API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // beomini 서버로의 채팅 프록시 (내부망 호출)
        const agentRes = await fetch(`${AGENT_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!agentRes.ok) {
            const errBody = await agentRes.text();
            throw new Error(`Agent server responded with ${agentRes.status}: ${errBody}`);
        }

        const data = await agentRes.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Agent chat error:', error);
        return NextResponse.json(
            { error: 'AI 에이전트와 통신하는 중 문제가 발생했습니다.' },
            { status: 500 }
        );
    }
}
