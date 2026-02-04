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

import com.newlecture.backend.entity.MenuImage;

@Repository
public class NewMenuImageRepository implements MenuImageRepository {

    private DataSource dataSource;

    public NewMenuImageRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<MenuImage> findAllByMenuId(Long menuId) {
        List<MenuImage> list = new ArrayList<>();

        String sql = "SELECT * FROM menu_images WHERE menu_id = " + menuId + " ORDER BY sort_order";

        try (Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Long id = rs.getLong("id");
                Long menuIdFromDb = rs.getLong("menu_id");
                String srcUrl = rs.getString("src_url");
                int sortOrder = rs.getInt("sort_order");
                Timestamp createdAtTs = rs.getTimestamp("created_at");
                LocalDateTime createdAt = createdAtTs != null ? createdAtTs.toLocalDateTime() : null;

                MenuImage menuImage = MenuImage.builder()
                        .id(id)
                        .menuId(menuIdFromDb)
                        .srcUrl(srcUrl)
                        .sortOrder(sortOrder)
                        .createdAt(createdAt)
                        .build();

                list.add(menuImage);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }
}
