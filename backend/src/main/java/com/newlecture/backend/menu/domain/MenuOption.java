package com.newlecture.backend.menu.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuOption {
    private String id;
    private String name;
    private String type; // radio, checkbox
    private boolean required;
    private List<OptionItem> items; // 옵션 안에 또 아이템 리스트가 있음

    // 내부 클래스로 아이템 정의
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionItem {
        private String id;
        private String name;
        private int priceDelta;
    }
}
