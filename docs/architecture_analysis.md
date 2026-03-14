# 🏗️ Ncafe 아키텍처 분석 - 헥사고날 + BFF 준수 현황

## 📐 기준 구조 (Hexagonal Architecture)
```
도메인/
├── adapter/
│   ├── in/web/         ← Controller (Driving Adapter)
│   │   └── dto/        ← Request/Response DTO
│   └── out/persistence/ ← Repository 구현 (Driven Adapter)
│       ├── entity/
│       └── repository/
├── application/
│   ├── port/
│   │   ├── in/         ← UseCase 인터페이스
│   │   └── out/        ← Repository 인터페이스
│   └── service/        ← UseCase 구현
└── domain/             ← 핵심 도메인 객체
```

---

## ✅ 헥사고날 구조 준수 도메인

### 1. `menu` (사용자 메뉴) — ⭐ 모범 사례
```
menu/
├── adapter/in/web/          ✅ CustomerMenuController, CustomerCategoryController
│   └── dto/                 ✅ CustomerMenuListRequest, Response 등
├── adapter/out/persistence/ ✅ MenuPersistenceAdapter, CategoryPersistenceAdapter
│   ├── entity/              ✅ MenuJpaEntity, MenuImageJpaEntity 등
│   └── repository/          ✅ CustomerMenuJpaRepository 등
├── application/
│   ├── port/in/             ✅ GetCustomerMenuListUseCase 등 (UseCase 인터페이스)
│   │   ├── command/         ✅ GetCustomerMenuListCommand
│   │   └── result/          ✅ CustomerMenuListResult 등
│   ├── port/out/            ✅ MenuRepository, MenuImageRepository (포트)
│   └── service/             ✅ CustomerMenuService, CustomerCategoryService
└── domain/                  ✅ Menu, MenuImage, Category
```
> **평가:** 완벽한 헥사고날! Port/Adapter 분리, UseCase 인터페이스, Command/Result 모두 갖춤

### 2. `admin/menu` — ⭐ 모범 사례
```
admin/menu/
├── adapter/in/web/          ✅ AdminMenuController
│   └── dto/                 ✅ MenuCreateRequest, MenuUpdateRequest 등
├── adapter/out/persistence/ ✅ MenuPersistenceAdapter, MenuImagePersistenceAdapter
│   ├── entity/              ✅ MenuOptionGroupJpaEntity, MenuOptionDetailJpaEntity
│   └── repository/          ✅ AdminMenuJpaRepository 등
├── application/
│   ├── port/in/             ✅ CreateMenuUseCase, UpdateMenuUseCase 등
│   │   ├── command/         ✅ CreateMenuCommand, UpdateMenuCommand
│   │   └── result/          ✅ MenuDetailResult, MenuListResult
│   ├── port/out/            ✅ AdminMenuRepository 등
│   └── service/             ✅ AdminMenuService
└── domain/                  ✅ Menu, MenuImage
```
> **평가:** 완벽한 헥사고날!

### 3. `admin/category` — ✅ 준수
```
admin/category/
├── adapter/in/web/          ✅ AdminCategoryController
├── adapter/out/persistence/ ✅ CategoryPersistenceAdapter, entity/, repository/
├── application/
│   ├── port/in/             ✅ AdminCategoryUseCase
│   ├── port/out/            ✅ CategoryRepository
│   └── service/             ✅ AdminCategoryService
└── domain/                  ✅ Category
```

### 4. `admin/setting` — ✅ 준수
```
admin/setting/
├── adapter/in/web/          ✅ AdminSettingController
├── adapter/out/persistence/ ✅ entity/, repository/
├── application/
│   ├── port/in/             ✅ (UseCase)
│   ├── port/out/            ✅ (Repository 포트)
│   └── service/             ✅
└── domain/                  ✅
```

### 5. `admin/notification` — ✅ 준수
```
admin/notification/
├── adapter/in/web/          ✅ SseNotificationController
├── adapter/out/persistence/ ✅
├── application/             ✅
└── domain/                  ✅
```

### 6. `auth` — ✅ 준수
```
auth/
├── adapter/in/web/          ✅ AuthController, MemberController
│   └── dto/                 ✅ LoginRequest, SignupRequest
├── adapter/out/persistence/ ✅ JdbcMemberRepository
├── application/
│   ├── port/in/             ✅ AuthUseCase
│   ├── port/out/            ✅ MemberRepository
│   └── service/             ✅ AuthService, KakaoService, MemberService
└── domain/                  ✅ Member
```

### 7. `order` — ✅ 준수
```
order/
├── adapter/in/web/          ✅ OrderController, AdminOrderController
│   └── dto/                 ✅ OrderCreateRequest
├── adapter/out/persistence/ ✅
│   ├── entity/              ✅ OrderJpaEntity, OrderItemJpaEntity
│   └── repository/          ✅ OrderJpaRepository, OrderItemJpaRepository
├── application/service/     ✅ OrderService, PortOneService
└── domain/                  ✅ OrderStatus, OrderType
```

---

## ⚠️ 부분적 준수 / 개선 필요 도메인

### 8. `cart` — ⚠️ UseCase 인터페이스 없음
```
cart/
├── adapter/in/web/          ✅ CartController
│   └── dto/                 ✅ CartItemAddRequest, CartItemResponse
├── adapter/out/persistence/ ✅ entity/, repository/
└── application/service/     ✅ CartService
❌ domain/ 없음
❌ application/port/in/ 없음 (UseCase 인터페이스)
❌ application/port/out/ 없음 (Repository 포트)
```
> **문제:** Service가 Repository를 직접 참조. 도메인 객체 없이 JPA Entity를 직접 사용할 가능성.

### 9. `favorite` — ⚠️ UseCase 인터페이스 없음
```
favorite/
├── adapter/in/web/          ✅ FavoriteController
├── adapter/out/persistence/ ✅ entity/, repository/
└── application/service/     ✅ FavoriteService
❌ domain/ 없음
❌ application/port/in/ 없음
❌ application/port/out/ 없음
```
> **문제:** cart와 동일. Port 계층 없이 Service→Repository 직접 의존.

### 10. `admin/dashboard` — ⚠️ dto 위치 이상
```
admin/dashboard/
├── adapter/in/web/          ✅ AdminDashboardController
├── application/service/     ✅ DashboardService
└── dto/                     ⚠️ DashboardStatsResponse (adapter/in/web/dto에 있어야 함)
❌ domain/ 없음
```
> **문제:** `dto/`가 `adapter/in/web/dto/` 가 아닌 도메인 루트에 위치.

### 11. `public_api/setting` — ⚠️ application 계층 없음
```
public_api/setting/
└── adapter/in/web/          ✅ PublicSettingController
❌ application/ 없음
❌ domain/ 없음
```
> **문제:** Controller만 존재. admin/setting의 서비스를 직접 참조하고 있을 가능성.

---

## ❌ 헥사고날 위반 (레거시)

### 12. `controller/` — ❌ 위반
```
controller/
└── HomeController.java      ❌ 패키지 구조가 헥사고날이 아님
```
> **문제:** 도메인 소속 없이 독립적인 `controller/` 패키지. 이동 필요.

### 13. `entity/` — ❌ 위반
```
entity/
└── MenuOption.java           ❌ 도메인에 속하지 않는 독립 엔티티
```
> **문제:** 어떤 도메인에도 속하지 않는 공용 entity 패키지. `menu/domain/`이나 관련 도메인에 이동 필요.

---

## 🔀 BFF (Backend for Frontend) 구조

### Next.js API Routes (프론트엔드 → 백엔드 프록시)
```
frontend/app/api/
├── auth/
│   ├── login/route.ts        ✅ → POST /auth/login
│   ├── signup/route.ts       ✅ → POST /auth/signup
│   ├── logout/route.ts       ✅ → POST /auth/logout
│   ├── session/route.ts      ✅ → GET /auth/session
│   ├── kakao/callback/       ✅ → GET /auth/kakao
│   ├── find-id/route.ts      ✅ → GET /auth/find-id
│   └── find-password/
│       ├── verify/route.ts   ✅ → POST /auth/find-password/verify
│       └── reset/route.ts    ✅ → POST /auth/find-password/reset
├── agent/
│   ├── chat/route.ts         ✅ → POST /beomini/chat
│   └── rag/route.ts          ✅ → GET/POST /beomini/rag
├── [...path]/route.ts        ✅ → 범용 프록시 (나머지 API)
└── sse/[...path]/route.ts    ✅ → SSE 프록시
```
> **평가:** ✅ BFF 패턴 완벽 준수! 프론트엔드가 백엔드에 직접 접근하지 않고, Next.js API Route를 통해 프록시.

---

## 📊 종합 평가

| 항목 | 상태 | 비고 |
|:---|:---:|:---|
| **BFF 패턴** | ✅ 완벽 | Next.js API Route로 모든 요청 프록시 |
| **헥사고날 (menu, admin)** | ✅ 모범 | Port/Adapter/Domain 완벽 분리 |
| **헥사고날 (auth, order)** | ✅ 준수 | 구조 잘 갖춤 |
| **cart, favorite** | ⚠️ 부분 | Port 계층, Domain 객체 누락 |
| **dashboard** | ⚠️ 부분 | DTO 위치 이상 |
| **public_api/setting** | ⚠️ 부분 | Application 계층 없음 |
| **controller/, entity/** | ❌ 위반 | 레거시 패키지, 이동 필요 |

### 🎯 권장 개선 순서
1. `controller/HomeController.java` → 적절한 도메인으로 이동
2. `entity/MenuOption.java` → `menu/domain/`으로 이동
3. `cart`, `favorite` → `domain/`, `application/port/` 추가
4. `admin/dashboard/dto/` → `adapter/in/web/dto/`로 이동
5. `public_api/setting` → `application/` 계층 추가
