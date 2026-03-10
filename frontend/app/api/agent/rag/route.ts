import { NextRequest, NextResponse } from 'next/server';

const AGENT_BASE = process.env.AGENT_API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const agentRes = await fetch(`${AGENT_BASE}/rag/documents`, {
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
        console.error('RAG document creation error:', error);
        return NextResponse.json(
            { error: 'RAG 문서 저장 중 문제가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const agentRes = await fetch(`${AGENT_BASE}/rag/documents`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!agentRes.ok) {
            const errBody = await agentRes.text();
            throw new Error(`Agent server responded with ${agentRes.status}: ${errBody}`);
        }

        const data = await agentRes.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('RAG document list error:', error);
        return NextResponse.json(
            { error: 'RAG 문서 목록을 가져오는 중 문제가 발생했습니다.' },
            { status: 500 }
        );
    }
}
