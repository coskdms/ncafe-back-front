package com.newlecture.backend.repository;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Repository;

import com.newlecture.backend.entity.Menu;

@Repository
public class NewMenuRepository implements MenuRepository {

    private DataSource dataSource;

    public NewMenuRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Menu> findAllByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery) {
        List<Menu> menus = new ArrayList<>();

        // 동적 SQL 생성
        StringBuilder sql = new StringBuilder("SELECT * FROM menus");
        List<String> conditions = new ArrayList<>();

        // categoryId가 있으면 조건 추가
        if (categoryId != null) {
            conditions.add("category_id = " + categoryId);
        }

        // searchQuery가 있으면 조건 추가
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            conditions.add("kor_name LIKE '%" + searchQuery.trim() + "%'");
        }

        // 조건이 있으면 WHERE 절 추가
        if (!conditions.isEmpty()) {
            sql.append(" WHERE ").append(String.join(" AND ", conditions));
        }

        System.out.println("Generated SQL: " + sql);

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql.toString())) {

            while (rs.next()) {
                Long id = rs.getLong("id");
                String korName = rs.getString("kor_name");
                String engName = rs.getString("eng_name");
                String catId = rs.getString("category_id");
                Integer price = rs.getInt("price");
                String description = rs.getString("description");
                Boolean isAvailable = rs.getBoolean("is_available");
                Timestamp createdAtTs = rs.getTimestamp("created_at");
                Timestamp updatedAtTs = rs.getTimestamp("updated_at");
                LocalDateTime createdAt = createdAtTs != null ? createdAtTs.toLocalDateTime()
                        : null;
                LocalDateTime updatedAt = updatedAtTs != null ? updatedAtTs.toLocalDateTime()
                        : null;

                Menu menu = Menu.builder()
                        .id(id)
                        .korName(korName)
                        .engName(engName)
                        .categoryId(catId)
                        .price(price)
                        .description(description)
                        .isAvailable(isAvailable)
                        .createdAt(createdAt)
                        .updatedAt(updatedAt)
                        .build();

                menus.add(menu);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return menus;
    }

    @Override
    public Menu findById(Long id) {
        String sql = "SELECT * FROM menus WHERE id = " + id;

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {

            if (rs.next()) {
                String korName = rs.getString("kor_name");
                String engName = rs.getString("eng_name");
                String catId = rs.getString("category_id");
                Integer price = rs.getInt("price");
                String description = rs.getString("description");
                Boolean isAvailable = rs.getBoolean("is_available");
                Timestamp createdAtTs = rs.getTimestamp("created_at");
                Timestamp updatedAtTs = rs.getTimestamp("updated_at");
                LocalDateTime createdAt = createdAtTs != null ? createdAtTs.toLocalDateTime() : null;
                LocalDateTime updatedAt = updatedAtTs != null ? updatedAtTs.toLocalDateTime() : null;

                return Menu.builder()
                        .id(id)
                        .korName(korName)
                        .engName(engName)
                        .categoryId(catId)
                        .price(price)
                        .description(description)
                        .isAvailable(isAvailable)
                        .createdAt(createdAt)
                        .updatedAt(updatedAt)
                        .build();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

}
