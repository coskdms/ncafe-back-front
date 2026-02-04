package com.newlecture.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // getter, setter, toString, equals, hashCode 다 만들어주는거
@Builder // 객체 생성해주는거
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 매개변수로 하는 생성자
public class MenuListResponse {
    private List<MenuResponse> menus;
    private int totalCount;
}
