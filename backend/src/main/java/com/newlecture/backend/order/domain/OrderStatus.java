package com.newlecture.backend.order.domain;

public enum OrderStatus {
    PENDING,    // 결제 대기
    PAID,       // 결제 완료 (승인 성공)
    CANCELLED,  // 결제 취소
    PREPARING,  // 메뉴 준비 중
    COMPLETED,  // 수령 완료
    FAILED      // 결제 실패
}
