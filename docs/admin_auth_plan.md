# 관리자 권한 및 인증 구현 플랜 (Admin Authentication & Authorization Plan)

본 문서는 `/admin/**` 경로에 대한 관리자 전용 인증(Authentication) 및 인가(Authorization)를 구현하기 위한 전체적인 계획을 담고 있습니다.

## 1. 목표 (Objectives)
- **보안 강화**: `/admin/**` 하위의 모든 페이지 및 API는 관리자 권한을 가진 사용자만 접근 가능하도록 보호합니다.
- **로그인 페이지 구현**: 관리자가 시스템에 접근하기 위한 전용 로그인 페이지를 구성합니다.
- **권한 제어 및 처리**: 비인가 사용자 또는 로그인하지 않은 사용자가 `/admin/**` 경로에 접근할 경우, 로그인 페이지로 리다이렉트되거나 권한 없음(403 Forbidden) 페이지를 표시합니다.

---

## 2. 보안 아키텍처 (Security Architecture)
인증 방식은 확장성과 프론트엔드-백엔드 분리 구조(SPA/Next.js + Spring Boot)를 고려하여 **JWT (JSON Web Token)** 기반의 인증을 사용합니다.

### 2.1 Backend (Spring Boot)
- **Spring Security 적용**: `SecurityFilterChain`을 설정하여 `/api/v1/admin/**` 경로에 대해 `hasRole('ADMIN')` 권한 요구.
- **User 및 Role 엔티티 구성**: `Member` 또는 `Admin` 엔티티에 Role(권한) 필드(예: `ROLE_ADMIN`, `ROLE_USER`)를 추가.
- **JWT 발급 및 검증**:
  - 로그인 성공 시 Access Token (및 Refresh Token) 발급.
  - 매 요청 시 헤더(Authorization: Bearer [Token])에서 토큰을 추출하고 검증하는 커스텀 필터(`JwtAuthenticationFilter`) 구현.
- **API 엔드포인트 마련**:
  - `POST /api/v1/auth/login` : 아이디/비밀번호 검증 후 JWT 반환.
  - `GET /api/v1/auth/me` : 현재 토큰 기반으로 접속자의 정보 및 권한 반환.

### 2.2 Frontend (Next.js)
- **Next.js Middleware 적용**: `middleware.ts`를 활용하여 클라이언트 라우팅 단계에서 `/admin/:path*`로의 접근을 인터셉트 함. 쿠키 또는 로컬스토리지에 인증 토큰이 없으면 로그인 페이지로 리다이렉트.
- **상태 관리 (Zustand 등)**: 현재 로그인된 관리자의 상태(정보 및 권한)를 전역 상태로 관리.
- **페이지 구현**:
  - `/admin/login`: 관리자 아이디 및 비밀번호를 입력받아 백엔드 통신 후 토큰을 저장하는 페이지.
  - `/admin/unauthorized`: 올바른 권한이 없을 경우 보여줄 권한 에러 페이지.
- **Axios / Fetch Interceptor**: 
  - 백엔드 API 요청 시 자동으로 JWT 토큰을 헤더에 삽입.
  - 401(Unauthorized) 또는 403(Forbidden) 에러 응답 시 로그아웃 처리 및 로그인 페이지로 리다이렉트.

---

## 3. 단계별 구현 계획 (Step-by-Step Implementation)

### 1단계: 백엔드 기반 작업 (Domain & DB)
1. **Entity 추가/수정**: 관리자 정보를 저장할 테이블(예: `Admin` 또는 `User`의 role 필드) 생성.
2. **Repository 구성**: 관리자 계정 조회를 위한 JpaRepository 구성.
3. **초기 관리자 계정 생성 (Optional)**: 애플리케이션 시작 시 DB에 루트 관리자 계정이 없으면 디폴트 계정을 생성하는 더미 스크립트 작성.

### 2단계: 백엔드 보안 패키지 및 JWT 구현
1. **Spring Security 의존성 추가**: `build.gradle`에 Security 및 JWT(jjwt) 라이브러리 추가.
2. **SecurityConfig 작성**: CSRF 비활성화, 세션 관리(STATELESS), `/api/v1/admin/**` 접근 권한 제어 설정.
3. **JWT Provider 구현**: 토큰 생성, 파싱, 검증(유효기한, 서명) 로직 작성.
4. **Authentication Filter 작성**: API 요청마다 토큰을 검사해 SecurityContext에 인증 객체를 저장하는 필터 추가.
5. **Auth Controller 작성**: 로그인 API (`/login`) 구현.

### 3단계: 프론트엔드 로그인 페이지 및 인증 로직
1. **API Client 수정**: axios 인스턴스에 토큰 삽입 인터셉터 구성.
2. **상태 관리 구성**: Auth 정보를 갖고 있는 Zustand store (또는 Redux/Context) 생성.
3. **로그인 UI 개발**: `/app/admin/login/page.tsx` 등 경로에 로그인 폼(아이디, 패스워드 입력 및 에러 메시지 처리) 구성.
4. **로그인 API 연동**: 폼 제출 시 API 요청 후 반환된 토큰을 클라이언트에 저장(쿠키 또는 localStorage).

### 4단계: 프론트엔드 라우트 보호 (Route Guard)
1. **Next.js Middleware 구현**: 루트 디렉토리에 `middleware.ts` 작성.
   - 대상: `/admin/:path*`
   - 로직: 토큰 존재 여부 확인 후 없으면 `/admin/login`으로 `NextResponse.redirect`.
2. **권한 에러 페이지**: `/admin/unauthorized` 페이지 구성 (디자인 및 홈으로 가기 버튼 탑재).
3. **레이아웃 연동**: `/app/admin/layout.tsx` 등에서 로그인 사용자 정보(이름 등)를 헤더에 표시 및 로그아웃 버튼 활성화.

---

## 4. 고려 사항 (Considerations)
- **보안(Security)**: JWT의 Access Token 탈취 방지를 위해 수명을 짧게(예: 15~30분) 설정하고 HttpOnly 쿠키에 담는 Refresh Token 도입을 고려할 수 있습니다.
- **비밀번호 단방향 암호화**: BCrypt 등을 사용하여 DB에 평문 암호가 저장되지 않도록 반드시 조치해야 합니다.
- **UX**: 로그인 토큰 만료 시, 사용자 작업이 끊기지 않도록 Silent Refresh 처리를 하거나 명확하게 만료 메시지를 띄워주어야 합니다.
