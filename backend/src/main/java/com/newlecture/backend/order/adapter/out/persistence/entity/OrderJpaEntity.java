package com.newlecture.backend.order.adapter.out.persistence.entity;

import com.newlecture.backend.order.domain.OrderStatus;
import com.newlecture.backend.order.domain.OrderType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String paymentId; // 포트원 V2 결제 ID

    private UUID memberId; // 회원 고유 ID

    @Column(nullable = false)
    private Integer totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type;

    private String receiverName;
    private String receiverPhone;
    private String address;
    private String memo;
    private Integer usedPoints;
    private Boolean pointsAwarded; // 포인트 지급 여부 (중복 방지)
    private String txId; // 결제 승인 후 저장할 거래 키


    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItemJpaEntity> items = new ArrayList<>();

    public void addItem(OrderItemJpaEntity item) {
        items.add(item);
        item.setOrder(this);
    }
}
