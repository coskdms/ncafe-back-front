package com.newlecture.backend.admin.menu.application.port.in.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 생성 커맨드
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMenuCommand {
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private String categoryId;
    private String imageSrc;
    private Boolean isAvailable;
    private Integer sortOrder;
}
