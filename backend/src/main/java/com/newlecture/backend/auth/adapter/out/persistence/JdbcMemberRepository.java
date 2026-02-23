package com.newlecture.backend.auth.adapter.out.persistence;

import com.newlecture.backend.auth.domain.Member;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 아웃바운드 어댑터: JDBC 구현체
 * MemberRepository(아웃바운드 포트)를 구현합니다.
 * DB 기술이 바뀌면 이 클래스만 교체하면 됩니다.
 */
@Repository
public class JdbcMemberRepository implements MemberRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcMemberRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Member> memberRowMapper = (rs, rowNum) -> Member.builder()
            .id(rs.getLong("id"))
            .email(rs.getString("email"))
            .password(rs.getString("password"))
            .nickname(rs.getString("nickname"))
            .role(rs.getString("role"))
            .createdAt(rs.getTimestamp("created_at") != null
                    ? rs.getTimestamp("created_at").toLocalDateTime()
                    : null)
            .updatedAt(rs.getTimestamp("updated_at") != null
                    ? rs.getTimestamp("updated_at").toLocalDateTime()
                    : null)
            .build();

    @Override
    public Optional<Member> findByEmail(String email) {
        String sql = "SELECT * FROM member WHERE email = ?";
        List<Member> members = jdbcTemplate.query(sql, memberRowMapper, email);
        return members.stream().findFirst();
    }

    @Override
    public Member save(Member member) {
        String sql = """
                INSERT INTO member (email, password, nickname, role, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """;
        jdbcTemplate.update(sql,
                member.getEmail(),
                member.getPassword(),
                member.getNickname(),
                member.getRole(),
                member.getCreatedAt(),
                member.getUpdatedAt());

        // 저장 후 조회하여 ID 포함한 정보 반환
        return findByEmail(member.getEmail()).orElse(member);
    }

    @Override
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM member WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }
}
