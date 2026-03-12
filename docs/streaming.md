# 버그 수정 요청: AI 채팅 SSE 스트리밍이 정상 동작하도록 수정

## 절대 금지 사항 (반드시 지킬 것)
- **기존 CSS, 디자인, 레이아웃을 절대 수정하지 마세요**
- **기존에 동작하는 코드를 삭제하거나 재작성하지 마세요**
- **파일 전체를 다시 작성하지 마세요. 기존 코드에서 문제가 되는 부분만 수정하세요**
- 스타일(CSS/module.css), 컴포넌트 구조, HTML 마크업은 일절 건드리지 마세요
- 채팅 패널의 UI, 버튼, 입력창 등 기존 디자인에 영향을 주는 변경을 하지 마세요

## 목표
AI 채팅에서 메시지를 보내면 AI 응답이 **글자 단위로 실시간 스트리밍**되어야 한다.
응답이 한꺼번에 나오거나, 한참 뒤에 나오거나, 텍스트가 깨지면 안 된다.

## 전체 데이터 흐름 (이 순서대로 점검)
```
브라우저 (AgentChat.tsx)
  ↕ fetch + ReadableStream (AgentChat.tsx 내부 handleSend)
    ↕ SSE over HTTP
      ↕ Next.js BFF 프록시 (route.ts)   ← 여기서 버퍼링 문제가 가장 많이 발생
        ↕ Node.js http 모듈
          ↕ Agent Server / FastAPI (chat.py)
            ↕ SSE (sse-starlette)
              ↕ Gemini Python SDK (gemini.py)
                ↕ Gemini API
```

## 점검할 파일 목록 (이 파일들만 확인하고 수정하세요)

---

### 1. `beomini-server/app/services/gemini.py` — Gemini API 호출 확인

**확인할 것:** 비동기 클라이언트를 사용하고 있는가?

```python
# ✅ 현재 올바른 코드 — 비동기 클라이언트 + aio 메서드
async_client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options={'api_version': 'v1alpha'}
)

async def chat_stream(messages, auth_token=None) -> AsyncGenerator[str, None]:
    response = await async_client.aio.models.generate_content_stream(
        model=model_name, contents=messages,
        config=get_config(auth_token, captured_actions=actions)
    )
    async for chunk in response:  # 비동기 순회
        if chunk.text:
            yield chunk.text
```

**체크 포인트:**
- [x] `genai.Client`에 `http_options={'api_version': 'v1alpha'}`가 있는가?
- [x] `aio.models.generate_content_stream`을 사용하는가? (`aio`가 빠지면 안 됨)
- [x] `async for`를 사용하는가? (`for`가 아닌 `async for`)
- [x] `chat_stream` 함수가 `async def`로 선언되어 있는가? (`def`가 아닌 `async def`)

---

### 2. `beomini-server/app/routers/chat.py` — SSE 이벤트 변환 확인

**확인할 것:** `sse-starlette`의 `EventSourceResponse`를 사용하고, 청크를 즉시 yield하는가?

```python
# ✅ 현재 올바른 코드
from sse_starlette.sse import EventSourceResponse

@router.post("/chat")
async def chat_endpoint(request: ChatRequest, authorization: str = Header(None)):
    messages = to_gemini_messages(request.messages)

    if not request.stream:
        content = await chat(messages, auth_token=authorization)
        return {"content": content}

    async def event_generator():
        try:
            async for chunk in chat_stream(messages, auth_token=authorization):
                if isinstance(chunk, dict):
                    yield {"data": json.dumps(chunk, ensure_ascii=False)}
                elif chunk:
                    yield {"data": json.dumps({"content": chunk}, ensure_ascii=False)}
            yield {"data": "[DONE]"}
        except Exception as e:
            yield {"data": json.dumps({"error": str(e)}, ensure_ascii=False)}

    return EventSourceResponse(event_generator())
```

**체크 포인트:**
- [x] `sse-starlette` 패키지가 `requirements.txt`에 있는가?
- [x] `EventSourceResponse`를 사용하는가?
- [x] yield 형식이 `{"data": json.dumps(...)}`인가?
- [x] 마지막에 `{"data": "[DONE]"}`을 yield하는가?

---

### 3. `frontend/app/api/agent/chat/route.ts` — BFF 프록시 (가장 중요)

**이 파일이 스트리밍 문제의 가장 흔한 원인이다.**

**확인할 것:** `fetch` 대신 Node.js `http` 모듈을 사용하는가?

```typescript
// ✅ 현재 올바른 코드 — Node.js http 모듈로 버퍼링 없이 전달
import { NextRequest, NextResponse } from 'next/server';
import http from 'http';

const AGENT_BASE = process.env.AGENT_API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const payload = JSON.stringify(body);

    if (body.stream === false) {
        // 일반 JSON 요청 (fetch 사용 OK)
        const agentRes = await fetch(`${AGENT_BASE}/chat`, { ... });
        return NextResponse.json(await agentRes.json());
    }

    // 스트리밍 요청 (Node.js http 모듈 사용)
    const stream = await new Promise<ReadableStream<Uint8Array>>((resolve, reject) => {
        const httpReq = http.request(
            {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload),
                },
            },
            (res) => {
                const readableStream = new ReadableStream<Uint8Array>({
                    start(controller) {
                        res.on('data', (chunk: Buffer) => {
                            controller.enqueue(new Uint8Array(chunk));
                        });
                        res.on('end', () => controller.close());
                        res.on('error', (err) => controller.error(err));
                    },
                    cancel() { res.destroy(); },
                });
                resolve(readableStream);
            }
        );
        httpReq.on('error', reject);
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
}
```

**왜 fetch가 안 되는가:**
Next.js의 `fetch`는 내부적으로 undici를 사용하는데, undici가 SSE 응답을 내부 버퍼에 모아두기 때문에 `response.body`를 `NextResponse`에 전달해도 실시간 스트리밍이 안 된다.
Node.js `http` 모듈은 `res.on('data')`로 원시 청크를 즉시 받아서 전달할 수 있다.

**체크 포인트:**
- [x] `import http from 'http'`가 있는가?
- [x] 스트리밍 요청에서 `fetch` 대신 `http.request`를 사용하는가?
- [x] 응답 헤더에 `'X-Accel-Buffering': 'no'`가 있는가?

---

### 4. `frontend/components/common/AgentChat/AgentChat.tsx` — SSE 파서 & UI 렌더링 확인

> ⚠️ 이 프로젝트에서는 별도의 `aiAgent.ts`나 `ChatPanel.tsx`가 없고,
> `AgentChat.tsx` 한 파일 내의 `handleSend` 함수에서 SSE 파싱과 UI 렌더링을 모두 처리합니다.

**확인할 것 4가지:**

**(a) `TextDecoder`에 `stream: true`가 있는가?**

```typescript
// ✅ 현재 올바른 코드
const decoder = new TextDecoder('utf-8', { fatal: false });
buffer += decoder.decode(value, { stream: true });
```

**(b) 불완전한 SSE 라인을 버퍼에 유지하는가?**

```typescript
// ✅ 현재 올바른 코드 — 불완전한 마지막 라인은 버퍼에 유지
const lines = buffer.split('\n');
buffer = lines.pop() || '';  // ← 핵심: 마지막 요소를 버퍼에 보관
```

**(c) `[DONE]` 처리가 되어있는가?**

```typescript
// ✅ 현재 코드 — [DONE] 수신 시 continue (루프 종료 시 자동 종료됨)
if (dataStr === '[DONE]') continue;
```

**(d) 스트리밍 시작 전 빈 AI 메시지를 미리 추가하는가?**

```typescript
// ✅ 현재 올바른 코드
setIsTyping(false);
const botId = ++msgIdCounter.current;
setMessages(prev => [...prev, { id: botId, text: '', sender: 'bot' }]);
```

**(e) 청크를 누적 추가하는가?**

```typescript
// ✅ 현재 올바른 코드
fullText += data.content;
setMessages(prev =>
    prev.map(m => m.id === botId ? { ...m, text: fullText } : m)
);
```

**체크 포인트:**
- [x] `decoder.decode(value, { stream: true })`에 `stream: true`가 있는가?
- [x] `buffer = lines.pop() || ''`로 불완전한 라인을 보관하는가?
- [x] `[DONE]` 수신 처리가 되어 있는가?
- [x] 스트리밍 시작 전에 빈 AI 메시지를 미리 추가해두는가?
- [x] `fullText += data.content`로 **누적 추가**하는가? (덮어쓰기가 아닌 이어붙이기)

---

## 최종 체크리스트

수정 후 아래를 모두 확인하세요:
- [x] 채팅 패널의 디자인이 변경 전과 동일한가?
- [x] 기존 페이지들의 디자인이 변경 전과 동일한가?
- [x] 채팅에서 메시지를 보내면 AI 응답이 글자 단위로 실시간으로 나타나는가?
- [x] 한글이 깨지지 않는가?
- [x] 응답이 한꺼번에 나오지 않고 점진적으로 나오는가?

## 다시 한번 강조
**기존 CSS, 스타일, 마크업, 컴포넌트 구조를 절대 수정하지 마세요.**
**스트리밍 로직에서 문제가 되는 부분만 찾아서 수정하세요.**