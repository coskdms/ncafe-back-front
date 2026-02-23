package com.newlecture.backend.admin.menu.application.port.in.result;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 생성/수정 결과
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuSaveResult {
    private Long id;
    private String message;
    private boolean success;
}
