package com.newlecture.backend.order.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuOptionDetailJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuOptionGroupJpaRepository;
import com.newlecture.backend.admin.notification.application.service.NotificationService;
import com.newlecture.backend.admin.notification.application.service.SseNotificationService;
import com.newlecture.backend.admin.setting.adapter.out.persistence.repository.ShopSettingJpaRepository;
import com.newlecture.backend.auth.application.port.out.MemberRepository;
import com.newlecture.backend.auth.application.service.MemberService;
import com.newlecture.backend.order.adapter.in.web.dto.OrderCreateRequest;
import com.newlecture.backend.order.adapter.in.web.dto.OrderCreateRequest.OrderItemRequest;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderItemJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.entity.OrderJpaEntity;
import com.newlecture.backend.order.adapter.out.persistence.repository.OrderJpaRepository;
import com.newlecture.backend.order.domain.OrderStatus;
import com.newlecture.backend.order.domain.OrderType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * 결제 무결성 리뷰(P1~P4)에서 도출된 결함을 검증하는 단위 테스트.
 * 극단 입력(수량 오버플로우, 빈 항목)과 결제 위·변조(금액 불일치) 시나리오를 포함한다.
 */
class OrderServiceTest {

    @Mock OrderJpaRepository orderRepository;
    @Mock MemberRepository memberRepository;
    @Mock MemberService memberService;
    @Mock NotificationService notificationService;
    @Mock SseNotificationService sseNotificationService;
    @Mock PortOneService portOneService;
    @Mock AdminMenuJpaRepository menuRepository;
    @Mock AdminMenuOptionGroupJpaRepository optionGroupRepository;
    @Mock AdminMenuOptionDetailJpaRepository optionDetailRepository;
    @Mock ShopSettingJpaRepository shopSettingRepository;

    OrderService sut;
    AutoCloseable mocks;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        sut = new OrderService(orderRepository, memberRepository, memberService,
                notificationService, sseNotificationService, portOneService,
                menuRepository, optionGroupRepository, optionDetailRepository,
                shopSettingRepository, new ObjectMapper());
        // 비회원(게스트) 로그인 상태
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("anonymousUser", null));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(optionGroupRepository.findAllByMenuIdOrderBySortOrderAsc(any())).thenReturn(List.of());
    }

    @AfterEach
    void tearDown() throws Exception {
        SecurityContextHolder.clearContext();
        mocks.close();
    }

    private MenuJpaEntity menu(long id, int price) {
        return MenuJpaEntity.builder().id(id).korName("아메리카노").price(price).isAvailable(true).build();
    }

    private OrderItemRequest item(long menuId, int clientPrice, int qty) {
        OrderItemRequest i = new OrderItemRequest();
        i.setMenuId(menuId);
        i.setKorName("아메리카노");
        i.setPrice(clientPrice);
        i.setQuantity(qty);
        return i;
    }

    private OrderCreateRequest req(OrderType type, List<OrderItemRequest> items) {
        OrderCreateRequest r = new OrderCreateRequest();
        r.setType(type);
        r.setItems(items);
        return r;
    }

    @Test
    @DisplayName("1. 클라이언트가 보낸 가격을 무시하고 DB 가격으로 계산한다 (가격 위조 차단)")
    void createOrder_ignoresClientPrice_usesDbPrice() {
        when(menuRepository.findById(1L)).thenReturn(Optional.of(menu(1L, 4500)));
        // 클라이언트는 price=1원으로 위조
        OrderJpaEntity result = sut.createOrder(req(OrderType.PICK_UP, List.of(item(1L, 1, 2))));
        assertThat(result.getTotalPrice()).isEqualTo(9000); // 4500 * 2, 클라 값(1) 무시
    }

    @Test
    @DisplayName("2. [극단] 수량 오버플로우로 금액을 낮추려는 시도를 차단한다")
    void createOrder_rejectsQuantityOverflowAttack() {
        assertThatThrownBy(() ->
                sut.createOrder(req(OrderType.PICK_UP, List.of(item(1L, 4500, Integer.MAX_VALUE)))))
                .isInstanceOf(IllegalArgumentException.class);
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("3. [엣지] 빈 항목 주문은 크래시 대신 명확한 예외를 던진다")
    void createOrder_rejectsEmptyItems() {
        assertThatThrownBy(() -> sut.createOrder(req(OrderType.PICK_UP, List.of())))
                .isInstanceOf(IllegalArgumentException.class);
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("4. [보안] PortOne 실결제 금액이 다르면 PAID가 아니라 FAILED로 저장한다")
    void completeOrder_marksFailed_whenAmountMismatch() {
        OrderJpaEntity order = OrderJpaEntity.builder()
                .paymentId("order-x").totalPrice(9000).status(OrderStatus.PENDING).build();
        when(orderRepository.findByPaymentId("order-x")).thenReturn(Optional.of(order));
        // 실제 결제는 10원만 됨 (위조 결제)
        when(portOneService.getPayment("order-x")).thenReturn(new PortOneService.PaymentInfo("PAID", 10));

        sut.completeOrder("order-x");

        assertThat(order.getStatus()).isEqualTo(OrderStatus.FAILED);
        verify(notificationService, never()).createNotification(any(), any(), any(), any());
    }

    @Test
    @DisplayName("5. [정상] 상태 PAID + 금액 일치 시에만 확정 처리된다")
    void completeOrder_marksPaid_whenVerified() {
        OrderJpaEntity order = OrderJpaEntity.builder()
                .paymentId("order-y").totalPrice(9000).status(OrderStatus.PENDING).build();
        order.addItem(OrderItemJpaEntity.builder()
                .menuId(1L).korName("아메리카노").price(4500).quantity(2).options("{}").build());
        when(orderRepository.findByPaymentId("order-y")).thenReturn(Optional.of(order));
        when(portOneService.getPayment("order-y")).thenReturn(new PortOneService.PaymentInfo("PAID", 9000));

        sut.completeOrder("order-y");

        assertThat(order.getStatus()).isEqualTo(OrderStatus.PAID);
        verify(notificationService).createNotification(eq("NEW_ORDER"), any(), any(), any());
    }
}
