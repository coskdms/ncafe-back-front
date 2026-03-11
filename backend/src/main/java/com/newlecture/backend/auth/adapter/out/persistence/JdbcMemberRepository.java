package com.newlecture.backend.auth.adapter.out.persistence;

import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * 아웃바운드 어댑터: JDBC 구현체
 * users 테이블에 접근합니다.
 */
@Repository
public class JdbcMemberRepository implements MemberRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcMemberRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Member> memberRowMapper = (rs, rowNum) -> Member.builder()
            .id(rs.getString("id"))
            .nickname(rs.getString("nickname"))
            .password(rs.getString("password"))
            .role(rs.getString("role"))
            .currentPoints(rs.getInt("current_points"))
            .totalAccumulatedPoints(rs.getInt("total_accumulated_points"))
            .lastOrderDate(rs.getTimestamp("last_order_date") != null
                    ? rs.getTimestamp("last_order_date").toLocalDateTime()
                    : null)
            .growthLevel(rs.getString("growth_level"))
            .socialProvider(rs.getString("social_provider"))
            .socialId(rs.getString("social_id"))
            .address(rs.getString("address"))
            .phone(rs.getString("phone"))
            .createdAt(rs.getTimestamp("created_at") != null
                    ? rs.getTimestamp("created_at").toLocalDateTime()
                    : null)
            .updatedAt(rs.getTimestamp("updated_at") != null
                    ? rs.getTimestamp("updated_at").toLocalDateTime()
                    : null)
            .build();

    @Override
    public Optional<Member> findByNickname(String nickname) {
        String sql = "SELECT * FROM users WHERE nickname = ?";
        List<Member> members = jdbcTemplate.query(sql, memberRowMapper, nickname);
        return members.stream().findFirst();
    }

    @Override
    public Optional<Member> findById(String id) {
        String sql = "SELECT * FROM users WHERE id = ?::uuid";
        List<Member> members = jdbcTemplate.query(sql, memberRowMapper, id);
        return members.stream().findFirst();
    }

    @Override
    public Optional<Member> findBySocialId(String provider, String socialId) {
        String sql = "SELECT * FROM users WHERE social_provider = ? AND social_id = ?";
        List<Member> members = jdbcTemplate.query(sql, memberRowMapper, provider, socialId);
        return members.stream().findFirst();
    }

    @Override
    public Member save(Member member) {
        String sql = """
                INSERT INTO users (id, nickname, password, role, 
                                 current_points, total_accumulated_points, 
                                 last_order_date, growth_level,
                                 social_provider, social_id,
                                 address, phone,
                                 created_at, updated_at)
                VALUES (?::uuid, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT (id) DO UPDATE SET
                    current_points = EXCLUDED.current_points,
                    total_accumulated_points = EXCLUDED.total_accumulated_points,
                    last_order_date = EXCLUDED.last_order_date,
                    growth_level = EXCLUDED.growth_level,
                    address = EXCLUDED.address,
                    phone = EXCLUDED.phone,
                    updated_at = CURRENT_TIMESTAMP
                """;
        
        String id = (member.getId() != null) ? member.getId() : UUID.randomUUID().toString();
        
        jdbcTemplate.update(sql,
                id,
                member.getNickname(),
                member.getPassword(),
                member.getRole(),
                member.getCurrentPoints(),
                member.getTotalAccumulatedPoints(),
                member.getLastOrderDate(),
                member.getGrowthLevel(),
                member.getSocialProvider(),
                member.getSocialId(),
                member.getAddress(),
                member.getPhone(),
                member.getCreatedAt() != null ? member.getCreatedAt() : LocalDateTime.now(),
                member.getUpdatedAt() != null ? member.getUpdatedAt() : LocalDateTime.now());

        member.setId(id);
        return member;
    }

    @Override
    public boolean existsByNickname(String nickname) {
        String sql = "SELECT COUNT(*) FROM users WHERE nickname = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, nickname);
        return count != null && count > 0;
    }
}
