# 메뉴 관리 시스템 헥사고날 아키텍처 청사진 (v2)

이 문서는 현재 3계층(Controller-Service-Repository) 구조의 **메뉴 관리 시스템**을  
**헥사고날 아키텍처(포트 앤 어댑터)** 로 전환하기 위한 설계도입니다.  
향후 MSA 전환 시 `menu` 패키지를 독립 서비스로 분리하는 것을 목표로 합니다.

---

## 1. 현재 구조 분석 (AS-IS)

현재 3계층 구조에서 메뉴 관련 파일들은 **계층별로 흩어져** 있습니다.

```text
com.newlecture.backend/
├── controller/
│   ├── MenuController.java         # 메뉴 CRUD API
│   └── CategoryController.java     # 카테고리 CRUD API
│
├── service/
│   ├── MenuService.java            # 메뉴 서비스 인터페이스
│   ├── NewMenuService.java         # 메뉴 서비스 구현체
│   ├── CategoryService.java        # 카테고리 서비스 인터페이스
│   └── NewCategoryService.java     # 카테고리 서비스 구현체
│
├── repository/
│   ├── MenuRepository.java         # 메뉴 레포지토리 인터페이스
│   ├── NewMenuRepository.java      # 메뉴 레포지토리 구현체 (JDBC)
│   ├── MenuImageRepository.java    # 메뉴이미지 인터페이스
│   ├── NewMenuImageRepository.java # 메뉴이미지 구현체 (JDBC)
│   ├── CategoryRepository.java     # 카테고리 인터페이스
│   └── NewCategoryRepository.java  # 카테고리 구현체 (JDBC)
│
├── entity/
│   ├── Menu.java                   # 메뉴 엔티티
│   ├── MenuImage.java              # 메뉴 이미지 엔티티
│   ├── MenuOption.java             # 메뉴 옵션 엔티티
│   └── Category.java               # 카테고리 엔티티
│
└── dto/
    ├── MenuListRequest.java        # 메뉴 목록 조회 요청
    ├── MenuListResponse.java       # 메뉴 목록 조회 응답
    ├── MenuResponse.java           # 개별 메뉴 응답
    ├── MenuDetailResponse.java     # 메뉴 상세 조회 응답
    ├── MenuCreateRequest.java      # 메뉴 생성 요청
    ├── MenuCreateResponse.java     # 메뉴 생성 응답
    ├── MenuUpdateRequest.java      # 메뉴 수정 요청
    ├── MenuUpdateResponse.java     # 메뉴 수정 응답
    ├── MenuImageResponse.java      # 메뉴 이미지 응답
    └── MenuImageListResponse.java  # 메뉴 이미지 목록 응답
```

### 현재 구조의 문제점
1. Menu, Category, MenuImage가 모두 별도 패키지에 흩어져 있어 "메뉴 관리"라는 하나의 기능 단위로 파악하기 어렵다.
2. `NewMenuService`가 `CategoryRepository`를 직접 호출하고 있어 관심사 분리가 안 되어 있다.
3. MSA 전환 시 메뉴 관련 파일만 골라내서 분리하기 매우 어렵다.

---

## 2. 목표 구조 (TO-BE) - 헥사고날 아키텍처

"**메뉴 관리**"라는 Bounded Context에 Menu + Category + MenuImage + MenuOption을 모두 포함합니다.

```text
com.newlecture.backend/
│
├── menu/                                   # ★ "메뉴 관리" Bounded Context
│   │
│   ├── domain/                             # [Core] 순수 비즈니스 로직 (프레임워크 의존 X)
│   │   ├── Menu.java                       # Aggregate Root
│   │   ├── Category.java                   # 카테고리 도메인
│   │   ├── MenuImage.java                  # 메뉴 이미지 도메인
│   │   └── MenuOption.java                 # 메뉴 옵션 도메인
│   │
│   ├── application/                        # [Core] 유스케이스 (비즈니스 흐름 제어)
│   │   │
│   │   ├── port/
│   │   │   ├── in/                         # [Input Port] 외부 → 코어 (Interface)
│   │   │   │   ├── GetMenuListUseCase.java       # 메뉴 목록 조회
│   │   │   │   ├── GetMenuDetailUseCase.java     # 메뉴 상세 조회
│   │   │   │   ├── CreateMenuUseCase.java        # 메뉴 생성
│   │   │   │   ├── UpdateMenuUseCase.java        # 메뉴 수정
│   │   │   │   ├── DeleteMenuUseCase.java        # 메뉴 삭제
│   │   │   │   ├── GetMenuImageUseCase.java      # 메뉴 이미지 조회
│   │   │   │   └── GetCategoryListUseCase.java   # 카테고리 목록 조회
│   │   │   │
│   │   │   └── out/                        # [Output Port] 코어 → 외부 (Interface)
│   │   │       ├── LoadMenuPort.java             # 메뉴 로드 (DB에서 읽기)
│   │   │       ├── SaveMenuPort.java             # 메뉴 저장 (DB에 쓰기)
│   │   │       ├── DeleteMenuPort.java           # 메뉴 삭제
│   │   │       ├── LoadMenuImagePort.java        # 메뉴 이미지 로드
│   │   │       └── LoadCategoryPort.java         # 카테고리 로드
│   │   │
│   │   ├── service/                        # [Service] Input Port 구현체
│   │   │   ├── MenuQueryService.java             # 조회 관련 유스케이스 구현
│   │   │   ├── MenuCommandService.java           # 생성/수정/삭제 유스케이스 구현
│   │   │   └── CategoryQueryService.java         # 카테고리 조회 유스케이스 구현
│   │   │
│   │   └── dto/                            # [DTO] 계층 간 데이터 전달 객체
│   │       ├── MenuListQuery.java                # 메뉴 목록 조회 조건 (기존 MenuListRequest)
│   │       ├── CreateMenuCommand.java            # 메뉴 생성 명령 (기존 MenuCreateRequest)
│   │       └── UpdateMenuCommand.java            # 메뉴 수정 명령 (기존 MenuUpdateRequest)
│   │
│   └── adapter/                            # [Shell] 외부 세계와의 연결 (프레임워크 의존 O)
│       │
│       ├── in/                             # [Driving Adapter] 외부 요청 수신
│       │   └── web/
│       │       ├── MenuController.java           # 메뉴 REST API
│       │       ├── CategoryController.java       # 카테고리 REST API
│       │       ├── request/                      # Web 전용 Request DTO
│       │       │   ├── MenuListRequestDto.java
│       │       │   ├── MenuCreateRequestDto.java
│       │       │   └── MenuUpdateRequestDto.java
│       │       └── response/                     # Web 전용 Response DTO
│       │           ├── MenuListResponseDto.java
│       │           ├── MenuResponseDto.java
│       │           ├── MenuDetailResponseDto.java
│       │           ├── MenuImageResponseDto.java
│       │           └── MenuImageListResponseDto.java
│       │
│       └── out/                            # [Driven Adapter] 외부 시스템 호출
│           └── persistence/                # DB 관련 구현체
│               ├── MenuPersistenceAdapter.java      # LoadMenuPort, SaveMenuPort 구현
│               ├── MenuImagePersistenceAdapter.java  # LoadMenuImagePort 구현
│               ├── CategoryPersistenceAdapter.java   # LoadCategoryPort 구현
│               ├── MenuJdbcRepository.java           # 순수 JDBC 쿼리 (기존 NewMenuRepository)
│               ├── MenuImageJdbcRepository.java      # 기존 NewMenuImageRepository
│               └── CategoryJdbcRepository.java       # 기존 NewCategoryRepository
│
├── config/                                 # 공통 설정 (WebConfig 등)
│   └── WebConfig.java
│
├── filter/                                 # 인증 필터 등 (메뉴와 무관한 공통 기능)
│
├── controller/
│   └── HomeController.java                 # 메뉴 외 컨트롤러
│
└── BackendApplication.java
```

---

## 3. 의존성 방향 (Dependency Flow)

```
                        의존성 방향 →

┌─────────────────┐     ┌─────────────────────────┐     ┌──────────────────────┐
│  adapter/in/web │     │      application/        │     │  adapter/out/        │
│                 │────>│                          │<────│  persistence/        │
│  MenuController │     │  MenuQueryService        │     │                      │
│                 │     │    implements             │     │  MenuPersistence     │
│  (Input Port    │     │    GetMenuListUseCase     │     │  Adapter             │
│   를 호출)       │     │    (Input Port)           │     │    implements        │
│                 │     │                          │     │    LoadMenuPort       │
│                 │     │  ↓ 내부에서 호출            │     │    (Output Port)     │
│                 │     │  LoadMenuPort (Interface)│     │                      │
│                 │     │  LoadCategoryPort (I/F)  │     │                      │
└─────────────────┘     └─────────────────────────┘     └──────────────────────┘
                                    │
                                    ▼
                        ┌─────────────────────┐
                        │      domain/         │
                        │                     │
                        │  Menu.java (POJO)   │
                        │  Category.java      │
                        │  MenuImage.java     │
                        │                     │
                        │  ★ 어디에도 의존하지   │
                        │    않는 순수 자바      │
                        └─────────────────────┘
```

**핵심 규칙:**
- `domain` → 아무것도 의존하지 않음 (순수 자바)
- `application` → `domain`만 의존
- `adapter/in` → `application`의 Input Port만 의존
- `adapter/out` → `application`의 Output Port만 의존 (의존성 역전!)

---

## 4. 현재 파일 → 헥사고날 매핑표

| 현재 파일 (AS-IS) | 헥사고날 위치 (TO-BE) | 변경 사항 |
|---|---|---|
| `entity/Menu.java` | `menu/domain/Menu.java` | Lombok → 순수 자바, 비즈니스 메서드 추가 |
| `entity/Category.java` | `menu/domain/Category.java` | Lombok → 순수 자바 |
| `entity/MenuImage.java` | `menu/domain/MenuImage.java` | Lombok → 순수 자바 |
| `entity/MenuOption.java` | `menu/domain/MenuOption.java` | Lombok → 순수 자바 |
| `service/MenuService.java` (I/F) | `menu/application/port/in/` 여러 UseCase I/F로 분리 | 하나의 큰 인터페이스 → 역할별 분리 |
| `service/NewMenuService.java` | `menu/application/service/MenuQueryService.java` 등 | 조회/명령 서비스로 분리 |
| `service/CategoryService.java` (I/F) | `menu/application/port/in/GetCategoryListUseCase.java` | UseCase 인터페이스로 변환 |
| `service/NewCategoryService.java` | `menu/application/service/CategoryQueryService.java` | UseCase 구현체로 변환 |
| `repository/MenuRepository.java` (I/F) | `menu/application/port/out/LoadMenuPort.java` 등 | Output Port로 변환 |
| `repository/NewMenuRepository.java` | `menu/adapter/out/persistence/MenuJdbcRepository.java` | Adapter 내부 구현체 |
| `repository/CategoryRepository.java` (I/F) | `menu/application/port/out/LoadCategoryPort.java` | Output Port로 변환 |
| `repository/NewCategoryRepository.java` | `menu/adapter/out/persistence/CategoryJdbcRepository.java` | Adapter 내부 구현체 |
| `repository/MenuImageRepository.java` (I/F) | `menu/application/port/out/LoadMenuImagePort.java` | Output Port로 변환 |
| `repository/NewMenuImageRepository.java` | `menu/adapter/out/persistence/MenuImageJdbcRepository.java` | Adapter 내부 구현체 |
| `controller/MenuController.java` | `menu/adapter/in/web/MenuController.java` | Input Port만 호출하도록 변경 |
| `controller/CategoryController.java` | `menu/adapter/in/web/CategoryController.java` | Input Port만 호출하도록 변경 |
| `dto/MenuListRequest.java` | `menu/adapter/in/web/request/MenuListRequestDto.java` | Web 전용 DTO로 이동 |
| `dto/MenuListResponse.java` 등 | `menu/adapter/in/web/response/` | Web 전용 Response DTO로 이동 |

---

## 5. 작업 순서

### Phase 1: 패키지 구조 생성
`com.newlecture.backend.menu` 하위에 `domain`, `application`, `adapter` 폴더 구조를 생성합니다.

### Phase 2: Domain 이동
기존 `entity/` 패키지의 Menu, Category, MenuImage, MenuOption을 `menu/domain/`으로 이동하고 순수 자바 객체로 정리합니다.

### Phase 3: Port 정의
- Input Port: 기존 `MenuService` 인터페이스를 역할별 UseCase 인터페이스로 분리
- Output Port: 기존 `MenuRepository`, `CategoryRepository`, `MenuImageRepository` 인터페이스를 Port로 변환

### Phase 4: Service 이동
기존 `NewMenuService`, `NewCategoryService`를 `application/service/`로 이동하고, Input Port를 구현하며 Output Port만 의존하도록 수정합니다.

### Phase 5: Adapter 이동
- **Persistence Adapter**: 기존 `NewMenuRepository`, `NewCategoryRepository`, `NewMenuImageRepository`를 `adapter/out/persistence/`로 이동하고, PersistenceAdapter 클래스에서 Output Port를 구현합니다.
- **Web Adapter**: 기존 Controller와 DTO를 `adapter/in/web/`으로 이동합니다.

### Phase 6: 기존 패키지 정리
이동이 완료되면 기존의 `controller/`, `service/`, `repository/`, `entity/`, `dto/` 에서 메뉴 관련 파일을 삭제합니다.

---

## 6. MSA 분리 시 이점

이 구조가 완성되면, `com.newlecture.backend.menu` 패키지 전체를 **새로운 Spring Boot 프로젝트**로 복사하기만 하면 독립적인 **Menu 마이크로서비스**가 됩니다.
- `adapter/in/web` → 자체 REST API 제공
- `adapter/out/persistence` → 자체 DB 연결
- `domain` + `application` → 비즈니스 로직 그대로 유지
