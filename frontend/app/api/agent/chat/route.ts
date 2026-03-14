import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';
import http from 'http';

// 환경변수에서 AGENT_API_URL을 가져오되, 없으면 로컬 호스트를 기본값으로 사용
const AGENT_BASE = process.env.AGENT_API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        console.log('[AgentChat API] Request received');
        const body = await req.json();
        const payload = JSON.stringify(body);
        console.log('[AgentChat API] Request body:', payload);

        // ──────────────────────────────────────────
        // 세션 정보 활용 (iron-session)
        // Spring Boot JWT를 Authorization 헤더로 전달해줍니다.
        // ──────────────────────────────────────────
        const session = await getSession();
        const apiAuthToken = session.token;
        const userRole = session.user?.role || 'GUEST';
        console.log('[AgentChat API] Auth token present:', !!apiAuthToken, 'Role:', userRole);

        const agentUrl = new URL(`${AGENT_BASE}/chat`);
        console.log('[AgentChat API] Target:', agentUrl.toString());

        if (body.stream === false) {
            // 일반 JSON 요청
            const agentRes = await fetch(agentUrl.toString(), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Role': userRole,
                    ...(apiAuthToken ? { 'Authorization': `Bearer ${apiAuthToken}` } : {})
                },
                body: payload,
                cache: 'no-store'
            });

            if (!agentRes.ok) {
                const errBody = await agentRes.text();
                throw new Error(`Agent server responded with ${agentRes.status}: ${errBody}`);
            }

            const data = await agentRes.json();
            return NextResponse.json(data);
        }

        // ──────────────────────────────────────────
        // 스트리밍 요청 (Node.js http 모듈 사용)
        // ──────────────────────────────────────────
        console.log('[AgentChat API] Forwarding stream via http module');
        
        const stream = await new Promise<ReadableStream<Uint8Array>>((resolve, reject) => {
            const httpReq = http.request(
                {
                    hostname: agentUrl.hostname,
                    port: agentUrl.port,
                    path: agentUrl.pathname,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(payload),
                        'X-User-Role': userRole,
                        ...(apiAuthToken ? { 'Authorization': `Bearer ${apiAuthToken}` } : {})
                    },
                },
                (res) => {
                    if (res.statusCode && res.statusCode >= 400) {
                        reject(new Error(`Agent Server responded with status: ${res.statusCode}`));
                        return;
                    }

                    const readableStream = new ReadableStream<Uint8Array>({
                        start(controller) {
                            res.on('data', (chunk: Buffer) => {
                                controller.enqueue(new Uint8Array(chunk));
                            });
                            res.on('end', () => {
                                controller.close();
                            });
                            res.on('error', (err) => {
                                controller.error(err);
                            });
                        },
                        cancel() {
                            res.destroy();
                        },
                    });

                    resolve(readableStream);
                }
            );

            httpReq.on('error', (err) => {
                console.error('[AgentChat API] HTTP Request Error:', err);
                reject(err);
            });
            httpReq.write(payload);
            httpReq.end();
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
            },
        });

    } catch (error: any) {
        console.error('[AgentChat API] Error:', error);
        return NextResponse.json(
            { error: error.message || 'AI 에이전트와 통신하는 중 문제가 발생했습니다.' },
            { status: 500 }
        );
    }
}
