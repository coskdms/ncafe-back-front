import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE_URL ||
    (process.env.NODE_ENV === 'production' ? 'http://backend:8032' : 'http://localhost:8032');

// Node.js Runtime (Docker 내부 DNS 해석 필요)
export const dynamic = 'force-dynamic';

/**
 * SSE 프록시 API Route
 * 
 * ReadableStream을 사용하여 백엔드 SSE 이벤트를 실시간 전달합니다.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const ssePath = path.join('/');
    const targetUrl = `${API_BASE}/sse/${ssePath}`;

    try {
        const controller = new AbortController();

        // 클라이언트 연결 끊김 시 백엔드 연결도 종료
        req.signal.addEventListener('abort', () => {
            controller.abort();
        });

        const response = await fetch(targetUrl, {
            headers: {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
            },
            signal: controller.signal,
        });

        if (!response.ok || !response.body) {
            return new Response('SSE 연결 실패', { status: response.status });
        }

        // TransformStream으로 실시간 전달
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // 비동기로 백엔드 스트림 읽기 → 클라이언트로 전달
        (async () => {
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    await writer.write(value);
                }
            } catch {
                // 연결 종료
            } finally {
                try { writer.close(); } catch {}
                try { reader.cancel(); } catch {}
            }
        })();

        return new Response(readable, {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
            },
        });
    } catch (error) {
        console.error('[SSE Proxy] Connection failed:', error);
        return new Response('SSE 연결 실패', { status: 502 });
    }
}
