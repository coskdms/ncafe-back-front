package com.newlecture.backend.order.adapter.in.web.dto;

import com.newlecture.backend.order.domain.OrderType;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class OrderCreateRequest {
    private String receiverName;
    private String receiverPhone;
    private String address;
    private String memo;
    private OrderType type;
    private Integer usedPoints;
    private List<OrderItemRequest> items;

    @Getter
    @Setter
    public static class OrderItemRequest {
        private Long menuId;
        private String korName;
        private Integer price;
        private Integer quantity;
        private Map<String, String> options;
    }
}
