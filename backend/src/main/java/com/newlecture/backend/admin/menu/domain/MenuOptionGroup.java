package com.newlecture.backend.admin.menu.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuOptionGroup {
    private Long id;
    private Long menuId;
    private String name;
    private Boolean isRequired;
    private Boolean isMultiple;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // A group has multiple details
    private List<MenuOptionDetail> optionDetails;
}
