package com.newlecture.backend.order.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private OrderJpaEntity order;

    @Column(nullable = false)
    private Long menuId;

    @Column(nullable = false)
    private String korName;

    @Column(columnDefinition = "TEXT")
    private String options; // JSON string

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Integer quantity;
}
