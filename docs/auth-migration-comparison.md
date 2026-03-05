# 🔄 인증 방식 마이그레이션 비교

> 고라파덕 카페 프로젝트의 인증 방식 변경 과정을 정리한 문서입니다.
> 세션 기반 → JWT 쿠키 → BFF 패턴으로 발전해온 과정을 비교합니다.

---

## 전체 발전 과정

```
1단계: 세션 기반 (Spring Security 기본)
  └→ JSESSIONID 쿠키로 서버 세션 유지

2단계: JWT 쿠키 방식
  └→ Stateless 서버 + JWT를 HttpOnly 쿠키에 저장

3단계: BFF 패턴 (현재) ★
  └→ JWT를 Next.js 서버가 암호화 보관 + 브라우저는 JWT를 모름
```

---

## 아키텍처 비교

### 1단계: 세션 기반

```
브라우저 ──(JSESSIONID 쿠키)──→ Spring Boot
                                 ↕ 서버 메모리에 세션 저장
```

- 서버가 상태(세션)를 갖고 있음
- 서버 확장(Scale-out) 어려움

### 2단계: JWT 쿠키 방식

```
브라우저 ──(jwt 쿠키)──→ Next.js rewrite ──(jwt 쿠키)──→ Spring Boot
                         경로만 바꿔주는 역할
```

- Stateless (서버에 상태 없음)
- JWT가 브라우저 쿠키에 존재 (HttpOnly로 JS 접근은 불가)

### 3단계: BFF 패턴 (현재)

```
브라우저 ──(app_session 암호화 쿠키)──→ Next.js API Route ──(Authorization: Bearer JWT)──→ Spring Boot
                                        JWT를 꺼내서 헤더에 주입
```

- JWT가 브라우저에 아예 없음
- Next.js 서버가 JWT를 암호화하여 보관

---

## 항목별 상세 비교

### 인증 토큰 관리

| 항목 | 세션 기반 | JWT 쿠키 | BFF (현재) |
|------|----------|---------|-----------|
| **토큰 저장 위치** | 서버 메모리 | 브라우저 쿠키 | Next.js 서버 (iron-session) |
| **브라우저가 토큰을 아는지** | ❌ 세션ID만 앎 | ⚠️ HttpOnly라 읽진 못하지만 쿠키에 존재 | ✅ **전혀 모름** |
| **서버 상태** | Stateful (세션 저장) | Stateless | Stateless |
| **서버 확장성** | ❌ 나쁨 | ✅ 좋음 | ✅ 좋음 |

### 보안 비교

| 공격 유형 | 세션 기반 | JWT 쿠키 | BFF (현재) |
|----------|----------|---------|-----------|
| **XSS (스크립트 주입)** | ✅ 세션ID만 있어 영향 적음 | ✅ HttpOnly로 방어 | ✅✅ JWT 자체가 없어 완벽 방어 |
| **CSRF (위조 요청)** | ⚠️ 취약 (쿠키 자동 전송) | ⚠️ SameSite로 방어 | ✅✅ JWT가 쿠키에 없으니 CSRF 불가능 |
| **토큰 탈취** | ⚠️ 세션 하이재킹 가능 | ⚠️ 쿠키 탈취 시 위험 | ✅ 암호화된 세션이라 복호화 불가 |
| **토큰 위변조** | ✅ 서버만 세션 관리 | ✅ 서명으로 방어 | ✅ 서명 + 암호화 이중 방어 |

### 프록시 방식 비교

| 항목 | JWT 쿠키 방식 | BFF 방식 (현재) |
|------|-------------|----------------|
| **프록시** | `next.config.ts` rewrite | `app/api/[...path]/route.ts` |
| **역할** | URL 경로만 변환 | JWT를 꺼내서 Authorization 헤더 주입 |
| **코드량** | rewrite 설정 3줄 | API Route 파일 약 80줄 |
| **기능** | 단순 프록시 | JWT 주입 + 401 감지 + 세션 삭제 |

---

## 로그인 흐름 비교

### JWT 쿠키 방식 (이전)

```
1. 브라우저 → POST /api/v1/auth/login
2. Next.js rewrite → Spring Boot /v1/auth/login
3. Spring Boot → Set-Cookie: jwt=eyJ... (브라우저에 직접)
4. 브라우저에 jwt 쿠키 저장됨
5. 이후 요청마다 jwt 쿠키 자동 전송
```

### BFF 방식 (현재)

```
1. 브라우저 → POST /api/auth/login
2. Next.js API Route → Spring Boot /v1/auth/login (서버 간 통신)
3. Spring Boot → { "token": "eyJ..." } (JSON으로 Next.js에만 전달)
4. Next.js → iron-session으로 JWT 암호화 → app_session 쿠키 생성
5. 브라우저는 app_session만 받음 (JWT가 뭔지 모름!)
6. 이후 요청: app_session 전송 → Next.js가 JWT 꺼냄 → Bearer 헤더로 Spring Boot에 전달
```

---

## API 요청 흐름 비교

### JWT 쿠키 방식 (이전)

```
브라우저: fetch('/api/menus')
  → Next.js rewrite: /api/menus → http://localhost:8032/menus
  → Spring Boot: 쿠키에서 jwt 추출 → 인증 처리
  → 응답 반환
```

### BFF 방식 (현재)

```
브라우저: fetch('/api/menus')
  → Next.js API Route: app/api/[...path]/route.ts 실행
  → 세션 쿠키에서 JWT 꺼냄
  → fetch('http://localhost:8032/menus', { headers: { Authorization: 'Bearer eyJ...' } })
  → Spring Boot: Authorization 헤더에서 JWT 추출 → 인증 처리
  → 응답 반환
```

---

## 파일 변경 요약

### 새로 추가된 파일 (BFF 전용)

| 파일 | 역할 |
|------|------|
| `frontend/.env` | SESSION_SECRET, API_BASE_URL 등 환경변수 |
| `frontend/app/lib/session.ts` | iron-session 설정 (쿠키 암호화) |
| `frontend/app/lib/api.ts` | 클라이언트 fetch 유틸리티 (authAPI) |
| `frontend/app/api/auth/login/route.ts` | BFF 로그인 (JWT → 암호화 세션) |
| `frontend/app/api/auth/logout/route.ts` | BFF 로그아웃 (세션 삭제) |
| `frontend/app/api/auth/session/route.ts` | 세션 조회 (현재 사용자 정보) |
| `frontend/app/api/auth/signup/route.ts` | 회원가입 프록시 |
| `frontend/app/api/[...path]/route.ts` | Catch-All 프록시 (JWT 자동 주입) |

### 변경된 파일

| 파일 | 변경 내용 |
|------|----------|
| `next.config.ts` | `/api/*` rewrite 제거, `/images/*`만 유지 |
| `middleware.ts` | 백엔드 직접 확인 → 세션 쿠키 존재 여부만 확인 |
| `authStore.ts` | fetch 직접 호출 → authAPI 유틸리티 사용 |
| `login/page.tsx` | redirect 파라미터 지원 추가 |
| `Navbar.tsx` | user.username → user.nickname, 이벤트 리스너 추가 |
| `AuthController.java` | JWT를 쿠키 → JSON body로 응답 |
| `JwtAuthFilter.java` | 쿠키에서 추출 → Authorization 헤더에서 추출 |

### 더 이상 사용하지 않는 기능

| 항목 | 설명 |
|------|------|
| `jwt` 쿠키 | Spring Boot가 더 이상 JWT 쿠키를 발급하지 않음 |
| `jwt_refresh` 쿠키 | BFF에서는 iron-session이 세션 만료를 관리 |
| `ResponseCookie` + `SameSite` | 쿠키 기반 방어 불필요 (JWT가 쿠키에 없음) |

---

## 한 줄 요약

| 방식 | 핵심 |
|------|------|
| **세션 기반** | 서버가 상태를 기억 (JSESSIONID) |
| **JWT 쿠키** | 서버는 Stateless, 브라우저가 JWT를 쿠키로 보관 |
| **BFF** | 서버는 Stateless, **Next.js가 JWT를 암호화 보관**, 브라우저는 JWT를 모름 |

> **현재 구현:** 가장 안전한 BFF 패턴 ✅  
> 브라우저는 JWT를 절대 볼 수 없고, 모든 API 호출 시 Next.js 서버가 JWT를 대신 주입합니다.
