'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore'; 
import { CheckCircle, ShoppingBag, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import styles from '../Checkout.module.css';
import Navbar from '@/components/landing/Navbar';
import { fetchAPI } from '@/app/lib/api';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('paymentId') || searchParams.get('payment_id'); // V2 리다이렉트는 payment_id로 옴
    const [orderData, setOrderData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);


    const { clearCart, setCheckoutItems, syncWithServer } = useCartStore();

    useEffect(() => {
        // 1. 장바구니 비우기
        const cleanUp = async () => {
            await clearCart();
            setCheckoutItems([]);
            await syncWithServer();
        };
        cleanUp();

        // 2. 결제 완료 확정(PortOne 실결제 검증) 후 주문 데이터 상세 조회
        //    - 확정은 서버가 PortOne 결제 내역을 검증한 뒤에만 이루어진다.
        //    - 웹훅이 먼저 처리했다면 이미 PAID 상태이므로 이 호출은 무시된다.
        if (paymentId) {
            fetchAPI(`/orders/${paymentId}/complete`, { method: 'POST' })
                .catch(err => {
                    // 검증 실패/이미 확정 등은 이후 조회 결과로 사용자에게 상태를 보여준다.
                    console.warn('주문 확정 처리 응답:', err);
                })
                .finally(() => {
                    fetchAPI(`/orders/${paymentId}`)
                        .then(data => {
                            setOrderData(data);
                            setIsLoading(false);
                        })
                        .catch(err => {
                            console.error('주문 정보 조회 실패:', err);
                            setIsLoading(false);
                        });
                });
        }
    }, [paymentId, clearCart, setCheckoutItems, syncWithServer]);

    if (isLoading) {
        return (
            <div className={styles.resultContainer}>
                <div className={styles.spinner} />
                <p>주문 정보를 불러오는 중입니다... 🐤</p>
            </div>
        );
    }

    return (
        <div className={styles.resultContainer}>
            <div className={styles.successIconWrapper}>
                <img 
                    src="/images/success-duck.png" 
                    alt="Success Duck" 
                    className={styles.successIconImg}
                />
            </div>
            <h1 className={styles.resultTitle}>결제가 완료되었습니다! 🐤</h1>
            <p className={styles.resultDesc}>
                주문이 정상적으로 접수되었습니다. <br />
                맛있는 고라파덕 메뉴를 곧 준비해 드릴게요!
            </p>

            <div className={styles.orderDetailCard}>
                {/* 주문 기본 정보 */}
                <div className={styles.detailHeader}>
                    <ShoppingBag size={20} />
                    <span>주문 상세 내역</span>
                </div>

                {/* 주문 상품 목록 */}
                <div className={styles.detailItemList}>
                    {orderData?.items?.map((item: any, idx: number) => {
                        const options = item.options ? JSON.parse(item.options) : {};
                        return (
                            <div key={idx} className={styles.detailItem}>
                                <div className={styles.detailItemInfo}>
                                    <span className={styles.detailItemName}>{item.korName}</span>
                                    <span className={styles.detailItemQty}>{item.quantity}개</span>
                                    {Object.keys(options).length > 0 && (
                                        <p className={styles.detailItemOpts}>
                                            {Object.entries(options).map(([k, v]) => `${k}: ${v}`).join(' / ')}
                                        </p>
                                    )}
                                </div>
                                <span className={styles.detailItemPrice}>
                                    {(item.price * item.quantity).toLocaleString()}원
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* 배송/수령 정보 */}
                <div className={styles.detailSection}>
                    <div className={styles.detailRow}>
                        <div className={styles.detailLabel}>
                            <MapPin size={16} /> 수령지
                        </div>
                        <div className={styles.detailValue}>{orderData?.address}</div>
                    </div>
                    <div className={styles.detailRow}>
                        <div className={styles.detailLabel}>
                            <CreditCard size={16} /> 결제수단
                        </div>
                        <div className={styles.detailValue}>온라인 결제 완료</div>
                    </div>

                    {orderData?.usedPoints > 0 && (
                        <div className={`${styles.detailRow} ${styles.pointDiscountRow}`} style={{ borderTop: '1px dashed #eee', paddingTop: '10px', marginTop: '10px' }}>
                            <div className={styles.detailLabel}>
                                 포인트 할인 🐥
                            </div>
                            <div className={styles.detailValue}>
                                - {orderData.usedPoints.toLocaleString()} P
                            </div>
                        </div>
                    )}
                </div>

                {/* 합계 */}
                <div className={styles.detailFooter}>
                    <div className={styles.totalLabel}>총 결제금액</div>
                    <div className={styles.totalValue}>
                        {orderData?.totalPrice?.toLocaleString()}원
                    </div>
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <button 
                    className={styles.homeBtn} 
                    onClick={() => router.push(`/orders/${paymentId}`)}
                    style={{ background: '#ca8a04', color: 'white', border: 'none', fontWeight: 800 }}
                >
                    📱 주문 현황 보기
                </button>
                <button className={styles.homeBtn} onClick={() => router.push('/')}>
                    홈으로 이동
                </button>
                <button className={`${styles.homeBtn} ${styles.secondary}`} onClick={() => router.push('/menus')}>
                    추가 주문하기
                </button>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <main className={styles.main}>
            <Navbar />
            <Suspense fallback={<div className={styles.resultContainer}>로딩 중...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
