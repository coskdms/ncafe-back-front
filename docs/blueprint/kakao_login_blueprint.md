# 💬 NCafe 카카오 간편 로그인 연동 청사진

NCafe 서비스에 카카오 소셜 로그인을 통합하여 회원가입 허들을 낮추고 사용자 편의성을 높이기 위한 설계안입니다.

## 1. 인증 흐름 설계 (Auth Flow)

현재 NCafe는 **BFF(Backend For Frontend)** 패턴을 사용하고 있으므로, 카카오 인증 역시 이를 따릅니다.

1. **Frontend (Next.js)**: 사용자가 '카카오 로그인' 버튼 클릭 -> 카카오 인가 코드 요청 URL로 리다이렉트.
2. **Kakao Server**: 사용자가 인증 및 동의 완료 -> Frontend의 Redirect URI (`/api/auth/callback/kakao`)로 `code`와 함께 리다이렉트.
3. **BFF (Next.js API Route)**: 
    - URL에서 `code`를 추출.
    - 백엔드의 카카오 인증 엔드포인트(`POST /auth/kakao`)를 호출하여 `code` 전달.
4. **Backend (Spring Boot)**:
    - **가져오기**: Kakao API를 호출하여 `code`를 `access_token`으로 교환.
    - **유저 정보**: `access_token`으로 카카오 유저 프로필(ID, 닉네임, 이메일 등) 조회.
    - **회원 처리**: DB에서 카카오 ID로 기존 회원을 찾거나, 없으면 신규 회원으로 저장.
    - **JWT 발급**: 일반 로그인과 동일하게 NCafe 전용 JWT를 생성하여 응답.
5. **BFF / Frontend**: 서버에서 받은 JWT를 세션(iron-session)에 저장하고 메인 페이지로 이동.

---

## 2. 세부 변경 사항 (Implementation Tasks)

### 2.1 Database (PostgreSQL)
`Member` 엔티티에 소셜 로그인 여부를 식별할 수 있는 필드를 추가해야 합니다.

- `social_provider`: "LOCAL", "KAKAO" (ENUM 또는 String)
- `social_id`: 카카오에서 제공하는 고유 회원 번호 (Unique Index)

### 2.2 Backend (Spring Boot)
- **Dependency**: Kakao API 호출을 위한 `RestClient` 또는 `OpenFeign` 사용 권장.
- **DTO**: Kakao OAuth Token 및 User Info 응답을 매핑할 클래스들.
- **Service**: 
    - `exchangeCodeForToken(String code)`: 인가 코드로 토큰 획득.
    - `getKakaoUserInfo(String accessToken)`: 프로필 정보 획득.
    - `loginWithKakao(String kakaoId, String nickname)`: 기존 회원 조회 또는 신규 생성 로직 통합.
- **Controller**: `POST /auth/kakao` 엔드포인트 추가.

### 2.3 Frontend (Next.js)
- **Login Page**: 카카오 로그인 버튼 추가 (카카오 공식 디자인 가이드 준수).
- **Env**: `KAKAO_CLIENT_ID`, `KAKAO_REDIRECT_URI` 설정.
- **BFF Route**: `/api/auth/kakao/route.ts` (또는 페이지 내 핸들러)에서 백엔드와 통신하는 로직 추가.

---

## 3. 예외 처리 및 고려 사항

- **이메일 중복**: 일반 회원가입 이메일과 카카오 이메일이 같은 경우 어떻게 처리할지 정책 결정 (계정 통합 또는 별개 계정).
- **추가 정보 입력**: 카카오 로그인 시 필수 정보(예: 연락처)가 누락된 경우, 마이페이지로 유도하여 추가 입력을 받는 프로세스 구축.
- **배포 설정**: 카카오 개발자 센터(Kakao Developers) 내에 `REDIRECT_URI`를 개발/운영 환경별로 정확히 등록해야 함.

---

## 4. 구현 일정 제안

1. **Kakao Developers 설정**: 앱 등록 및 REST API 키 발급.
2. **백엔드 소셜 로직 구현**: Kakao API 연동 유틸리티 및 엔드포인트 개발.
3. **DB 마이그레이션**: 소셜 전용 필드 추가.
4. **프론트엔드 연동**: 카카오 리다이렉트 흐름 구현 및 BFF 통신 완료.

> [!IMPORTANT]
> **보안 주의사항**
> 카카오 `client_secret`은 백엔드에서만 관리하며, 브라우저에는 절대 노출되지 않도록 환경 변수를 철저히 관리합니다.

---

준비가 되셨다면, 첫 번째 단계인 **백엔드 도메인 확장(DB 필드 추가) 및 API 호출 유틸리티**부터 시작해 볼까요? 🐤💬
