# 🦆 역할 기반 AI 에이전트 청사진 (Role-Based Agent System)

> **목표:** 비회원 / 회원 / 관리자, 세 가지 역할에 따라 에이전트가 제공하는 기능과 응답 범위를 다르게 가져간다.

---

## 1. 현재 구조 분석

### 현재 흐름

```
[프론트엔드 AgentChat.tsx]
    └─ fetch('/api/agent/chat')
        └─ [BFF Route: app/api/agent/chat/route.ts]
            ├─ iron-session에서 JWT 토큰 추출
            └─ beomini-server /chat 으로 전달 (Authorization 헤더)
                └─ [gemini.py] 
                    ├─ SYSTEM_INSTRUCTION (단일 페르소나)
                    └─ get_config() → 모든 도구를 한꺼번에 등록
```

### 현재 문제점

| 문제 | 설명 |
|:---|:---|
| **도구 접근 제어 없음** | 비회원에게도 `get_my_orders`, `cancel_order` 등 회원 전용 도구가 노출됨 |
| **역할 인식 불가** | beomini-server가 사용자의 role을 모름. JWT 유무로만 로그인 여부를 판단 |
| **관리자 기능 부재** | 관리자 전용 에이전트 도구(매출 조회, 주문 관리, 메뉴 CRUD 등)가 없음 |
| **System Instruction 단일** | 역할에 관계없이 동일한 페르소나·규칙을 적용 중 |

---

## 2. 역할별 기능 범위 설계

### 🔓 비회원 (GUEST)

> 로그인하지 않은 상태. 메뉴 탐색과 카페 정보 질문만 가능.

| 카테고리 | 사용 가능 도구 | 예시 질문 |
|:---|:---|:---|
| 메뉴 탐색 | `get_menus`, `get_categories` | "메뉴 보여줘", "커피 종류 뭐 있어?" |
| 메뉴 추천 | `search_knowledge_base` | "카페인 없는 음료 추천해줘" |
| 매장 정보 | `get_shop_info` | "영업시간 알려줘", "주차 가능해?" |
| 장바구니 | `add_to_cart` | "아메리카노 담아줘" |
| 페이지 이동 | `navigate_to_page` (제한) | 홈, 메뉴목록, 로그인, 장바구니만 |
| 메뉴 상세 | `view_menu_detail` | "이 메뉴 상세 보여줘" |

**🚫 차단할 기능:**
- 마이페이지 이동, 결제 페이지 이동
- 주문 내역 조회, 주문 취소, 포인트/등급 조회
- 바로 주문 (`direct_order`) → 로그인 유도 메시지로 대체

---

### 🔒 회원 (MEMBER)

> 로그인한 일반 사용자. 비회원 기능 + 개인화 기능 사용 가능.

| 카테고리 | 사용 가능 도구 | 예시 질문 |
|:---|:---|:---|
| 비회원 전체 | _(위 전부)_ | — |
| 바로 주문 | `direct_order` | "아메리카노 바로 결제해줘" |
| 주문 관리 | `get_my_orders`, `get_order_status`, `cancel_order` | "내 주문 내역 보여줘" |
| 포인트/등급 | `get_my_growth_info` | "나 지금 몇 포인트야?" |
| 페이지 이동 | `navigate_to_page` (전체) | 마이페이지, 결제 페이지 포함 |

**🚫 차단할 기능:**
- 관리자 전용 기능 전부 (매출 조회, 주문 상태 변경, 메뉴 CRUD 등)

---

### 👑 관리자 (ADMIN)

> 관리자 페이지 접속 가능. 회원 기능 + 관리자 전용 도구 사용 가능.

| 카테고리 | 사용 가능 도구 (신규) | 예시 질문 |
|:---|:---|:---|
| 회원 전체 | _(위 전부)_ | — |
| 주문 관리 | `get_all_orders`, `update_order_status` | "오늘 들어온 주문 보여줘", "주문 #123 준비완료로 바꿔줘" |
| 매출 통계 | `get_sales_summary` | "오늘 매출 얼마야?", "이번 주 매출 알려줘" |
| 메뉴 관리 | `create_menu`, `update_menu`, `delete_menu` | "새 메뉴 등록해줘", "아메리카노 가격 변경해줘" |
| 카테고리 관리 | `create_category`, `update_category` | "새 카테고리 추가해줘" |
| 매장 설정 | `update_shop_settings` | "영업시간 변경해줘", "배달비 수정해줘" |
| 공지/RAG | `manage_rag_documents` | "새 공지사항 등록해줘" |
| 페이지 이동 | `navigate_to_page` (관리자 페이지 포함) | "관리자 대시보드로 이동해줘" |

---

## 3. 기술적 구현 계획

### Phase 1: 역할 정보 전달 파이프라인 구축

현재 BFF Route에서 이미 `session.token`(JWT)을 전달하고 있고, `session.user.role`도 iron-session에 저장되어 있음.

#### 1-1. BFF Route 수정 (`app/api/agent/chat/route.ts`)

```diff
  const session = await getSession();
  const apiAuthToken = session.token;
+ const userRole = session.user?.role || 'GUEST';

  // beomini-server에 role 정보도 함께 전달
  headers: {
      'Content-Type': 'application/json',
      ...(apiAuthToken ? { 'Authorization': `Bearer ${apiAuthToken}` } : {}),
+     'X-User-Role': userRole,
  }
```

#### 1-2. beomini-server Router 수정 (`routers/chat.py`)

```diff
  @router.post("/chat")
  async def chat_endpoint(
      request: ChatRequest,
      authorization: str = Header(None),
+     x_user_role: str = Header("GUEST"),
  ):
-     content = await chat(messages, auth_token=authorization)
+     content = await chat(messages, auth_token=authorization, user_role=x_user_role)
```

---

### Phase 2: 역할별 도구·시스템 프롬프트 분기 (`gemini.py`)

#### 2-1. 역할별 System Instruction 분리

```python
# 공통 페르소나 (모든 역할 공유)
BASE_PERSONA = """
너는 "고라파덕 카페"의 똑똑하고 친절한 알바생 "고라파덕"이야.
모든 대답은 반드시 고라파덕의 말투인 '~덕'으로 끝나야 해.
...
"""

# 비회원 전용 추가 규칙
GUEST_RULES = """
═══ 비회원 안내 규칙 ═══
- 사용자는 현재 로그인하지 않은 비회원이다덕.
- 주문 내역, 포인트 조회, 주문 취소 등 개인화 기능은 사용할 수 없다덕.
- 해당 기능을 요청하면 "로그인이 필요한 기능이다덕! 🔐 로그인하면 포인트도 쌓이고 
  주문 내역도 볼 수 있다덕~"이라고 안내하고 로그인 페이지 이동을 제안해줘.
- 마이페이지/결제 페이지로의 이동 요청도 로그인을 안내해줘.
"""

# 회원 전용 추가 규칙
MEMBER_RULES = """
═══ 회원 안내 규칙 ═══
- 사용자는 로그인된 회원이다덕.
- 개인화 기능(포인트, 주문 내역, 주문 취소 등)을 자유롭게 사용할 수 있다덕.
- 관리자 기능은 사용할 수 없다덕. 관리자 관련 질문에는 "관리자 전용 기능이다덕!"이라고 안내해줘.
"""

# 관리자 전용 추가 규칙
ADMIN_RULES = """
═══ 관리자 안내 규칙 ═══
- 사용자는 관리자(ADMIN)이다덕.
- 모든 회원 기능 + 관리자 기능을 사용할 수 있다덕.
- 매출 조회, 주문 상태 변경, 메뉴 CRUD, 매장 설정 변경 등 관리 기능을 적극 지원해줘.
- 관리자 페이지 이동도 가능하다덕.
"""
```

#### 2-2. 역할별 도구 세트 구성

```python
def get_config(auth_token=None, captured_actions=None, user_role="GUEST"):
    
    # ── 공통 도구 (모든 역할) ──
    common_tools = [
        get_menus, get_categories, search_knowledge_base,
        get_shop_info, add_to_cart, view_menu_detail,
    ]

    # ── 비회원: 제한된 navigate만 허용 ──
    guest_tools = [
        *common_tools,
        navigate_to_page_guest,   # home, menu_list, login, cart만 허용
    ]
    
    # ── 회원: + 개인화 도구 ── 
    member_tools = [
        *common_tools,
        navigate_to_page,         # 전체 페이지 이동
        direct_order,
        get_my_growth_info,
        get_my_orders, get_order_status, cancel_order,
    ]
    
    # ── 관리자: + 관리 도구 ──
    admin_tools = [
        *member_tools,
        navigate_to_page_admin,   # 관리자 페이지 포함
        get_all_orders, update_order_status,
        get_sales_summary,
        # create_menu, update_menu, delete_menu,  (Phase 3)
    ]
    
    # 역할에 따라 도구와 시스템 프롬프트 선택
    role_config = {
        "GUEST":  {"tools": guest_tools,  "rules": GUEST_RULES},
        "MEMBER": {"tools": member_tools, "rules": MEMBER_RULES},
        "ADMIN":  {"tools": admin_tools,  "rules": ADMIN_RULES},
    }
    
    config = role_config.get(user_role, role_config["GUEST"])
    
    return types.GenerateContentConfig(
        tools=config["tools"],
        automatic_function_calling=types.AutomaticFunctionCallingConfig(),
        system_instruction=BASE_PERSONA + config["rules"],
    )
```

---

### Phase 3: 관리자 전용 도구 구현 (신규)

#### 3-1. Backend API 확장 (`backend_api.py`)

```python
# ── 관리자 전용 API ──

def get_all_orders(auth_token: str, status: str = None) -> dict:
    """전체 주문 목록 조회 (관리자용)"""
    headers = {"Authorization": auth_token}
    params = {"status": status} if status else {}
    response = requests.get(f"{BACKEND_URL}/admin/orders", headers=headers, params=params)
    return response.json()

def update_order_status(auth_token: str, order_id: int, status: str) -> dict:
    """주문 상태 변경 (PENDING → PREPARING → READY → COMPLETED)"""
    headers = {"Authorization": auth_token}
    response = requests.put(
        f"{BACKEND_URL}/admin/orders/{order_id}/status",
        headers=headers, json={"status": status}
    )
    return response.json()

def get_sales_summary(auth_token: str, period: str = "today") -> dict:
    """매출 요약 조회 (today / week / month)"""
    headers = {"Authorization": auth_token}
    response = requests.get(f"{BACKEND_URL}/admin/sales?period={period}", headers=headers)
    return response.json()
```

#### 3-2. 관리자 전용 도구 정의 (gemini.py 내부)

```python
def get_all_orders(status: str = None) -> dict:
    """
    전체 주문 목록을 조회합니다 (관리자 전용).
    "오늘 주문 보여줘", "대기 중인 주문 있어?" 등의 질문에 사용합니다.
    
    Args:
        status: 필터링할 주문 상태 (PENDING, PAID, PREPARING, READY, COMPLETED, CANCELLED)
    """
    return backend_api.get_all_orders(auth_token, status)

def update_order_status(order_id: int, new_status: str) -> dict:
    """
    특정 주문의 상태를 변경합니다 (관리자 전용).
    "주문 #5 준비완료로 변경해줘" 등의 요청에 사용합니다.
    
    Args:
        order_id: 주문 ID
        new_status: 변경할 상태 (PREPARING, READY, COMPLETED)
    """
    return backend_api.update_order_status(auth_token, order_id, new_status)

def get_sales_summary(period: str = "today") -> dict:
    """
    매출 요약을 조회합니다 (관리자 전용).
    "오늘 매출 얼마야?", "이번 주 매출 알려줘" 등의 질문에 사용합니다.
    
    Args:
        period: 조회 기간 (today, week, month)
    """
    return backend_api.get_sales_summary(auth_token, period)
```

---

### Phase 4: 프론트엔드 연동

#### 4-1. 관리자 페이지 전용 에이전트 챗봇

현재 `AgentChat.tsx`는 관리자 페이지(`/admin`)에서 렌더링하지 않음 (line 392):
```tsx
if (!isMounted || !pathname || pathname.startsWith('/admin')) {
    return null;
}
```

**두 가지 방향 중 택 1:**

| 방안 | 설명 | 장점 | 단점 |
|:---|:---|:---|:---|
| **A. 단일 채봇, 관리자 페이지에서도 노출** | `pathname.startsWith('/admin')` 조건 제거. 역할 분기는 서버가 처리 | 구현 간단 | 관리자 페이지 UI와 스타일 충돌 가능 |
| **B. 관리자 전용 채봇 컴포넌트 분리** | `AdminAgentChat.tsx`를 별도로 만들어 관리자 레이아웃에 배치 | UI 맞춤 가능, 관리자 전용 퀵리플라이 | 코드 중복 |

**추천: 방안 A** (단일 채봇, 서버에서 역할 분기)
- 프론트는 단순히 `/api/agent/chat`을 호출하고, BFF가 세션에서 role을 읽어 전달하므로 프론트 수정 최소화
- 관리자 페이지에서도 FAB 버튼 노출만 허용하면 됨

#### 4-2. 역할별 퀵 리플라이 차별화

```tsx
// AgentChat.tsx 환영 메시지 분기
if (willOpen && isFirstOpen) {
    setIsFirstOpen(false);
    
    const role = user?.role || 'GUEST';
    
    if (role === 'ADMIN') {
        setMessages([{ id: welcomeId, text: '관리자님 안녕하다덕! 🛡️ 무엇을 도와줄까덕?', sender: 'bot' }]);
        setQuickReplies(['오늘 매출 알려줘', '대기 중 주문 보여줘', '메뉴 목록']);
    } else if (isAuthenticated) {
        setMessages([{ id: welcomeId, text: '쿠웨에엑! 반갑다덕! 🎉 무엇을 도와줄까덕?', sender: 'bot' }]);
        setQuickReplies(['메뉴 보여줘', '내 포인트 확인', '주문 내역']);
    } else {
        setMessages([{ id: welcomeId, text: '쿠웨에엑! 환영한다덕! 🎉 무엇을 도와줄까덕?', sender: 'bot' }]);
        setQuickReplies(['메뉴 보여줘', '추천해줘', '디저트 뭐 있어?']);
    }
}
```

---

## 4. 전체 아키텍처 (수정 후)

```
[프론트엔드]
  AgentChat.tsx ─────────────────┐
  (role별 퀵리플라이)             │
                                 ▼
[BFF Route: /api/agent/chat]
  ├─ session.token  → Authorization 헤더
  ├─ session.user.role → X-User-Role 헤더  ← ⭐ 신규
  └─────────────────────┐
                        ▼
[beomini-server /chat]
  routers/chat.py
    ├─ x_user_role 헤더 수신
    └─ gemini.py
         ├─ get_config(role=x_user_role)
         │    ├─ GUEST  → 공통 도구만 + GUEST_RULES
         │    ├─ MEMBER → + 개인화 도구 + MEMBER_RULES
         │    └─ ADMIN  → + 관리 도구  + ADMIN_RULES
         └─ System Instruction = BASE_PERSONA + 역할별 RULES
```

---

## 5. 구현 우선순위 ⏰

| 순서 | 작업 | 난이도 | 설명 |
|:---:|:---|:---:|:---|
| **1** | BFF에서 `X-User-Role` 헤더 전달 | ⭐ | route.ts 한 줄 추가 |
| **2** | beomini-server에서 role 수신 | ⭐ | chat.py, gemini.py 수정 |
| **3** | 역할별 System Instruction 분리 | ⭐⭐ | 프롬프트 3벌 작성 |
| **4** | 역할별 도구 세트 분리 | ⭐⭐ | get_config 내 분기 로직 |
| **5** | 비회원 navigate 제한 | ⭐ | guest용 navigate 함수 |
| **6** | 프론트 퀵리플라이 분기 | ⭐ | AgentChat.tsx 환영 메시지 |
| **7** | 관리자 페이지 채팅 노출 | ⭐ | pathname 조건 수정 |
| **8** | 관리자 전용 API 연동 (backend_api.py) | ⭐⭐⭐ | Spring Boot API 확인 필요 |
| **9** | 관리자 전용 도구 구현 | ⭐⭐⭐ | 매출 조회, 주문 관리 등 |

---

## 6. 보안 고려사항 🔐

| 항목 | 대응 방법 |
|:---|:---|
| **역할 위조 방지** | `X-User-Role`은 BFF 서버에서만 세팅. 클라이언트가 직접 beomini-server에 접근 불가 (Docker 내부 네트워크) |
| **이중 검증** | 관리자 도구는 `auth_token`과 함께 Spring Boot API를 호출 → 백엔드에서도 ADMIN 권한 검증 |
| **도구 은닉** | Gemini에게 역할별 도구만 등록 → 존재하지 않는 도구는 호출 자체가 불가능 |

---

## 7. 기대 효과 🎯

1. **비회원**: 불필요한 에러 메시지 대신 로그인 유도 → **전환율 향상**
2. **회원**: 개인화된 경험에 집중 → **사용자 만족도 향상**
3. **관리자**: "오늘 매출 얼마야?" 한마디로 대시보드 없이 빠른 확인 → **운영 효율화**
4. **보안**: 역할별 도구 격리로 권한 외 기능 접근 원천 차단
