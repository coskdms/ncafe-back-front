# 기능: 채팅에서 "메뉴 목록 보여줘" 입력 시 페이지 이동

## 절대 금지 사항 (반드시 지킬 것)
- **기존 CSS, 디자인, 레이아웃을 절대 수정하지 마세요**
- **기존에 동작하는 코드를 삭제하거나 재작성하지 마세요**
- **파일 전체를 다시 작성하지 마세요. 기존 코드에 필요한 부분만 추가하세요**
- **import 추가, 조건문 추가, 함수 추가만 허용됩니다**
- 스타일(CSS/module.css), 컴포넌트 구조, HTML 마크업은 일절 건드리지 마세요

## 목표
채팅에서 "메뉴 목록 보여줘"라고 입력하면 AI가 텍스트로 응답하면서 브라우저를 `/menus` 페이지로 이동시킨다.
이 기능은 Gemini의 **Automatic Function Calling (AFC)**을 사용하여 구현한다.

## 전체 흐름
```
사용자: "메뉴 목록 보여줘"
  → Agent Server → Gemini에게 대화 전달
  → Gemini가 navigate_to_page(page="menu_list") 함수 호출 결정
  → AFC가 자동으로 navigate_to_page 실행 → 텍스트 반환 + captured_actions에 액션 저장
  → Gemini가 "메뉴 페이지로 이동하겠다덕!" 텍스트 응답
  → SSE 스트림으로 텍스트 전송 후 액션 dict 전송
  → 프론트엔드가 SSE에서 액션 감지 → router.push("/menus")로 페이지 이동
```

## 구현 파일 목록 (이 파일들만 확인하세요)

> ⚠️ 이 프로젝트에는 `tools.py`, `session.py`, `aiAgent.ts`, `ChatPanel.tsx`가 **없습니다**.
> 모든 기능은 아래 4개 파일에 통합되어 있습니다.

---

### 1. `beomini-server/app/services/gemini.py` — navigate_to_page 함수 정의 + tools 등록

이 프로젝트에서는 별도의 `tools.py`가 없으며, `gemini.py`의 `get_config()` 함수 내부에
**클로저 함수**로 모든 도구를 정의하고, `types.GenerateContentConfig`의 `tools`에 등록합니다.
또한 `automatic_function_calling`이 활성화되어 있어 Gemini가 함수를 자동 호출합니다.

**(a) 페이지 목록 상수** (파일 상단에 정의됨):
```python
# ✅ 구현 완료
PAGES = {
    "home": {"url": "/", "description": "홈페이지"},
    "menu_list": {"url": "/menus", "description": "메뉴 목록 페이지"},
    "login": {"url": "/login", "description": "로그인 페이지"},
}
```

**(b) navigate_to_page 함수** (`get_config()` 내부 클로저):
```python
# ✅ 구현 완료
def navigate_to_page(page: str) -> str:
    """사용자를 특정 페이지로 이동시킵니다."""
    page_info = PAGES.get(page)
    if not page_info:
        return "알 수 없는 페이지다덕.."
    
    # 프론트엔드 액션 캡처 (클로저의 captured_actions 리스트에 추가)
    if captured_actions is not None:
        captured_actions.append({"action": "navigate", "url": page_info["url"]})
    
    return f"{page_info['description']}로 이동하겠다덕!"
```

**(c) tools 등록** (`get_config()` 반환값):
```python
# ✅ 구현 완료
return types.GenerateContentConfig(
    tools=[
        get_menus, get_categories, search_knowledge_base, get_my_growth_info,
        get_my_orders, get_order_status, cancel_order, get_shop_info,
        add_to_cart, direct_order, navigate_to_page  # ← navigate_to_page 포함
    ],
    automatic_function_calling=types.AutomaticFunctionCallingConfig(),
    system_instruction=SYSTEM_INSTRUCTION,
)
```

**(d) chat_stream에서 텍스트(str)와 액션(dict)을 분리 yield**:
```python
# ✅ 구현 완료
async def chat_stream(messages, auth_token=None):
    actions = []
    response = await async_client.aio.models.generate_content_stream(
        model=model_name, contents=messages,
        config=get_config(auth_token, captured_actions=actions)
    )
    async for chunk in response:
        if chunk.text:
            yield chunk.text          # str로 yield → 텍스트

    # 스트림 종료 후 캡처된 액션 yield
    for action in actions:
        yield action                  # dict로 yield → 액션
```

**(e) SYSTEM_INSTRUCTION에 도구 사용 지침 포함**:
```python
# ✅ 구현 완료 (SYSTEM_INSTRUCTION 내부)
8. **도구 사용 규칙:**
   - "보여줘", "이동해줘", "가줘" 등 페이지를 보고 싶다는 요청 -> `navigate_to_page` 사용
     - home: 홈페이지, menu_list: 메뉴 목록, login: 로그인
   - "추천해줘", "뭐가 있어?" 등 정보를 대화로 원할 때 -> `search_knowledge_base` 또는 `get_menus`
```

**체크 포인트:**
- [x] `PAGES` 상수가 정의되어 있는가?
- [x] `navigate_to_page` 함수가 `get_config()` 내부에 정의되어 있는가?
- [x] `captured_actions`에 `{"action": "navigate", "url": ...}` 형태로 추가하는가?
- [x] `tools` 목록에 `navigate_to_page`가 포함되어 있는가?
- [x] `chat_stream`에서 텍스트(str)와 액션(dict)을 분리하여 yield하는가?
- [x] `SYSTEM_INSTRUCTION`에 도구 사용 규칙이 포함되어 있는가?

---

### 2. `beomini-server/app/routers/chat.py` — SSE에서 dict와 str 분리 전송

```python
# ✅ 구현 완료
async def event_generator():
    try:
        async for chunk in chat_stream(messages, auth_token=authorization):
            if isinstance(chunk, dict):
                # dict → 프론트엔드 액션 (navigate 등)
                yield {"data": json.dumps(chunk, ensure_ascii=False)}
            elif chunk:
                # str → 텍스트 청크
                yield {"data": json.dumps({"content": chunk}, ensure_ascii=False)}
        yield {"data": "[DONE]"}
    except Exception as e:
        yield {"data": json.dumps({"error": str(e)}, ensure_ascii=False)}

return EventSourceResponse(event_generator())
```

**SSE로 전송되는 순서:**
```
data: {"content": "메뉴 페이지로 이동하겠다덕!"}   ← 텍스트
data: {"action": "navigate", "url": "/menus"}       ← 액션 (텍스트 뒤에)
data: [DONE]                                         ← 종료 신호
```

**체크 포인트:**
- [x] `isinstance(chunk, dict)` 분기가 있는가?
- [x] dict를 `json.dumps`로 SSE 전송하는가?
- [x] 마지막에 `[DONE]`을 전송하는가?

---

### 3. `frontend/components/common/AgentChat/AgentChat.tsx` — SSE 파싱 + 페이지 이동

> ⚠️ 이 프로젝트에서는 별도의 `aiAgent.ts`나 `ChatPanel.tsx`가 없습니다.
> `AgentChat.tsx`의 `handleSend` 함수에서 SSE 파싱과 액션 처리를 모두 수행합니다.

**(a) SSE 파싱에서 navigate 액션 감지:**
```typescript
// ✅ 구현 완료 — SSE를 통해 전달된 navigate 액션 처리
const data = JSON.parse(dataStr);
if (data.action === 'navigate' && data.url) {
    // SSE로 전달된 navigate 액션 처리
    setTimeout(() => {
        router.push(data.url);
    }, 500);
} else if (data.content) {
    fullText += data.content;
    setMessages(prev =>
        prev.map(m => m.id === botId ? { ...m, text: fullText } : m)
    );
}
```

**(b) `::action{...}::` 마커를 통한 navigate 처리 (폴백):**
```typescript
// ✅ 구현 완료 — 텍스트 내 ::action:: 마커를 통한 navigate 처리
} else if (action.type === 'navigate') {
    router.push(action.url);  // ← "url" 필드 사용 (path가 아님!)
}
```

**(c) `useRouter` import 및 사용:**
```typescript
// ✅ 구현 완료
import { useRouter } from 'next/navigation';
const router = useRouter();
```

**체크 포인트:**
- [x] SSE 파싱에서 `data.action === 'navigate'` 분기가 있는가?
- [x] `data.url`로 `router.push`를 호출하는가? (`data.path`가 아닌 `data.url`)
- [x] `::action{...}::` 마커 파싱에서도 `action.url`을 사용하는가?
- [x] `useRouter`를 import하고 사용하는가?
- [x] navigate 시 `setTimeout`으로 약간의 딜레이를 주는가? (텍스트 렌더링 후 이동)

---

## 최종 체크리스트

구현 후 아래를 모두 확인하세요:
- [x] 채팅 패널의 디자인이 변경 전과 동일한가?
- [x] 기존 페이지들의 디자인이 변경 전과 동일한가?
- [x] "메뉴 목록 보여줘" 입력 시 AI가 텍스트 응답을 하는가?
- [x] 텍스트 응답 후 `/menus` 페이지로 자동 이동하는가?
- [x] "홈으로 가줘" 입력 시 `/` 페이지로 이동하는가?
- [x] "아메리카노 추천해줘" 같은 일반 질문은 페이지 이동 없이 텍스트로 답변하는가?

## 다시 한번 강조
**기존 CSS, 스타일, 마크업, 컴포넌트 구조를 절대 수정하지 마세요.**
**필요한 로직만 기존 코드에 추가하세요.**
