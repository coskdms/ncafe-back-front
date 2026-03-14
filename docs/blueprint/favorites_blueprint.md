# ❤️ 찜하기 (Favorites) 기능 청사진

> **목표:** 회원이 좋아하는 메뉴를 저장(찜)하고, 마이페이지에서 조회하며, AI 에이전트가 찜 목록 + 주문 이력을 기반으로 맞춤 추천을 제공하도록 한다.

---

## 1. 전체 아키텍처

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  프론트엔드   │────▶│   BFF (Next)  │────▶│ Spring Boot API │
│             │     │              │     │                 │
│ ❤️ 찜 버튼   │     │ /api/favorites│     │ /favorites      │
│ 마이페이지   │     │              │     │ DB: favorites   │
│ 메뉴 카드   │     │              │     │                 │
└─────────────┘     └──────────────┘     └─────────────────┘
                                                │
                                          ┌─────▼─────┐
                                          │ beomini   │
                                          │ AI Agent  │
                                          │ 찜 기반   │
                                          │ 추천 도구 │
                                          └───────────┘
```

---

## 2. 백엔드 (Spring Boot)

### 2-1. DB 테이블

```sql
CREATE TABLE favorites (
    id          BIGSERIAL PRIMARY KEY,
    member_id   VARCHAR(255) NOT NULL,
    menu_id     BIGINT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(member_id, menu_id),
    FOREIGN KEY (member_id) REFERENCES member(id),
    FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE
);
```

### 2-2. API 엔드포인트

| Method | URL | 설명 | 인증 |
|:---|:---|:---|:---:|
| `POST` | `/favorites/{menuId}` | 찜 추가 (토글) | ✅ |
| `DELETE` | `/favorites/{menuId}` | 찜 해제 | ✅ |
| `GET` | `/favorites` | 내 찜 목록 조회 | ✅ |
| `GET` | `/favorites/check/{menuId}` | 특정 메뉴 찜 여부 확인 | ✅ |
| `GET` | `/favorites/ids` | 내 찜 메뉴 ID 목록만 조회 (가벼운 응답) | ✅ |

### 2-3. 구현 파일 (헥사고날 아키텍처)

```
backend/src/main/java/com/newlecture/backend/
├── favorite/
│   ├── domain/
│   │   └── Favorite.java              # 엔티티
│   ├── adapter/
│   │   ├── in/web/
│   │   │   └── FavoriteController.java # REST 컨트롤러
│   │   └── out/persistence/
│   │       ├── FavoriteJpaRepository.java
│   │       └── FavoriteRepositoryImpl.java
│   └── application/
│       ├── port/
│       │   ├── in/FavoriteUseCase.java
│       │   └── out/FavoriteRepository.java
│       └── service/
│           └── FavoriteService.java
```

### 2-4. 주요 코드 스켈레톤

#### Favorite.java (엔티티)
```java
@Entity
@Table(name = "favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"member_id", "menu_id"})
})
@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class Favorite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "member_id", nullable = false)
    private String memberId;
    
    @Column(name = "menu_id", nullable = false)
    private Long menuId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    void prePersist() { this.createdAt = LocalDateTime.now(); }
}
```

#### FavoriteController.java
```java
@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;
    
    @PostMapping("/{menuId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long menuId) {
        favoriteService.addFavorite(menuId);
        return ResponseEntity.ok(Map.of("message", "찜 완료!", "favorited", true));
    }
    
    @DeleteMapping("/{menuId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long menuId) {
        favoriteService.removeFavorite(menuId);
        return ResponseEntity.ok(Map.of("message", "찜 해제!", "favorited", false));
    }
    
    @GetMapping
    public ResponseEntity<?> getMyFavorites() {
        return ResponseEntity.ok(favoriteService.getMyFavorites());
    }
    
    @GetMapping("/check/{menuId}")
    public ResponseEntity<?> isFavorited(@PathVariable Long menuId) {
        return ResponseEntity.ok(Map.of("favorited", favoriteService.isFavorited(menuId)));
    }
    
    @GetMapping("/ids")
    public ResponseEntity<?> getMyFavoriteIds() {
        return ResponseEntity.ok(favoriteService.getMyFavoriteIds());
    }
}
```

---

## 3. 프론트엔드

### 3-1. BFF API Route

**`/app/api/favorites/route.ts`** — 찜 목록 조회
**`/app/api/favorites/[menuId]/route.ts`** — 찜 추가/삭제

### 3-2. 찜 상태 관리 (Zustand Store)

```typescript
// stores/favoriteStore.ts
interface FavoriteStore {
    favoriteIds: Set<number>;       // 찜한 메뉴 ID 세트
    isLoaded: boolean;              // 초기 로딩 완료 여부
    loadFavorites: () => Promise<void>;
    toggleFavorite: (menuId: number) => Promise<void>;
    isFavorited: (menuId: number) => boolean;
}
```

> **왜 Set으로?** 찜 여부를 O(1)로 확인할 수 있어서 메뉴 카드 렌더링 시 성능 최적화.

### 3-3. UI 변경 포인트

#### A. 메뉴 카드 (MenuCard) — ❤️ 하트 버튼

```
┌──────────────────┐
│  [메뉴 이미지]   │
│            ❤️    │ ← 우상단 하트 아이콘
│                  │
│  아메리카노      │
│  4,500원         │
└──────────────────┘
```

- 비회원/비로그인: 하트 클릭 시 "로그인이 필요합니다" 토스트
- 회원: 클릭 시 토글 (빈 하트 ↔ 채운 하트)
- 애니메이션: 하트가 커졌다 작아지는 bounce 효과

#### B. 메뉴 상세 페이지 — ❤️ 찜하기 버튼

```
┌──────────────────────────────┐
│  [메뉴 이미지]               │
│                              │
│  아메리카노                   │
│  ⭐ 4.5 (120)    ❤️ 찜하기   │ ← 찜 버튼
│                              │
│  4,500원                     │
│  [장바구니 담기]              │
└──────────────────────────────┘
```

#### C. 마이페이지 — 찜 목록 탭

```
┌──────────────────────────────────────┐
│  마이페이지                          │
│                                      │
│  [내 정보] [주문내역] [❤️ 찜 목록]    │ ← 새 탭
│                                      │
│  ┌─────┐  ┌─────┐  ┌─────┐          │
│  │ 🖼️  │  │ 🖼️  │  │ 🖼️  │         │
│  │아메 │  │라떼 │  │크로 │          │
│  │4500 │  │5000 │  │3500 │          │
│  │ ❤️  │  │ ❤️  │  │ ❤️  │          │
│  └─────┘  └─────┘  └─────┘          │
│                                      │
│  총 3개의 찜한 메뉴                   │
└──────────────────────────────────────┘
```

### 3-4. CSS: 하트 애니메이션

```css
.heartBtn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(4px);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 1;
}

.heartBtn.active {
    color: #ef4444;
    animation: heartBounce 0.4s ease;
}

@keyframes heartBounce {
    0% { transform: scale(1); }
    30% { transform: scale(1.3); }
    60% { transform: scale(0.9); }
    100% { transform: scale(1); }
}
```

---

## 4. AI 에이전트 연동

### 4-1. 새로운 도구 함수

```python
# gemini.py - USER/ADMIN 도구에 추가
def get_my_favorites() -> dict:
    """
    회원의 찜한 메뉴 목록을 조회합니다.
    "찜한 메뉴 보여줘", "좋아하는 메뉴 뭐야?" 등의 요청에 사용합니다.
    """
    result = backend_api.get_my_favorites(auth_token)
    return result
```

### 4-2. AI 추천 로직 강화

```python
def get_personalized_recommendation() -> str:
    """
    회원의 찜 목록 + 주문 이력을 분석하여 맞춤 추천합니다.
    """
    favorites = backend_api.get_my_favorites(auth_token)
    orders = backend_api.get_my_orders(auth_token)
    menus = backend_api.get_menus()
    
    analysis = f"""
    [찜한 메뉴]: {json.dumps(favorites, ensure_ascii=False)}
    [주문 이력]: {json.dumps(orders, ensure_ascii=False)}
    [전체 메뉴]: {json.dumps(menus, ensure_ascii=False)}
    
    위 데이터를 분석하여:
    1. 찜한 메뉴 중 아직 안 시켜본 것 우선 추천
    2. 자주 주문한 메뉴와 비슷한 카테고리의 새 메뉴 추천
    3. 찜한 메뉴의 가격대·카테고리 패턴에 맞는 추천
    """
    return analysis
```

### 4-3. System Prompt 규칙 추가

```python
# USER_RULES에 추가
"""
═══ 찜하기 & 추천 규칙 ═══
- 회원이 "추천해줘"라고 하면 `get_personalized_recommendation`을 사용해줘.
- 찜 목록이 있으면 "찜해둔 OO도 아직 안 시켜보셨다덕! 오늘 한 번 어떠냐덕?" 이런 식으로 추천.
- 회원이 "찜한 메뉴 보여줘"라고 하면 `get_my_favorites`로 목록을 보여줘.
- 찜 목록이 비어있으면 "아직 찜한 메뉴가 없다덕! 메뉴를 둘러보면서 ❤️를 눌러보라덕~"
"""
```

---

## 5. 구현 순서

| 순서 | 작업 | 예상 시간 |
|:---:|:---|:---:|
| **1** | DB 테이블 생성 (Flyway/직접) | 10분 |
| **2** | Spring Boot: Entity + Repository + Service + Controller | 30분 |
| **3** | BFF API Route 추가 | 15분 |
| **4** | Zustand favoriteStore 생성 | 15분 |
| **5** | 메뉴 카드에 하트 버튼 추가 + 애니메이션 | 30분 |
| **6** | 메뉴 상세 페이지에 찜 버튼 추가 | 15분 |
| **7** | 마이페이지에 찜 목록 탭 추가 | 30분 |
| **8** | AI 에이전트: 찜 기반 추천 도구 연동 | 20분 |
| | **총 예상** | **~2.5시간** |

---

## 6. 확장 가능성

- **찜 수 표시**: 메뉴 카드에 "❤️ 23명이 찜" → 인기도 지표
- **관리자 인사이트**: "가장 많이 찜된 메뉴 TOP 5" 대시보드
- **푸시 알림**: 찜한 메뉴 할인 시 알림 (향후)
- **에이전트 대화**: "가장 인기 있는 메뉴 뭐야?" → 찜 수 기반 응답
