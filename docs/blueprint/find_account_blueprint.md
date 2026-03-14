# 아이디/비밀번호 찾기 기능 청사진

## 방식: 전화번호(필수) + 보안질문

### 플로우

#### 회원가입
```
닉네임 + 비밀번호 + 전화번호(필수) + 보안질문 선택 + 답변 입력
```

#### 아이디 찾기
```
전화번호 입력 → DB 매칭 → 마스킹된 아이디 표시 (cha***un)
```

#### 비밀번호 찾기 (2중 검증)
```
닉네임 + 전화번호 입력 → 보안질문 표시 → 답변 일치 → 새 비밀번호 설정
```

---

## API 설계

| Method | Endpoint | 설명 |
|:---|:---|:---|
| GET | `/v1/auth/find-id?phone=010...` | 전화번호로 아이디 찾기 |
| POST | `/v1/auth/find-password/verify` | 닉네임+전화번호+보안질문 답변 검증 |
| POST | `/v1/auth/find-password/reset` | 비밀번호 재설정 (검증 토큰 포함) |

## DB 변경

```sql
ALTER TABLE users ADD COLUMN security_question VARCHAR(200);
ALTER TABLE users ADD COLUMN security_answer VARCHAR(200);
-- phone 필드는 이미 존재 → 회원가입 시 필수로 받음
```

## 보안질문 목록
1. 처음 키운 반려동물의 이름은?
2. 졸업한 초등학교 이름은?
3. 어릴 때 별명은?
4. 가장 좋아하는 음식은?
5. 태어난 도시는?

## 구현 범위

### 백엔드
- Member 도메인: securityQuestion, securityAnswer 필드 추가
- JdbcMemberRepository: 신규 필드 save/read 반영, findByPhone 추가
- AuthController: find-id, find-password/verify, find-password/reset API 추가
- AuthService: 아이디 찾기, 비밀번호 재설정 로직

### 프론트엔드
- SignupForm: phone(필수) + 보안질문/답변 필드 추가
- FindIdForm: 전화번호 입력 → 결과 표시
- ResetPasswordForm: 닉네임+전화번호 → 보안질문 답변 → 새 비밀번호
- 로그인 페이지: "아이디 찾기 | 비밀번호 찾기" 링크 추가
