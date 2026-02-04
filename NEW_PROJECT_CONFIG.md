# 🚀 새 Spring Boot 프로젝트 설정

✅ **프로젝트 생성 완료!** (2026-01-19)

---

## 📁 기본 정보

| 항목 | 값 |
|------|-----|
| **프로젝트 이름** | `back2` |
| **그룹 ID** | `com.new_cafe.app` |
| **설명** | `Back2 project for Spring Boot` |
| **생성 위치** | `/Users/chaena-eun/Desktop/IBM_Test/ncafe-back/back2` |

---

## ☕ Java & Spring 버전

| 항목 | 값 |
|------|-----|
| **Java 버전** | `21` |
| **Spring Boot 버전** | `4.0.1` |

---

## 📦 선택된 의존성

### 웹
- [x] **Spring Web** - REST API, MVC 웹 애플리케이션
- [ ] ~~Spring WebFlux - 리액티브 웹 애플리케이션~~

### 데이터베이스
- [ ] ~~Spring Data JPA - JPA를 사용한 데이터 접근~~
- [ ] ~~Spring Data JDBC - 간단한 JDBC 데이터 접근~~
- [ ] ~~MyBatis - MyBatis SQL 매퍼~~

### 데이터베이스 드라이버
- [ ] ~~H2 Database - 인메모리 DB (개발/테스트용)~~
- [ ] ~~MySQL - MySQL 데이터베이스~~
- [ ] ~~PostgreSQL - PostgreSQL 데이터베이스~~
- [ ] ~~MariaDB - MariaDB 데이터베이스~~

### 보안
- [ ] ~~Spring Security - 인증/인가~~
- [ ] ~~OAuth2 Client - OAuth2 로그인~~
- [ ] ~~OAuth2 Resource Server - JWT 토큰 검증~~

### 개발 도구
- [x] **Spring Boot DevTools** - 자동 재시작, 라이브 리로드
- [ ] ~~Lombok - 보일러플레이트 코드 감소~~

### 유효성 검증
- [ ] ~~Validation - Bean Validation (JSR-380)~~

### 기타
- [ ] ~~Actuator - 모니터링 및 관리 엔드포인트~~
- [ ] ~~Mail - 이메일 발송~~

---

## 🔧 추가 설정

| 항목 | 값 |
|------|-----|
| **서버 포트** | `8081` |
| **빌드 도구** | `Gradle` |

---

## 📂 생성된 파일 목록

```
back2/
├── build.gradle
├── settings.gradle
├── gradlew
├── gradlew.bat
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
└── src/
    ├── main/
    │   ├── java/com/new_cafe/app/back2/
    │   │   ├── Back2Application.java
    │   │   └── controller/
    │   │       └── HomeController.java
    │   └── resources/
    │       └── application.properties
    └── test/
        └── java/com/new_cafe/app/back2/
            └── Back2ApplicationTests.java
```

---

## 🚀 실행 방법

```bash
cd /Users/chaena-eun/Desktop/IBM_Test/ncafe-back/back2
./gradlew bootRun
```

### 엔드포인트
- `http://localhost:8081/` → "Welcome to Back2!"
- `http://localhost:8081/hello` → "Hello from Back2!"

---

## 📋 빌드 상태

| 항목 | 상태 |
|------|------|
| **빌드** | ✅ BUILD SUCCESSFUL |
| **테스트** | ✅ PASSED |
