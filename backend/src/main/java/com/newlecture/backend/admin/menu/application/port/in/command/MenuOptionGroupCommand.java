package com.newlecture.backend.admin.menu.application.port.in.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuOptionGroupCommand {
    private String name;
    private Boolean isRequired;
    private Boolean isMultiple;
    private Integer sortOrder;
    private List<MenuOptionDetailCommand> optionDetails;
}
