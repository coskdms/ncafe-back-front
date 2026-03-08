package com.newlecture.backend.admin.menu.application.port.in.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 메뉴 수정 커맨드
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMenuCommand {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private String categoryId;
    private String imageSrc;
    private Boolean isAvailable;
    private Integer sortOrder;
    private List<MenuOptionGroupCommand> optionGroups;
}
