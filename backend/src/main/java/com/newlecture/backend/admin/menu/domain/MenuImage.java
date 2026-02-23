package com.newlecture.backend.admin.menu.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImage {
    private Long id;
    private Long menuId;
    private String srcUrl;
    private Integer sortOrder;
    private LocalDateTime createdAt;
}
