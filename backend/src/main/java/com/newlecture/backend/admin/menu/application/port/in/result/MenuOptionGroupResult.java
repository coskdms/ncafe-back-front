package com.newlecture.backend.admin.menu.application.port.in.result;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuOptionGroupResult {
    private Long id;
    private String name;
    private Boolean isRequired;
    private Boolean isMultiple;
    private Integer sortOrder;
    private List<MenuOptionDetailResult> optionDetails;
}
