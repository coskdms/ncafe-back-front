package com.newlecture.backend.repository;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.newlecture.backend.entity.Category;

@Repository
public class NewCategoryRepository implements CategoryRepository {

    @Autowired
    private DataSource dataSource;

    @Override
    public List<Category> findAll() {
        List<Category> categories = new ArrayList<>();
        String sql = "SELECT * FROM categories ORDER BY sort_order";

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Integer id = rs.getInt("id");
                String name = rs.getString("name");
                String icon = rs.getString("icon");
                Integer sortOrder = rs.getInt("sort_order");

                // builder pattern을 사용하여 객체 생성
                // Category entity 에서 롬복의 builder를 사용하여 객체 생성
                // Category category = new Category(id, name);
                Category category = Category.builder()
                        .id(id)
                        .name(name)
                        .icon(icon)
                        .sortOrder(sortOrder)
                        .build();
                categories.add(category);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return categories;
    }

    @Override
    public Category findById(Integer id) {
        String sql = "SELECT * FROM categories WHERE id = " + id;

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                Integer categoryId = rs.getInt("id");
                String name = rs.getString("name");
                String icon = rs.getString("icon");
                Integer sortOrder = rs.getInt("sort_order");

                return Category.builder()
                        .id(categoryId)
                        .name(name)
                        .icon(icon)
                        .sortOrder(sortOrder)
                        .build();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }
}
