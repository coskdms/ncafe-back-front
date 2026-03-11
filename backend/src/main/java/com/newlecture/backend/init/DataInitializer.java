package com.newlecture.backend.init;

import com.newlecture.backend.admin.category.adapter.out.persistence.entity.CategoryJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuImageJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuJpaEntity;
import com.newlecture.backend.admin.category.adapter.out.persistence.repository.AdminCategoryJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuImageJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuOptionGroupJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuOptionDetailJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuOptionGroupJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuOptionDetailJpaRepository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

        private final AdminCategoryJpaRepository categoryRepository;
        private final AdminMenuJpaRepository menuRepository;
        private final AdminMenuImageJpaRepository menuImageRepository;
        private final AdminMenuOptionGroupJpaRepository optionGroupRepository;
        private final AdminMenuOptionDetailJpaRepository optionDetailRepository;
        private final JdbcTemplate jdbcTemplate;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(ApplicationArguments args) {
                // =====================================
                // [1] 사용자 테이블 자동 생성 및 기초 데이터 삽입
                // =====================================
                initUsersTable();
                initCartItemsTable();
                initOrdersTable();
                initNotificationsTable();


                // =====================================
                // [2] 메뉴 및 카테고리 초기 데이터 삽입
                // =====================================
                
                // 1. 카테고리 생성 (하나도 없을 때만 명시적으로 생성)
                if (categoryRepository.count() == 0) {
                        System.out.println("🚀 DataInitializer: 초기 카테고리를 생성합니다.");
                        categoryRepository.save(CategoryJpaEntity.builder().name("커피").icon("☕").sortOrder(1).build());
                        categoryRepository.save(CategoryJpaEntity.builder().name("음료/티").icon("🥤").sortOrder(2).build());
                        categoryRepository.save(CategoryJpaEntity.builder().name("디저트").icon("🍰").sortOrder(3).build());
                        categoryRepository.save(CategoryJpaEntity.builder().name("샌드위치").icon("🥪").sortOrder(4).build());
                }

                // 2. 메뉴 생성을 위해 기존/신규 카테고리 정보 확보
                CategoryJpaEntity coffeeCategory = categoryRepository.findByName("커피").orElse(null);
                CategoryJpaEntity nonCoffeeCategory = categoryRepository.findByName("음료/티").orElse(null);
                CategoryJpaEntity dessertCategory = categoryRepository.findByName("디저트").orElse(null);
                CategoryJpaEntity sandwichCategory = categoryRepository.findByName("샌드위치").orElse(null);

                // 3. 메뉴가 하나도 없을 때만 기초 데이터 삽입
                if (menuRepository.count() > 0) {
                        // 메뉴는 있는데 옵션 정보가 하나도 없는 경우 (이전 버전 마이그레이션용)
                        if (optionGroupRepository.count() == 0) {
                                fillOptionsForExistingMenus();
                        }
                        return;
                }

                System.out.println("🚀 DataInitializer: 기초 메뉴 데이터를 생성합니다.");

                if (coffeeCategory != null) {
                        MenuJpaEntity aa = createMenu("아메리카노", "Americano", coffeeCategory.getId().toString(), 4500, "시원하고 깔끔한 아메리카노입니다.",
                                        List.of("americano.png", "americano1.png"));
                        createCoffeeOptions(aa.getId());

                        MenuJpaEntity latte = createMenu("카페라떼", "Cafe Latte", coffeeCategory.getId().toString(), 5000,
                                        "고소한 우유와 에스프레소의 조화가 일품인 카페라떼입니다.",
                                        List.of("cafelatte.png", "cafelatte1.png"));
                        createCoffeeOptions(latte.getId());

                        MenuJpaEntity cap = createMenu("카푸치노", "Cappuccino", coffeeCategory.getId().toString(), 5000, "부드러운 우유 거품이 풍성한 카푸치노입니다.",
                                        List.of("capuchino.png", "capuchino1.png"));
                        createCoffeeOptions(cap.getId());

                        MenuJpaEntity macchiato = createMenu("카라멜 마끼아또", "Caramel Macchiato", coffeeCategory.getId().toString(), 5500,
                                        "달콤한 카라멜 시럽이 매력적인 카라멜 마끼아또입니다.",
                                        List.of("caramel-macchiato.png", "caramel-macchiato1.png"));
                        createSweetDrinkOptions(macchiato.getId());

                        MenuJpaEntity espresso = createMenu("에스프레소", "Espresso", coffeeCategory.getId().toString(), 4000,
                                        "커피의 본연의 맛을 진하게 느낄 수 있는 에스프레소입니다.",
                                        List.of("espresso.png", "espresso1.png"));
                        createCoffeeOptions(espresso.getId());

                        MenuJpaEntity signature = createMenu("시그니처 커피", "Signature Coffee", coffeeCategory.getId().toString(), 6000,
                                        "고라파덕 카페만의 특별한 시그니처 커피입니다.",
                                        List.of("signature.png", "signature1.png"));
                        createCoffeeOptions(signature.getId());
                }

                if (nonCoffeeCategory != null) {
                        MenuJpaEntity banana = createMenu("바나나 라떼", "Banana Latte", nonCoffeeCategory.getId().toString(), 5500,
                                        "달달하고 향긋한 바나나 우유 맛 라떼입니다.",
                                        List.of("bananalatte.png", "bananalatte1.png"));
                        createSweetDrinkOptions(banana.getId());
                }

                if (dessertCategory != null) {
                        createMenu("아몬드 쿠키", "Almond Cookie", dessertCategory.getId().toString(), 2500,
                                        "오독오독 아몬드가 고소하게 씹히는 쿠키입니다.",
                                        List.of("almond-cookie.png", "almond-cookie1.png"));
                        createMenu("버터 쿠키", "Butter Cookie", dessertCategory.getId().toString(), 2500,
                                        "버터 풍미가 가득해 입안에서 녹아내리는 쿠키입니다.",
                                        List.of("butter-cookie.png", "butter-cookie1.png"));
                        createMenu("초코칩 쿠키", "Choco Chip Cookie", dessertCategory.getId().toString(), 2500,
                                        "달콤한 초코칩이 듬뿍 박힌 클래식 쿠키입니다.",
                                        List.of("choco-chip-cookie.png", "choco-chip-cookie1.png"));
                        createMenu("초코 크루아상", "Chocolate Croissant", dessertCategory.getId().toString(), 4500,
                                        "진한 초콜릿이 겹겹이 살아있는 바삭한 크루아상입니다.",
                                        List.of("chocolate-croissant.png", "chocolate-croissant1.png"));
                        createMenu("초코 무스 케이크", "Chocolate Mousse Cake", dessertCategory.getId().toString(), 6500,
                                        "입에서 사르르 녹아내리는 진한 초콜릿 무스 케이크입니다.",
                                        List.of("chocolate-mousse.png", "chocolate-mousse1.png"));
                        createMenu("딸기 케이크", "Strawberry Cake", dessertCategory.getId().toString(), 6800,
                                        "신선한 딸기와 달콤한 생크림이 조화로운 케이크입니다.",
                                        List.of("strawberry-cake.png", "strawberry-cake1.png"));
                        createMenu("두바이 쫀득 쿠키", "Dubai Zzondeuk Cookie", dessertCategory.getId().toString(), 3500,
                                        "두바이 초콜릿 느낌을 담아 쫀득쫀득한 식감이 일품인 스페셜 쿠키입니다.",
                                        List.of("dubai-zzondeuk-cookie.png", "dubai-zzondeuk-cookie1.png"));
                }

                if (sandwichCategory != null) {
                        createMenu("베이글 & 크림치즈", "Bagel & Cream Cheese", sandwichCategory.getId().toString(), 4500,
                                        "쫄깃쫄깃한 베이글과 부드러운 크림치즈 세트입니다.",
                                        List.of("bagel-cream-cheese.png", "bagel-cream-cheese1.png"));
                        createMenu("불고기 베이글", "Beef Bagel", sandwichCategory.getId().toString(), 6500,
                                        "달달한 불고기가 가득 들어있는 든든한 베이글 샌드위치입니다.",
                                        List.of("beef-bagel.png", "beef-bagel1.png"));
                        createMenu("햄 치즈 샌드위치", "Ham & Cheese Sandwich", sandwichCategory.getId().toString(), 5500,
                                        "신선한 햄과 고소한 치즈가 들어간 클래식 샌드위치입니다.",
                                        List.of("ham-cheese-sandwich.png", "ham-cheese-sandwich1.png"));
                        createMenu("스크램블 에그 샌드위치", "Scrambled Egg Sandwich", sandwichCategory.getId().toString(), 6000,
                                        "폭신폭신한 스크램블 에그가 일품인 샌드위치입니다.",
                                        List.of("scrambled-egg-sandwich.png", "scrambled-egg-sandwich1.png"));
                        createMenu("참치 샌드위치", "Tuna Sandwich", sandwichCategory.getId().toString(), 6000,
                                        "담백한 참치 샐러드가 듬뿍 들어간 건강한 샌드위치입니다.",
                                        List.of("tuna-sandwich.png", "tuna-sandwich1.png"));
                        createMenu("터키 샌드위치", "Turkey Sandwich", sandwichCategory.getId().toString(), 6500,
                                        "깔끔한 칠면조 고기가 들어간 프리미엄 샌드위치입니다.",
                                        List.of("turkey-sandwich.png", "turkey-sandwich1.png"));
                }
        }

        private MenuJpaEntity createMenu(String korName, String engName, String categoryId, Integer price, String description,
                        List<String> images) {
                MenuJpaEntity menu = MenuJpaEntity.builder()
                                .korName(korName)
                                .engName(engName)
                                .categoryId(categoryId)
                                .price(price)
                                .description(description)
                                .isAvailable(true)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();

                MenuJpaEntity savedMenu = menuRepository.save(menu);

                int order = 1;
                for (String image : images) {
                        MenuImageJpaEntity menuImage = MenuImageJpaEntity.builder()
                                        .menuId(savedMenu.getId())
                                        .srcUrl(image)
                                        .sortOrder(order++)
                                        .createdAt(LocalDateTime.now())
                                        .build();
                        menuImageRepository.save(menuImage);
                }
                return savedMenu;
        }

        private void createCoffeeOptions(Long menuId) {
                // 1. 온도 (필수, 단일)
                MenuOptionGroupJpaEntity tempGroup = optionGroupRepository.save(MenuOptionGroupJpaEntity.builder()
                        .menuId(menuId).name("온도").isRequired(true).isMultiple(false).sortOrder(1).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(tempGroup.getId()).name("Hot").additionalPrice(0).sortOrder(1).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(tempGroup.getId()).name("Ice").additionalPrice(0).sortOrder(2).build());

                // 2. 사이즈 (필수, 단일)
                MenuOptionGroupJpaEntity sizeGroup = optionGroupRepository.save(MenuOptionGroupJpaEntity.builder()
                        .menuId(menuId).name("사이즈").isRequired(true).isMultiple(false).sortOrder(2).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(sizeGroup.getId()).name("Regular(기본사이즈)").additionalPrice(0).sortOrder(1).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(sizeGroup.getId()).name("Large").additionalPrice(500).sortOrder(2).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(sizeGroup.getId()).name("Max").additionalPrice(1000).sortOrder(3).build());

                // 3. 얼음 양 (선택, 단일, 아이스전용)
                MenuOptionGroupJpaEntity iceGroup = optionGroupRepository.save(MenuOptionGroupJpaEntity.builder()
                        .menuId(menuId).name("얼음 양").isRequired(false).isMultiple(false).sortOrder(3).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(iceGroup.getId()).name("적게").additionalPrice(0).sortOrder(1).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(iceGroup.getId()).name("보통").additionalPrice(0).sortOrder(2).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(iceGroup.getId()).name("많이").additionalPrice(0).sortOrder(3).build());

                // 4. 샷 추가 (선택, 다중) -> DB에서는 단순히 여러개 선택 가능한 그룹으로 취급, 실제 UI에서는 수량이나 1개/2개로 노출
                MenuOptionGroupJpaEntity shotGroup = optionGroupRepository.save(MenuOptionGroupJpaEntity.builder()
                        .menuId(menuId).name("샷 추가").isRequired(false).isMultiple(true).sortOrder(4).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(shotGroup.getId()).name("1샷 추가").additionalPrice(500).sortOrder(1).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(shotGroup.getId()).name("2샷 추가").additionalPrice(1000).sortOrder(2).build());
        }

        private void createSweetDrinkOptions(Long menuId) {
                // 커피 옵션 기본 세팅
                createCoffeeOptions(menuId);

                // 시럽 라디오/다중 선택 (선택, 다중)
                MenuOptionGroupJpaEntity syrupGroup = optionGroupRepository.save(MenuOptionGroupJpaEntity.builder()
                        .menuId(menuId).name("시럽 선택").isRequired(false).isMultiple(true).sortOrder(5).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(syrupGroup.getId()).name("바닐라 시럽").additionalPrice(500).sortOrder(1).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(syrupGroup.getId()).name("헤이즐넛 시럽").additionalPrice(500).sortOrder(2).build());
                optionDetailRepository.save(MenuOptionDetailJpaEntity.builder()
                        .optionGroupId(syrupGroup.getId()).name("카라멜 시럽").additionalPrice(500).sortOrder(3).build());
        }

        private void fillOptionsForExistingMenus() {
                System.out.println("✅ DataInitializer: 기존 메뉴에 대한 옵션 데이터를 생성합니다.");
                List<MenuJpaEntity> menus = menuRepository.findAll();
                for (MenuJpaEntity menu : menus) {
                        String name = menu.getKorName();
                        if (name.contains("아메리카노") || name.contains("라떼") || name.contains("카푸치노") || name.contains("에스프레소") || name.contains("시그니처") || name.contains("마끼아또")) {
                                if (name.equals("바나나 라떼") || name.equals("카라멜 마끼아또")) {
                                        createSweetDrinkOptions(menu.getId());
                                } else {
                                        createCoffeeOptions(menu.getId());
                                }
                        }
                }
        }

        private void initUsersTable() {
                // 1. UUID 확장이 필요한 경우를 대비해 설정 (PostgreSQL)
                jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"");

                // 2. 요청해주신 구조대로 users 테이블 생성 (없을 경우에만)
                String createTableSql = "CREATE TABLE IF NOT EXISTS users (" +
                                "id UUID PRIMARY KEY DEFAULT gen_random_uuid(), " +
                                "nickname VARCHAR(50) NOT NULL UNIQUE, " +
                                "password VARCHAR(255) NOT NULL, " +
                                "role VARCHAR(20) NOT NULL DEFAULT 'USER', " +
                                "current_points INTEGER DEFAULT 0, " +
                                "total_accumulated_points INTEGER DEFAULT 0, " +
                                "last_order_date TIMESTAMP WITH TIME ZONE, " +
                                "growth_level VARCHAR(50) DEFAULT 'Lv.1 갓 태어난 알', " +
                                "created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, " +
                                "updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP" +
                                ")";
                jdbcTemplate.execute(createTableSql);

                // 기존 테이블에 새로운 컬럼이 없을 경우 추가
                try { jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS current_points INTEGER DEFAULT 0"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS total_accumulated_points INTEGER DEFAULT 0"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_order_date TIMESTAMP WITH TIME ZONE"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS growth_level VARCHAR(50) DEFAULT 'Lv.1 갓 태어난 알'"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)"); } catch (Exception e) {}

                // 3. 관리자 계정 초기화
                insertUserIfMissing("coskdms", "thgud6173!", "ADMIN");
                insertUserIfMissing("admin", "admin1234", "ADMIN");

                System.out.println("✅ DataInitializer: 관리자 계정 확인 완료 (coskdms, admin)");
        }

        private void insertUserIfMissing(String nickname, String plainPassword, String role) {
                Integer count = jdbcTemplate.queryForObject(
                                "SELECT count(*) FROM users WHERE nickname = ?", Integer.class, nickname);
                if (count == null || count == 0) {
                        String insertSql = "INSERT INTO users (nickname, password, role) VALUES (?, ?, ?)";
                        jdbcTemplate.update(insertSql, nickname, passwordEncoder.encode(plainPassword), role);
                        System.out.println("   + 사용자 추가됨: " + nickname);
                }
        }

        private void initCartItemsTable() {
                String createTableSql = "CREATE TABLE IF NOT EXISTS cart_items (" +
                                "id BIGSERIAL PRIMARY KEY, " +
                                "member_id UUID NOT NULL, " +
                                "menu_id BIGINT NOT NULL, " +
                                "options VARCHAR(1000) DEFAULT '{}', " +
                                "quantity INTEGER NOT NULL DEFAULT 1, " +
                                "created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, " +
                                "updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP" +
                                ")";
                jdbcTemplate.execute(createTableSql);

                // 장바구니에 옵션이 추가되면서 member_id, menu_id 만으로는 유니크하지 않아지므로 제약조건 삭제 시도
                try {
                        jdbcTemplate.execute("ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS unique_member_menu");
                } catch (Exception e) {
                        System.out.println("No unique constraint to drop or error occurred.");
                }
                
                // 기존 테이블에 options 컬럼이 없다면 추가
                try {
                        jdbcTemplate.execute("ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS options VARCHAR(1000) DEFAULT '{}'");
                } catch (Exception e) {
                        System.out.println("Failed to add options column, might already exist.");
                }

                System.out.println("✅ DataInitializer: cart_items 테이블 확인 및 생성 완료 (옵션 지원)");
        }

        private void initOrdersTable() {
                // 1. orders 테이블 생성 (컬럼 'type', 'used_points' 등 누락 방지)
                String createOrdersTableSql = "CREATE TABLE IF NOT EXISTS orders (" +
                                "id BIGSERIAL PRIMARY KEY, " +
                                "payment_id VARCHAR(255) NOT NULL UNIQUE, " +
                                "member_id UUID, " +
                                "total_price INTEGER NOT NULL, " +
                                "status VARCHAR(50) NOT NULL, " +
                                "type VARCHAR(50) NOT NULL, " +
                                "receiver_name VARCHAR(255), " +
                                "receiver_phone VARCHAR(20), " +
                                "address TEXT, " +
                                "memo TEXT, " +
                                "used_points INTEGER DEFAULT 0, " +
                                "tx_id VARCHAR(255), " +
                                "created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP" +
                                ")";
                jdbcTemplate.execute(createOrdersTableSql);

                // 2. 누락된 컬럼(type, used_points 등) 강제 보정
                try { jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'DELIVERY'"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS used_points INTEGER DEFAULT 0"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS tx_id VARCHAR(255)"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS points_awarded BOOLEAN DEFAULT FALSE"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(255)"); } catch (Exception e) {}

                try { jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_phone VARCHAR(20)"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT"); } catch (Exception e) {}
                try { jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS memo TEXT"); } catch (Exception e) {}

                // 3. order_items 테이블 생성
                String createOrderItemsTableSql = "CREATE TABLE IF NOT EXISTS order_items (" +
                                "id BIGSERIAL PRIMARY KEY, " +
                                "order_id BIGINT REFERENCES orders(id), " +
                                "menu_id BIGINT NOT NULL, " +
                                "kor_name VARCHAR(255) NOT NULL, " +
                                "options TEXT, " +
                                "price INTEGER NOT NULL, " +
                                "quantity INTEGER NOT NULL" +
                                ")";
                jdbcTemplate.execute(createOrderItemsTableSql);

                System.out.println("✅ DataInitializer: orders 및 order_items 테이블 확인 및 생성 완료 (자동 마이그레이션 포함)");
        }

        private void initNotificationsTable() {
                String sql = "CREATE TABLE IF NOT EXISTS admin_notifications (" +
                                "id BIGSERIAL PRIMARY KEY, " +
                                "type VARCHAR(30) NOT NULL, " +
                                "title VARCHAR(200) NOT NULL, " +
                                "message TEXT, " +
                                "link VARCHAR(500), " +
                                "is_read BOOLEAN NOT NULL DEFAULT FALSE, " +
                                "created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)";
                jdbcTemplate.execute(sql);
                System.out.println("✅ DataInitializer: admin_notifications 테이블 확인 및 생성 완료");
        }
}

