package com.newlecture.backend.admin.menu.application.port.in.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuOptionDetailCommand {
    private String name;
    private Integer additionalPrice;
    private Integer sortOrder;
}
