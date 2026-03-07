package com.newlecture.backend.init;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.CategoryJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuImageJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminCategoryJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuImageJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

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
        private final JdbcTemplate jdbcTemplate;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(ApplicationArguments args) {
                // =====================================
                // [1] 사용자 테이블 자동 생성 및 기초 데이터 삽입
                // =====================================
                initUsersTable();
                initCartItemsTable();

                // =====================================
                // [2] 메뉴 및 카테고리 초기 데이터 삽입
                // =====================================
                if (categoryRepository.count() > 0) {
                        return; // 이미 데이터가 있으면 실행하지 않음
                }

                // 1. 카테고리 생성
                CategoryJpaEntity coffeeCategory = categoryRepository
                                .save(CategoryJpaEntity.builder().name("커피").icon("☕").sortOrder(1).build());
                CategoryJpaEntity nonCoffeeCategory = categoryRepository
                                .save(CategoryJpaEntity.builder().name("음료/티").icon("🥤").sortOrder(2).build());
                CategoryJpaEntity dessertCategory = categoryRepository
                                .save(CategoryJpaEntity.builder().name("디저트").icon("🍰").sortOrder(3).build());
                CategoryJpaEntity sandwichCategory = categoryRepository
                                .save(CategoryJpaEntity.builder().name("샌드위치").icon("🥪").sortOrder(4).build());

                // 2. 메뉴 생성
                createMenu("아메리카노", "Americano", coffeeCategory.getId().toString(), 4500, "시원하고 깔끔한 아메리카노입니다.",
                                List.of("americano.png", "americano1.png"));
                createMenu("카페라떼", "Cafe Latte", coffeeCategory.getId().toString(), 5000,
                                "고소한 우유와 에스프레소의 조화가 일품인 카페라떼입니다.",
                                List.of("cafelatte.png", "cafelatte1.png"));
                createMenu("카푸치노", "Cappuccino", coffeeCategory.getId().toString(), 5000, "부드러운 우유 거품이 풍성한 카푸치노입니다.",
                                List.of("capuchino.png", "capuchino1.png"));
                createMenu("카라멜 마끼아또", "Caramel Macchiato", coffeeCategory.getId().toString(), 5500,
                                "달콤한 카라멜 시럽이 매력적인 카라멜 마끼아또입니다.",
                                List.of("caramel-macchiato.png", "caramel-macchiato1.png"));
                createMenu("에스프레소", "Espresso", coffeeCategory.getId().toString(), 4000,
                                "커피의 본연의 맛을 진하게 느낄 수 있는 에스프레소입니다.",
                                List.of("espresso.png", "espresso1.png"));
                createMenu("시그니처 커피", "Signature Coffee", coffeeCategory.getId().toString(), 6000,
                                "고라파덕 카페만의 특별한 시그니처 커피입니다.",
                                List.of("signature.png", "signature1.png"));

                createMenu("바나나 라떼", "Banana Latte", nonCoffeeCategory.getId().toString(), 5500,
                                "달달하고 향긋한 바나나 우유 맛 라떼입니다.",
                                List.of("bananalatte.png", "bananalatte1.png"));

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

        private void createMenu(String korName, String engName, String categoryId, Integer price, String description,
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
                                "created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, " +
                                "updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP" +
                                ")";
                jdbcTemplate.execute(createTableSql);

                // 3. coskdms 계정 하나만 관리자로 남기고 나머지는 제거
                insertUserIfMissing("coskdms", "thgud6173!", "ADMIN");

                System.out.println("✅ DataInitializer: 'coskdms' 관리자 계정 확인 완료");
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
                                "quantity INTEGER NOT NULL DEFAULT 1, " +
                                "created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, " +
                                "updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, " +
                                "CONSTRAINT unique_member_menu UNIQUE (member_id, menu_id)" +
                                ")";
                jdbcTemplate.execute(createTableSql);
                System.out.println("✅ DataInitializer: cart_items 테이블 확인 및 생성 완료");
        }
}
