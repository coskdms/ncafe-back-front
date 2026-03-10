import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

// 환경변수에서 AGENT_API_URL을 가져오되, 없으면 로컬 호스트를 기본값으로 사용
const AGENT_BASE = process.env.AGENT_API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        console.log('[AgentChat API] Request received');
        const body = await req.json();
        console.log('[AgentChat API] Request body:', JSON.stringify(body));

        // ──────────────────────────────────────────
        // 세션 정보 활용 (iron-session)
        // Spring Boot JWT를 Authorization 헤더로 전달해줍니다.
        // ──────────────────────────────────────────
        const session = await getSession();
        const apiAuthToken = session.token; 
        console.log('[AgentChat API] Auth token present:', !!apiAuthToken);

        // beomini 서버로의 채팅 프록시 (내부망 호출)
        const agentUrl = `${AGENT_BASE}/chat`;
        console.log('[AgentChat API] Forwarding to:', agentUrl);

        const agentRes = await fetch(agentUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...(apiAuthToken ? { 'Authorization': `Bearer ${apiAuthToken}` } : {})
            },
            body: JSON.stringify(body),
            // Next.js fetch 캐시 방지
            cache: 'no-store'
        });

        if (!agentRes.ok) {
            const errBody = await agentRes.text();
            console.error(`[AgentChat API] Agent server error (${agentRes.status}):`, errBody);
            throw new Error(`Agent server responded with ${agentRes.status}: ${errBody}`);
        }

        const data = await agentRes.json();
        console.log('[AgentChat API] Response from agent success');
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('[AgentChat API] Error:', error);
        // 상세 에러 메시지 포함
        const errorMessage = error.message || 'AI 에이전트와 통신하는 중 문제가 발생했습니다.';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
