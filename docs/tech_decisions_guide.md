# 🎯 기술 선택 이유 & 면접 대비 가이드

> 이 문서는 NCafe 프로젝트에서 사용한 모든 기술/패턴/설계를 **"왜 이걸 선택했나?"** 관점에서 정리합니다.  
> 면접관이 물어볼 만한 질문을 Q&A 형태로 구성했습니다.

---

## 📐 아키텍처

### Q. "왜 헥사고날 아키텍처를 선택했나요?"

**A.** 비즈니스 로직(도메인)을 외부 기술(DB, 웹 프레임워크)로부터 **완전히 분리**하기 위해서입니다.

```
기존 MVC의 문제점:
Controller → Service → Repository
└── Service가 JPA Entity에 직접 의존 → DB 변경 시 비즈니스 로직까지 수정

헥사고날 해결:
Controller → UseCase(Port) → Service → Repository(Port)    
└── Service는 Port(인터페이스)에만 의존 → DB 구현체를 교체해도 비즈니스 로직은 그대로
```

**실제 코드 예시 (menu 도메인):**
```java
// Port-in: 비즈니스 규칙 정의 (어떤 기술에도 의존하지 않음)
public interface GetCustomerMenuListUseCase {
    CustomerMenuListResult getMenuList(GetCustomerMenuListCommand command);
}

// Port-out: DB 접근 추상화 (JPA를 쓰든, JDBC를 쓰든 상관없음)
public interface MenuRepository {
    List<Menu> findAll();
}

// Service: 포트만 바라봄
@Service
public class CustomerMenuService implements GetCustomerMenuListUseCase {
    private final MenuRepository menuRepository; // 인터페이스에 의존
    
    @Override
    public CustomerMenuListResult getMenuList(...) {
        // 비즈니스 로직 (어떤 DB를 쓰는지 몰라도 됨)
    }
}
```

**면접 포인트:**
- "테스트 시 가짜 Repository를 주입하면 DB 없이도 비즈니스 로직 테스트 가능"
- "나중에 PostgreSQL → MongoDB로 바꿔도 Service 코드 수정 불필요"
- "관심사 분리(Separation of Concerns)의 극단적 적용"

---

### Q. "왜 BFF(Backend for Frontend) 패턴을 적용했나요?"

**A.** **JWT 토큰을 브라우저에 노출시키지 않기 위해서**입니다.

```
기존 방식의 보안 문제:
브라우저 → Spring Boot (JWT를 localStorage에 저장)
└── XSS 공격으로 JWT 탈취 가능!

BFF 방식:
브라우저 → Next.js API Route → Spring Boot
         ↑ 여기서 JWT 관리     ↑ JWT로 인증
└── 브라우저는 JWT를 모름. 암호화된 httpOnly 쿠키만 가짐
```

**실제 흐름 (login/route.ts):**
```typescript
// 1. 브라우저가 /api/auth/login에 로그인 요청
// 2. Next.js 서버가 Spring Boot에 전달 → JWT 수신
// 3. iron-session으로 JWT를 암호화된 httpOnly 쿠키에 저장
const session = await getSession();
session.token = token;  // JWT는 여기에만 존재
await session.save();

// 4. 브라우저에는 user 정보만 반환 (JWT 절대 반환 안 함!)
return NextResponse.json({ user: session.user });
```

**범용 API 프록시 ([...path]/route.ts):**
```typescript
// 이후 모든 API 호출에서 세션 쿠키 → JWT 변환이 자동으로 발생
if (session.token) {
    headers.set('Authorization', `Bearer ${session.token}`);
}
```

**면접 포인트:**
- "XSS로 localStorage의 JWT를 탈취하는 공격을 원천 차단"
- "httpOnly 쿠키는 JavaScript로 접근 불가 → CSRF 공격도 STATELESS라 불필요"
- "백엔드 URL(http://backend:8032)이 클라이언트에 노출되지 않아 추가 보안"

---

## 🔐 인증/보안

### Q. "JWT를 왜 사용하나요? 세션 기반 인증과 비교하면?"

**A.** **무상태(Stateless)** 서버를 위해서입니다.

| 비교 | 세션 기반 | JWT 기반 |
|:---|:---|:---|
| **서버 상태** | 세션 저장소 필요 (Redis 등) | 서버에 아무것도 저장 안 함 |
| **확장성** | 서버 여러 대면 세션 공유 필요 | 토큰 자체가 정보를 담고 있어 서버 무관 |
| **성능** | 매 요청마다 세션 조회 | 토큰 서명만 검증 (DB 조회 불필요) |

**실제 코드 (JwtProvider.java):**
```java
// Token 생성: username과 role을 토큰 안에 넣음 (서버가 기억할 필요 없음)
public String createAccessToken(String username, String role) {
    return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .expiration(new Date(now.getTime() + accessExpiration))
            .signWith(secretKey)
            .compact();
}
```

**SecurityConfig (STATELESS 설정):**
```java
// ★ 핵심: 서버가 세션을 생성하지 않음
.sessionManagement(session -> 
    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
```

**면접 포인트:**
- "Docker로 서버를 여러 대 띄워도 세션 공유 걱정 없음"
- "BFF에서 iron-session으로 관리하므로, Access Token만 사용 (Refresh Token 불필요)"

---

### Q. "iron-session은 뭔가요? 왜 쓰나요?"

**A.** Next.js 서버 측에서 **암호화된 httpOnly 쿠키**를 간편하게 관리하는 라이브러리입니다.

```
iron-session의 역할:
┌───────────────────────────────────────────────────────┐
│  JWT를 AES-256으로 암호화 → httpOnly 쿠키에 저장      │
│  → 브라우저 JavaScript로 읽을 수 없음                  │
│  → 서버(Next.js API Route)에서만 복호화해서 사용       │
└───────────────────────────────────────────────────────┘
```

**왜 iron-session인가:**
- Redis 같은 외부 저장소 불필요 (쿠키 자체가 저장소)
- 설정이 매우 간단 (비밀키 하나면 끝)
- Next.js App Router와 완벽 호환

---

## 🖥️ 프론트엔드

### Q. "상태 관리를 왜 Zustand으로 했나요? Redux 대비 장점은?"

**A.** **보일러플레이트가 거의 없고, 코드량이 1/3** 수준이라 생산성이 높습니다.

| 비교 | Redux Toolkit | Zustand |
|:---|:---|:---|
| **설정 코드** | Store + Slice + Provider 필요 | `create()` 한 줄이면 끝 |
| **Provider** | `<Provider store={store}>` 필수 | 불필요 (어디서든 `useStore()`) |
| **비동기 처리** | thunk/saga 미들웨어 필요 | 함수 안에서 그냥 `async/await` |
| **번들 크기** | ~12KB | ~1KB |

**실제 코드 비교:**
```typescript
// Zustand: 이게 전부! (authStore.ts)
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (nickname, password) => {
        const data = await authAPI.login(nickname, password);
        set({ user: data.user, isAuthenticated: true });
    },
}));

// 사용: 어디서든 바로 꺼내 쓸 수 있음
const { user, login } = useAuthStore();
```

**면접 포인트:**
- "6개 스토어(auth, cart, favorite, notification, settings, toast)를 보일러플레이트 없이 관리"
- "persist 미들웨어로 localStorage 자동 동기화 (장바구니)"

---

### Q. "CSS Modules를 왜 사용하나요?"

**A.** **스코프 격리**가 자동으로 되어 스타일 충돌이 원천 차단됩니다.

```
일반 CSS의 문제:
.button { color: red; }    ← 모든 .button에 적용됨 (충돌!)

CSS Modules:
.button → .Navbar_button__a1b2c  ← 자동으로 고유 클래스명 생성
```

**왜 Tailwind 대신 CSS Modules를 선택했나:**
- 순수 CSS만 사용해야 하는 프로젝트 요구사항
- 컴포넌트별로 `.module.css` 파일 분리 → 유지보수 용이
- 추가 의존성(PostCSS 설정, Tailwind 설정) 없음
- CSS 기본기를 직접 사용하므로 학습에도 좋음

---

### Q. "Next.js의 App Router를 쓴 이유는?"

**A.** **API Routes(BFF 프록시)와 SSR/CSR 하이브리드 렌더링**을 한 프레임워크에서 해결하기 위해서입니다.

**App Router의 핵심 활용:**
1. **API Routes** → BFF 프록시 (`/app/api/[...path]/route.ts`)
2. **서버 컴포넌트** → SEO 최적화, 초기 로딩 속도
3. **클라이언트 컴포넌트** (`'use client'`) → 상태 관리, 이벤트 처리
4. **Dynamic Routes** → `/menus/[id]`, `/orders/[paymentId]`

---

### Q. "관리자 매출 분석 차트를 왜 외부 라이브러리 없이 순수 SVG로 구현했나요?"

**A.** 차트 3개 정도의 규모에서는 **Recharts(~400KB)나 Chart.js(~200KB) 같은 무거운 라이브러리 없이도 SVG만으로 충분**하고, 번들 크기를 줄일 수 있기 때문입니다.

| 비교 | 순수 SVG (선택) | Recharts | Chart.js |
|:---|:---|:---|:---|
| **번들 크기** | 0KB (추가 의존성 없음) | ~400KB | ~200KB |
| **커스터마이징** | 완전 자유 | React 래퍼 제약 | Canvas 기반 제약 |
| **학습 가치** | SVG 좌표계 직접 이해 | 라이브러리 API 학습 | 라이브러리 API 학습 |
| **적합 규모** | 차트 3~5개 | 대규모 대시보드 | 대규모 대시보드 |

**구현된 차트 3종:**
1. **📈 일별 매출 추이** — `<path>`로 라인 + 에어리어 차트, `linearGradient`로 그라데이션
2. **🏆 인기 메뉴 TOP 5** — CSS `width` 비율로 수평 바 차트
3. **📊 일별 주문 건수** — `<rect>`로 바 차트

**실제 주문 데이터 기반 동적 렌더링:**
```typescript
// 1. API에서 실제 주문 데이터 조회
const data = await fetchAPI('/admin/orders');

// 2. 기간별 필터링 (7일/30일/전체/커스텀 날짜)
const filteredOrders = validOrders.filter(o => {
    const d = new Date(o.createdAt);
    return d >= cutoff;
});

// 3. 일별 매출 집계 → SVG 좌표로 변환
const points = dailySales.map((d, i) => ({
    x: padding.left + (i / (데이터수 - 1)) * plotWidth,
    y: padding.top + plotHeight - (d.sales / maxSales) * plotHeight,
}));

// 4. SVG path 문자열 생성
const linePath = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
).join(' ');
```

**면접 포인트:**
- "하드코딩된 더미 데이터가 아닌, **실제 주문 DB 데이터를 기반으로 동적 렌더링**"
- "SVG의 좌표계를 직접 계산하여 데이터 시각화의 원리를 이해"
- "차트 라이브러리 없이도 그라데이션, 그리드라인, 반응형 등 구현 가능"
- "viewBox + preserveAspectRatio로 **반응형 차트** 구현"

---

## 🗄️ 백엔드

### Q. "Spring Data JPA를 왜 사용하나요?"

**A.** SQL을 직접 작성하지 않고도 **객체 지향적으로 DB를 조작**할 수 있습니다.

```java
// SQL 직접: SELECT * FROM menus WHERE is_available = true ORDER BY price ASC
// JPA: 메서드 이름만으로 쿼리 자동 생성
List<MenuJpaEntity> findByIsAvailableTrueOrderByPriceAsc();
```

**면접 포인트:**
- "반복적인 CRUD SQL을 제거하여 생산성 향상"
- "엔티티 관계 설정으로 연관된 데이터를 자연스럽게 탐색"
- "auth 모듈에서는 복잡한 쿼리가 필요해서 JdbcMemberRepository(순수 JDBC)도 병행 사용"

---

### Q. "PasswordEncoder에서 DelegatingPasswordEncoder를 쓴 이유는?"

**A.** 비밀번호 해시 알고리즘을 **나중에 변경해도 기존 비밀번호가 깨지지 않기** 위해서입니다.

```java
// SecurityConfig.java
return PasswordEncoderFactories.createDelegatingPasswordEncoder();
// 결과: {bcrypt}$2a$10$xxxx...
// ↑ prefix로 어떤 알고리즘을 썼는지 기록
```

**면접 포인트:**
- "현재 bcrypt 사용, 나중에 argon2로 바꿔도 기존 유저 비밀번호 그대로 검증 가능"
- "보안 표준이 변해도 무중단 마이그레이션 가능"

---

## 🤖 AI 에이전트

### Q. "왜 Gemini 2.5 Flash 모델을 선택했나요?"

**A.** **Thinking(사고형) 모델**이면서도 빠르고 비용 효율적이기 때문입니다.

| 비교 | GPT-4o | Gemini 2.5 Flash |
|:---|:---|:---|
| **사고 과정** | 내부 추론만 | Thinking 과정 투명하게 제공 |
| **Function Calling** | 지원 | AFC(자동 도구 호출) 지원 |
| **비용** | 높음 | 상대적으로 저렴 |
| **속도** | 보통 | 빠름 (Flash 계열) |

**실제 코드 (gemini.py):**
```python
# Thinking 모델 전용 API 버전 사용
async_client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options={'api_version': 'v1alpha'}
)
model_name = "gemini-2.5-flash"

# AFC로 도구 호출을 자동 처리
config = types.GenerateContentConfig(
    tools=config["tools"],  # Python 함수를 직접 도구로 등록
    automatic_function_calling=types.AutomaticFunctionCallingConfig(),
    system_instruction=system_instruction,
)
```

**면접 포인트:**
- "AFC(Automatic Function Calling)로 SDK가 도구 호출~결과 반환~최종 응답 생성을 자동 처리"
- "Thinking 모델 특성상 빈 응답이 발생할 수 있어, 재시도 + 텍스트 패턴 fallback 등 안정성 보강 구현"
- "역할별(GUEST/USER/ADMIN) 도구 세트와 시스템 프롬프트를 동적으로 구성"

---

### Q. "RAG(Retrieval Augmented Generation)를 왜 사용하나요?"

**A.** LLM이 **학습하지 않은 우리 카페만의 정보**를 정확히 답변하게 하기 위해서입니다.

```
LLM만 사용할 때의 문제:
사용자: "알레르기 정보 알려줘"
LLM: "일반적으로 카페에서는..." ← 우리 카페의 정보가 아님!

RAG 적용 후:
1. 사용자 질문 → 텍스트 임베딩 (multilingual-e5-small)
2. 벡터 DB에서 유사한 문서 검색 (pgvector, 코사인 유사도)
3. 검색된 문서 + 사용자 질문 → LLM에 전달
4. LLM이 "우리 카페" 기준으로 정확한 답변 생성
```

**면접 포인트:**
- "RAG로 LLM의 할루시네이션(없는 정보 지어내기) 방지"
- "관리자가 RAG 문서를 직접 CRUD할 수 있어 AI 지식을 실시간 업데이트 가능"

---

### Q. "임베딩 모델로 왜 multilingual-e5-small을 선택했나요?"

**A.** **한국어를 포함한 다국어 지원**이 되면서도 **경량(384차원)** 이라 서버 부담이 적기 때문입니다.

| 비교 | multilingual-e5-small | OpenAI text-embedding-3 | Gemini text-embedding-004 |
|:---|:---|:---|:---|
| **출처** | Microsoft (오픈소스) | OpenAI (유료 API) | Google (유료 API) |
| **벡터 차원** | 384 | 1536 | 768 |
| **실행 방식** | 로컬 (sentence-transformers) | API 호출 | API 호출 |
| **비용** | 무료 (로컬 실행) | API 과금 | API 과금 |
| **한국어 성능** | 우수 | 우수 | 우수 |
| **의존성** | PyTorch + transformers 필요 | 없음 (API) | 없음 (API) |

**실제 코드 (embedding.py):**
```python
from sentence_transformers import SentenceTransformer

# 로컬에서 직접 실행 → API 비용 없음
model = SentenceTransformer("intfloat/multilingual-e5-small")

# e5 모델의 접두사 규칙 (성능 최적화)
def get_embedding(text: str) -> list[float]:
    processed_text = f"passage: {text}"      # 저장 시: "passage: 문서내용"
    return model.encode(processed_text).tolist()

# 검색 시에는 다른 접두사 사용
processed_query = f"query: {query}"          # 검색 시: "query: 사용자질문"
embedding = model.encode(processed_query).tolist()
```

**면접 포인트:**
- "API 비용 없이 오프라인으로 임베딩 생성 가능 → 운영 비용 절감"
- "e5 모델은 `passage:`/`query:` 접두사로 저장/검색 임베딩을 구분하여 검색 정확도 향상"
- "384차원으로 경량이라 Docker 컨테이너에서도 빠르게 실행"
- "sentence-transformers 라이브러리가 Hugging Face 모델 로딩을 추상화하여 코드가 단순"

---

### Q. "벡터 저장소로 왜 pgvector를 선택했나요?"

**A.** 이미 사용 중인 **PostgreSQL에 확장만 추가**하면 되어 별도 인프라 없이 벡터 검색이 가능합니다.

| 비교 | pgvector (선택) | Pinecone | Weaviate | ChromaDB |
|:---|:---|:---|:---|:---|
| **형태** | PostgreSQL 확장 | 관리형 SaaS | 자체 서버 필요 | 인메모리/로컬 |
| **추가 인프라** | 없음 (기존 DB 활용) | 외부 서비스 | Docker 컨테이너 추가 | 별도 프로세스 |
| **비용** | 무료 | 유료 | 무료 (셀프호스팅) | 무료 |
| **SQL과 통합** | 네이티브 (JOIN 가능) | 불가 | 불가 | 불가 |
| **적합 규모** | 수천~수만 건 | 수백만 건 | 수백만 건 | 프로토타입 |

**실제 코드 (vector_db.py):**
```python
# pgvector 확장 활성화 (한 줄이면 끝!)
cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")

# 벡터 컬럼이 있는 테이블 생성
cur.execute("""
    CREATE TABLE IF NOT EXISTS rag_documents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        embedding VECTOR(384),    -- pgvector 타입 (384차원)
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
""")

# 코사인 거리 기반 유사도 검색 (<=> 연산자)
cur.execute(
    "SELECT id, title, content FROM rag_documents "
    "ORDER BY embedding <=> %s::vector LIMIT %s;",
    (str(embedding), limit)
)
```

**면접 포인트:**
- "별도의 벡터 DB 서비스를 추가하지 않아 **Docker Compose 구성이 단순**하게 유지"
- "RAG 문서와 다른 비즈니스 데이터가 같은 DB에 있어 **JOIN으로 복합 쿼리 가능**"
- "카페 RAG 문서 수백 건 규모에서는 pgvector의 성능이 충분"
- "`<=>` 연산자 = 코사인 거리, `<->` = L2 거리, `<#>` = 내적 (용도별 선택 가능)"

---

### Q. "Gemini의 Function Calling을 왜 사용하나요?"

**A.** AI가 **단순 대화를 넘어 실제 시스템 기능(주문, 장바구니 등)을 조작**할 수 있게 하기 위해서입니다.

```
일반 챗봇:
사용자: "아메리카노 담아줘"
챗봇: "장바구니에 담으시려면 메뉴 페이지에서..." ← 그냥 안내만

Function Calling:
사용자: "아메리카노 담아줘"
AI → get_menus() 호출 → 아메리카노 확인 → add_to_cart() 호출
챗봇: "아메리카노를 장바구니에 담았다덕! 🛒" ← 실제로 담김!
```

**제공하는 Function Tools:**
| Tool | 용도 |
|:---|:---|
| `get_menus` | 메뉴 정보 조회 (가격, 옵션, 이미지) |
| `get_categories` | 카테고리 목록 |
| `get_shop_info` | 매장 설정 실시간 조회 |
| `add_to_cart` | 장바구니에 메뉴 추가 |
| `navigate_page` | 페이지 이동 명령 |
| `search_knowledge_base` | RAG 지식 검색 |

---

## 📡 실시간 통신

### Q. "SSE(Server-Sent Events)를 왜 WebSocket 대신 사용했나요?"

**A.** 이 프로젝트에서는 **서버 → 클라이언트 단방향 알림만 필요**하기 때문입니다.

| 비교 | SSE | WebSocket |
|:---|:---|:---|
| **통신 방향** | 서버 → 클라이언트 (단방향) | 양방향 |
| **프로토콜** | HTTP (기존 인프라 그대로) | ws:// (별도 프로토콜) |
| **자동 재연결** | 브라우저가 자동 지원 | 직접 구현 필요 |
| **구현 복잡도** | 낮음 | 높음 |
| **적합한 경우** | 알림, 실시간 피드 | 채팅, 게임 |

**사용 위치:**
1. **관리자 주문 알림** — 신규 주문 시 실시간 알림
2. **AI 챗봇 스트리밍** — 답변이 토큰 단위로 실시간 출력

**BFF SSE 프록시 (sse/[...path]/route.ts):**
```typescript
// TransformStream으로 백엔드 SSE 이벤트를 클라이언트에 실시간 중계
const { readable, writable } = new TransformStream();
const writer = writable.getWriter();
const reader = response.body.getReader();

// 비동기 스트리밍: 백엔드에서 받은 데이터를 즉시 클라이언트로 전달
while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    await writer.write(value);
}
```

---

## 🐳 인프라

### Q. "Docker Compose를 왜 사용하나요?"

**A.** 4개 서비스(Backend, Frontend, AI, DB)를 **하나의 명령어**로 일괄 관리하기 위해서입니다.

```bash
docker compose --profile with-db up -d
# → 4개 컨테이너가 동시에 올라감, 네트워크 자동 구성
```

**profile 활용:**
```yaml
db:
    profiles: [ "with-db" ]  # --profile with-db를 줄 때만 DB 컨테이너 실행
```
- 로컬: 외부 DB 사용 시 DB 컨테이너 제외 가능
- 배포: `--profile with-db`로 DB 포함 실행

---

### Q. "GitHub Actions CI/CD를 왜 사용하나요?"

**A.** 코드를 push하면 **빌드 → Docker 이미지 생성 → 서버 배포**가 자동으로 이루어져 수동 배포 실수를 방지합니다.

---

## 🗃️ 상태 관리 전략

### Q. "장바구니 데이터를 로컬/서버 이중 관리하는 이유는?"

**A.** **비회원도 장바구니를 사용**할 수 있고, **로그인 시 자동 동기화**되게 하기 위해서입니다.

```
비회원:
localStorage에 저장 (Zustand persist) → 서버 불필요

회원:
localStorage + DB 동시 저장 → 다른 기기에서도 장바구니 유지

로그인 시 동기화 흐름:
1. 비회원 상태에서 장바구니에 담음 (localStorage)
2. 로그인
3. localStorage 아이템을 서버로 bulk 전송
4. 서버 데이터 + 로컬 데이터 합침
5. 최종 결과를 localStorage에 반영
```

**실제 코드 (cartStore.ts):**
```typescript
syncWithServer: async (isLoginAction?: boolean) => {
    if (isLoginAction) {
        const localItems = [...get().items];
        if (localItems.length > 0) {
            // 로컬 아이템을 서버로 일괄 업로드
            await fetch('/api/cart/items/bulk', {
                method: 'POST',
                body: JSON.stringify(localItems.map(item => ({ 
                    menuId: item.menuId, quantity: item.quantity, options: item.options 
                }))),
            });
        }
    }
};
```

---

## 🔄 추가 설계 패턴

### Q. "Catch-All API Route ([...path])를 왜 사용하나요?"

**A.** 모든 API에 대해 **하나의 프록시 파일**로 처리하여 코드 중복을 제거하기 위해서입니다.

```
만약 API별로 파일을 만들면:
/api/menus/route.ts      → 프록시 코드
/api/cart/route.ts       → 프록시 코드 (거의 동일)
/api/orders/route.ts     → 프록시 코드 (거의 동일)
... 수십 개 파일

Catch-All 방식:
/api/[...path]/route.ts  → 이 하나로 전부 처리!
```

**단, 특수 처리가 필요한 경우는 전용 파일 사용:**
- `/api/auth/login/route.ts` — JWT → iron-session 저장 로직
- `/api/sse/[...path]/route.ts` — SSE 스트리밍 프록시
- `/api/agent/chat/route.ts` — AI 서버 프록시

---

### Q. "hop-by-hop 헤더를 왜 필터링하나요?"

**A.** 브라우저 ↔ Next.js 사이의 연결 설정 헤더를 그대로 백엔드로 넘기면 **에러가 발생**하기 때문입니다.

```typescript
const skipHeaders = [
    'host',              // 백엔드 서버의 host로 재설정되어야 함
    'cookie',            // 세션 쿠키 대신 JWT만 전달
    'connection',        // Node.js fetch에서 'invalid connection header' 에러 유발
    'content-length',    // body 크기가 변할 수 있으므로 fetch가 재설정
];
```

**면접 포인트:**
- "HTTP 스펙에서 hop-by-hop 헤더는 중간 프록시를 통과하면 안 되도록 정의"
- "실제로 `connection` 헤더를 넘기면 Node.js `fetch`가 에러를 던짐"
- "이 문제를 디버깅하면서 HTTP 프로토콜의 계층 구조를 깊이 이해하게 됨"
