package com.newlecture.backend.auth.adapter.out.persistence;

import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

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
    public Member save(Member member) {
        // DB의 id 컬럼이 uuid 타입이므로, 문자열이 아닌 UUID 객체를 직접 전달
        String sql = """
                INSERT INTO users (id, nickname, password, role, created_at, updated_at)
                VALUES (?::uuid, ?, ?, ?, ?, ?)
                """;
        String id = UUID.randomUUID().toString();
        jdbcTemplate.update(sql,
                id,
                member.getNickname(),
                member.getPassword(),
                member.getRole(),
                member.getCreatedAt(),
                member.getUpdatedAt());

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
