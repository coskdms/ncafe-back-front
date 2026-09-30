# 🐤 고라파덕 카페 (NCafe)

> 포켓몬 테마 온라인 카페 주문 시스템 — AI 에이전트, 실시간 주문 관리, 포인트 시스템을 갖춘 풀스택 웹 애플리케이션
> mesilver.co.kr

---

## 📌 프로젝트 개요

**고라파덕 카페**는 카페 운영에 필요한 모든 기능을 포함한 풀스택 웹 애플리케이션입니다.  
사용자는 메뉴 조회, 장바구니, 결제, 포인트 적립 등을 이용할 수 있고, 관리자는 메뉴/주문/매출 관리를 할 수 있습니다.  
AI 챗봇 에이전트(버미나이덕 🐤)가 고객 응대, 메뉴 추천, 주문 등을 자동화합니다.

---

## 🏗️ 아키텍처

### 헥사고날 아키텍처 (Hexagonal Architecture)

백엔드는 **헥사고날(포트/어댑터) 아키텍처**를 따릅니다.

```
핵심 개념:
┌─────────────────────────────────────────────┐
│  외부 세계와의 연결을 "포트(Port)"와          │
│  "어댑터(Adapter)"로 분리하여,               │
│  비즈니스 로직(도메인)을 독립적으로 유지합니다.  │
└─────────────────────────────────────────────┘
```

**도메인별 패키지 구조:**
```
도메인/
├── adapter/
│   ├── in/web/              ← Controller (외부 요청 수신)
│   │   └── dto/             ← Request/Response DTO
│   └── out/persistence/     ← DB 연동 구현체
│       ├── entity/          ← JPA 엔티티
│       └── repository/      ← JPA Repository
├── application/
│   ├── port/
│   │   ├── in/              ← UseCase 인터페이스 (비즈니스 규칙)
│   │   └── out/             ← Repository 인터페이스 (DB 추상화)
│   └── service/             ← UseCase 구현체
└── domain/                  ← 핵심 도메인 객체
```

> **장점:** 비즈니스 로직이 DB, 프레임워크에 의존하지 않아 테스트/유지보수가 용이합니다.

### BFF (Backend for Frontend) 패턴

프론트엔드(Next.js)와 백엔드(Spring Boot) 사이에 **BFF 계층**을 두어,  
프론트엔드가 백엔드에 직접 접근하지 않습니다.

```
┌──────────┐    ┌─────────────────────┐    ┌─────────────┐
│  브라우저  │───▶│  Next.js API Route  │───▶│  Spring Boot │
│ (Client)  │    │   (BFF 프록시)       │    │  (Backend)   │
└──────────┘    └─────────────────────┘    └─────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Beomini Server  │
                │  (AI Agent)      │
                └─────────────────┘
```

> **장점:** 인증 토큰 관리가 서버 측에서 이루어지고, 백엔드 URL이 클라이언트에 노출되지 않아 보안이 강화됩니다.

---

## 🛠️ 기술 스택

### Backend (Spring Boot)
| 기술 | 버전 | 용도 |
|:---|:---|:---|
| **Java** | 21 | 메인 언어 |
| **Spring Boot** | 4.0.1 | 웹 프레임워크 |
| **Spring Security** | - | 인증/인가 (JWT 기반) |
| **Spring Data JPA** | - | ORM, DB 접근 |
| **PostgreSQL** | 42.7.9 | 관계형 데이터베이스 |
| **JWT (jjwt)** | 0.12.6 | JSON Web Token 인증 |
| **Lombok** | - | 보일러플레이트 코드 제거 |
| **Jackson** | 2.18.2 | JSON 직렬화/역직렬화 |

### Frontend (Next.js)
| 기술 | 버전 | 용도 |
|:---|:---|:---|
| **Next.js** | 16.1.6 | React 프레임워크 (SSR, API Routes) |
| **React** | 19.2.4 | UI 라이브러리 |
| **TypeScript** | 5.x | 타입 안전성 |
| **Zustand** | 5.0.11 | 전역 상태 관리 (auth, cart, favorites 등) |
| **CSS Modules** | - | 컴포넌트 스코프 스타일링 |
| **iron-session** | 8.0.4 | 서버 측 세션 관리 (BFF 인증) |
| **Lucide React** | 0.563.0 | 아이콘 라이브러리 |
| **react-hot-toast** | 2.6.0 | 토스트 알림 |
| **dnd-kit** | 6.x | 드래그 앤 드롭 (메뉴 이미지 정렬) |
| **date-fns** | 4.1.0 | 날짜 포맷팅 |
| **react-hook-form** | 7.71.1 | 폼 상태 관리 |

### AI Agent Server (Beomini)
| 기술 | 용도 |
|:---|:---|
| **FastAPI** | Python 웹 프레임워크 (비동기 지원) |
| **Google Gemini 2.5 Flash** | LLM 기반 AI 대화 (Function Calling, AFC) |
| **Sentence Transformers (multilingual-e5-small)** | 다국어 텍스트 임베딩 (384차원) |
| **PostgreSQL + pgvector** | 벡터 DB (RAG 지식 코사인 유사도 검색) |
| **SSE (Server-Sent Events)** | 실시간 스트리밍 응답 (sse-starlette) |

### 인프라
| 기술 | 용도 |
|:---|:---|
| **Docker Compose** | 멀티 컨테이너 오케스트레이션 (4개 서비스) |
| **GitHub Actions** | CI/CD 자동 배포 (Self-Hosted Runner) |
| **pgvector/pgvector:pg17** | PostgreSQL 17 + pgvector 확장 이미지 |

---

## 📁 프로젝트 폴더 구조

```
ncafe-back/
├── backend/                          ← Spring Boot (Java 21)
│   └── src/main/java/.../backend/
│       ├── admin/                    ← 관리자 도메인
│       │   ├── category/             ←   카테고리 CRUD
│       │   ├── dashboard/            ←   대시보드 통계
│       │   ├── menu/                 ←   메뉴 CRUD
│       │   ├── notification/         ←   SSE 실시간 알림
│       │   └── setting/              ←   매장 설정
│       ├── auth/                     ← 인증/회원 도메인
│       ├── cart/                     ← 장바구니 도메인
│       ├── config/                   ← Security, JWT, CORS 설정
│       ├── favorite/                 ← 찜(즐겨찾기) 도메인
│       ├── init/                     ← DB 초기화 (DataInitializer)
│       ├── menu/                     ← 사용자용 메뉴 조회 도메인
│       ├── order/                    ← 주문/결제 도메인
│       └── public_api/               ← 공개 API (비인증)
│           └── setting/              ←   공개 매장 정보
│
├── frontend/                         ← Next.js (React 19)
│   ├── app/
│   │   ├── admin/                    ← 관리자 페이지
│   │   │   ├── analytics/            ←   매출 분석
│   │   │   ├── categories/           ←   카테고리 관리
│   │   │   ├── menus/                ←   메뉴 관리
│   │   │   ├── orders/               ←   주문 관리
│   │   │   ├── rag/                  ←   RAG 지식 관리
│   │   │   └── settings/             ←   매장 설정
│   │   ├── api/                      ← BFF API Routes (프록시)
│   │   │   ├── auth/                 ←   인증 관련 프록시
│   │   │   ├── agent/                ←   AI 에이전트 프록시
│   │   │   ├── sse/                  ←   SSE 프록시
│   │   │   └── [...path]/            ←   범용 API 프록시
│   │   ├── cart/                     ← 장바구니 페이지
│   │   ├── checkout/                 ← 결제 페이지
│   │   ├── login/                    ← 로그인/회원가입/계정찾기
│   │   ├── menus/                    ← 메뉴 목록/상세
│   │   ├── mypage/                   ← 마이페이지
│   │   └── orders/                   ← 주문 내역
│   ├── components/
│   │   ├── common/                   ← 공통 컴포넌트 (Toast, Modal 등)
│   │   │   └── AgentChat/            ←   AI 챗봇 UI
│   │   └── landing/                  ← 랜딩 페이지 컴포넌트
│   ├── stores/                       ← Zustand 상태 관리
│   └── utils/                        ← 유틸리티 함수
│
├── beomini-server/                   ← Python FastAPI (AI Agent)
│   └── app/
│       ├── routers/                  ← API 라우터 (chat, rag)
│       ├── services/                 ← 핵심 서비스
│       │   ├── gemini.py             ←   Gemini AI (Function Calling)
│       │   ├── backend_api.py        ←   백엔드 API 호출
│       │   ├── rag_tool.py           ←   RAG 검색 도구
│       │   ├── embedding.py          ←   텍스트 임베딩
│       │   └── vector_db.py          ←   벡터 DB 연동
│       └── models/                   ← Pydantic 스키마
│
├── docs/                             ← 프로젝트 문서
├── docker-compose.yml                ← Docker 구성
└── .github/workflows/deploy.yml      ← CI/CD
```

---

## ✨ 구현된 기능

### 👤 사용자 기능

| 기능 | 설명 |
|:---|:---|
| **회원가입/로그인** | 닉네임 + 비밀번호 + 전화번호 + 보안질문 |
| **카카오 소셜 로그인** | OAuth 2.0 기반 |
| **아이디 찾기** | 전화번호로 마스킹된 아이디 조회 |
| **비밀번호 찾기** | 전화번호 인증 → 보안질문 → 비밀번호 재설정 (3단계) |
| **메뉴 조회** | 카테고리별 필터, 검색 |
| **메뉴 상세** | 이미지 갤러리, 옵션 선택, 찜하기 |
| **장바구니** | 추가/수량 변경/삭제, 옵션별 분리 관리 |
| **결제** | PortOne 연동 (카드/카카오페이), 매장/포장/배송 선택 |
| **주문 내역** | 주문 상태 실시간 확인, 주문 취소 |
| **포인트/등급 시스템** | 주문 시 포인트 적립, 등급별 할인 |
| **찜(즐겨찾기)** | 메뉴 찜하기/해제, 찜 목록 관리 |
| **마이페이지** | 개인정보 수정, 주소 관리 (카카오 주소 검색) |
| **AI 챗봇 (비오미니 🐤)** | 메뉴 추천, 주문 대행, 매장 안내, 페이지 이동 |

### 👑 관리자 기능

| 기능 | 설명 |
|:---|:---|
| **대시보드** | 오늘 주문 수, 매출, 메뉴 수, 품절 현황 |
| **메뉴 관리** | 메뉴 CRUD, 이미지 업로드/정렬, 옵션 그룹 관리 |
| **카테고리 관리** | 카테고리 CRUD, 순서 변경 |
| **주문 관리** | 전체 주문 조회, 상태 변경 (대기→준비중→완료) |
| **매출 분석** | 일별/기간별 매출 추이 차트, 주문 건수 분석 |
| **매장 설정** | 카페명, 전화번호, 영업시간, 배달비, 공지사항 설정 |
| **RAG 지식 관리** | AI 에이전트 지식 베이스 문서 CRUD |
| **실시간 알림** | SSE 기반 신규 주문 실시간 알림 |

### 🤖 AI 에이전트 기능

| 기능 | 설명 |
|:---|:---|
| **대화형 메뉴 추천** | "추천해줘" → 개인화 추천 (주문이력/찜 목록 기반) |
| **메뉴 카드 렌더링** | 대화 중 메뉴 정보를 카드 형태로 표시 |
| **장바구니 추가** | "아메리카노 담아줘" → 자동 장바구니 담기 |
| **바로 주문** | "이거 바로 결제해줘" → 즉시 결제 페이지 이동 |
| **페이지 이동** | "메뉴 보여줘" → 자동 페이지 네비게이션 |
| **매장 정보 안내** | "언제 문 열어?" → 실시간 설정 조회 |
| **RAG 지식 검색** | 카페 이용 안내, FAQ 등 벡터 검색 |
| **역할별 응답** | 비회원/회원/관리자별 다른 기능 제공 |
| **다국어 대응** | 한/영/일/중 → 해당 언어로 응답 |
| **실시간 스트리밍** | SSE 기반 타이핑 효과 |

### 🎨 UI/UX

| 기능 | 설명 |
|:---|:---|
| **반응형 디자인** | 모바일/태블릿/데스크톱 대응 |
| **커피 테마 디자인** | 따뜻한 갈색 계열 + 골드 포인트 |
| **폼 유효성 검사** | 미입력 필드 → 자동 스크롤 + 흔들림 애니메이션 |
| **토스트 알림** | 성공/경고/에러 상태별 알림 |
| **랜딩 페이지** | Hero 섹션, 카페 소개, 특징, 매장 안내 |

---

## 🚀 실행 방법

### Docker Compose (배포/로컬 통합)
```bash
# 환경 변수 설정
cp .env.example .env
# .env 파일 편집 (DB_PASSWORD, JWT_SECRET, GEMINI_API_KEY 등)

# 전체 서비스 실행 (DB 포함)
docker compose --profile with-db up -d --build
```

### 개발 모드 (로컬)
```bash
# 백엔드
./gradlew :backend:bootRun

# 프론트엔드
cd frontend && npm install && npm run dev

# AI 에이전트
cd beomini-server && pip install -r requirements.txt && python3 -m uvicorn app.main:app --reload
```

로컬(`dev` 프로필)로 백엔드를 실행하면 `application-dev.properties`의 기본값에 따라
`localhost:5332`의 PostgreSQL에 접속을 시도합니다. `db` 서비스는 기본적으로 컨테이너
외부(호스트)로 포트를 노출하지 않으므로(`docker-compose.yml` 참고), 로컬 실행 시에는
포트를 노출해주는 override 파일이 별도로 필요합니다.

**로컬 DB 접속 설정 (최초 1회)**

프로젝트 루트에 `docker-compose.override.yml`을 생성합니다 (git에 커밋되지 않는
개발자별 로컬 설정 파일입니다):

```yaml
# docker-compose.override.yml
services:
  db:
    ports:
      - "5332:5432"
```

DB 컨테이너를 (재)기동합니다:
```bash
docker compose --profile with-db up -d db
```

이후 `./gradlew :backend:bootRun`으로 로컬 백엔드를 실행하면 `localhost:5332`로
정상 접속됩니다. `Connection to localhost:5332 refused` 에러가 발생한다면 위 override
파일이 없거나 `db` 컨테이너가 내려가 있는 경우이니, `docker compose ps`로 `db`
컨테이너 상태와 포트 매핑(`0.0.0.0:5332->5432/tcp`)을 먼저 확인하세요.

---

## 🐳 Docker 서비스 구성

| 서비스 | 컨테이너 | 설명 |
|:---|:---|:---|
| `backend` | ncafe-backend | Spring Boot API 서버 |
| `frontend` | ncafe-frontend | Next.js 웹 서버 (3000포트) |
| `beomini` | beomini-server | AI Agent 서버 (FastAPI) |
| `db` | ncafe-db | PostgreSQL 데이터베이스 |

---

## 📋 환경 변수

| 변수 | 설명 |
|:---|:---|
| `DB_PASSWORD` | PostgreSQL 비밀번호 |
| `JWT_SECRET` | JWT 토큰 서명 키 |
| `GEMINI_API_KEY` | Google Gemini API 키 |
| `PORTONE_API_SECRET` | PortOne 결제 API 시크릿 |
| `KAKAO_CLIENT_ID` | 카카오 OAuth 클라이언트 ID |
| `KAKAO_CLIENT_SECRET` | 카카오 OAuth 시크릿 |

---

## 👥 역할 기반 접근 제어

| 역할 | 접근 가능 기능 |
|:---|:---|
| **GUEST** (비회원) | 메뉴 조회, 장바구니, 결제, AI 챗봇 (제한) |
| **MEMBER** (회원) | 전체 사용자 기능 + 포인트/등급, 주문 내역, 찜 |
| **ADMIN** (관리자) | 전체 기능 + 관리자 대시보드/설정/메뉴 관리 |