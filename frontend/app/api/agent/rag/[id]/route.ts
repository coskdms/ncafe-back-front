import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/session';

const AGENT_BASE = process.env.AGENT_API_URL || 'http://localhost:8000';

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    // ★ 문서 수정은 관리자만 (AI 서버의 /rag/documents는 자체 인증이 없음)
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const { id } = await props.params;
        const body = await req.json();

        const agentRes = await fetch(`${AGENT_BASE}/rag/documents/${id}`, {
            method: 'PUT',
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
        console.error('RAG document update error:', error);
        return NextResponse.json(
            { error: 'RAG 문서 수정 중 문제가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    // ★ 문서 삭제는 관리자만
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const { id } = await props.params;

        const agentRes = await fetch(`${AGENT_BASE}/rag/documents/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!agentRes.ok) {
            const errBody = await agentRes.text();
            throw new Error(`Agent server responded with ${agentRes.status}: ${errBody}`);
        }

        const data = await agentRes.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('RAG document deletion error:', error);
        return NextResponse.json(
            { error: 'RAG 문서 삭제 중 문제가 발생했습니다.' },
            { status: 500 }
        );
    }
}
