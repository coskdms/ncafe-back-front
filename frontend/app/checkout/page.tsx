'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { ChevronLeft, CreditCard, Ship, MapPin, User, Phone, MessageSquare, Loader2 } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import styles from './Checkout.module.css';
import Script from 'next/script';
import { fetchAPI } from '@/app/lib/api';

declare global {
    interface Window {
        PortOne: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { checkoutItems, getCheckoutTotalPrice } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // 개인정보 폼 상태 (기본값 설정)
    const [formData, setFormData] = useState({
        receiver: '',
        phone: '',
        address: '',
        memo: ''
    });

    useEffect(() => {
        setIsMounted(true);
        // 로그인 정보가 있으면 자동 채우기
        if (user) {
            setFormData(prev => ({
                ...prev,
                receiver: user.nickname || '',
            }));
        }
    }, [user]);

    // 보안: 체크아웃할 아이템이 없으면 메인이나 장바구니로 리다이렉트
    useEffect(() => {
        if (isMounted && checkoutItems.length === 0) {
            router.replace('/cart');
        }
    }, [isMounted, checkoutItems, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const totalPrice = getCheckoutTotalPrice();
    const deliveryFee = isAuthenticated ? 0 : 3000;
    const finalPrice = totalPrice + deliveryFee;

    const handlePayment = async () => {
        if (isProcessing) return;

        // 폼 유효성 검사
        if (!formData.receiver || !formData.phone || !formData.address) {
            alert('수령인 정보와 주소를 모두 입력해주세요! 🐤');
            return;
        }

        setIsProcessing(true);

        try {
            // 1. 서버에 주문 생성 시도 (PENDING)
            const orderRes = await fetchAPI('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    receiverName: formData.receiver,
                    receiverPhone: formData.phone,
                    address: formData.address,
                    memo: formData.memo,
                    items: checkoutItems.map(item => ({
                        menuId: item.menuId,
                        korName: item.korName,
                        price: item.price,
                        quantity: item.quantity,
                        options: item.options
                    }))
                })
            });

            if (!orderRes || !orderRes.paymentId) {
                throw new Error('주문 생성에 실패했습니다.');
            }

            // 2. 포트원 V2 결제 요청
            const response = await window.PortOne.requestPayment({
                storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
                channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
                paymentId: orderRes.paymentId,
                orderName: checkoutItems.length > 1
                    ? `${checkoutItems[0].korName} 외 ${checkoutItems.length - 1}건`
                    : checkoutItems[0].korName,
                totalAmount: finalPrice,
                currency: "CURRENCY_KRW",
                payMethod: "EASY_PAY", // 카카오페이 등 간편결제
                customer: {
                    fullName: formData.receiver,
                    phoneNumber: formData.phone,
                },
                redirectUrl: `${window.location.origin}/checkout/success` // 모바일 환경 대응
            });

            // 3. 결제 결과 처리
            if (response.code != null) {
                // 결제 실패
                router.push(`/checkout/fail?error_msg=${encodeURIComponent(response.message || '결제가 취소되었습니다.')}`);
            } else {
                // 결제 성공 (브라우저 환경)
                router.push(`/checkout/success?paymentId=${response.paymentId}`);
            }

        } catch (error: any) {
            console.error('Payment Error:', error);
            alert(error.message || '결제 준비 중 오류가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isMounted || checkoutItems.length === 0) return null;

    return (
        <main className={styles.main}>
            {/* 포트원 V2 SDK 스크립트 추가 */}
            <Script src="https://cdn.portone.io/v2/browser-sdk.js" />
            <Navbar />

            <div className={styles.checkoutContainer}>
                <div className={styles.backLink} onClick={() => router.back()}>
                    <ChevronLeft size={18} />
                    이전 단계로 돌아가기
                </div>

                <h1 className={styles.title}>
                    <CreditCard size={32} color="#ca8a04" />
                    주문 확인 및 결제
                </h1>

                <div className={styles.checkoutLayout}>
                    {/* 왼쪽: 정보 입력 섹션 */}
                    <div className={styles.infoSection}>
                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <User size={20} /> 주문자 / 수령인 정보
                            </h2>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>수령인 이름</label>
                                <input
                                    type="text"
                                    name="receiver"
                                    value={formData.receiver}
                                    onChange={handleInputChange}
                                    placeholder="이름을 입력해주세요"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>연락처</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="010-0000-0000"
                                    className={styles.input}
                                />
                            </div>
                        </section>

                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <MapPin size={20} /> 배송지 / 픽업 정보
                            </h2>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>배송 주소 (또는 픽업 매장명)</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="정확한 주소 또는 매장명을 입력해주세요"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>요청 사항</label>
                                <textarea
                                    name="memo"
                                    value={formData.memo}
                                    onChange={handleInputChange}
                                    placeholder="카페에 전달할 메시지를 적어주세요 (예: 얼음 많이 주세요!)"
                                    className={styles.input}
                                    style={{ height: '80px', resize: 'none' }}
                                />
                            </div>
                        </section>

                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <Ship size={20} /> 주문 상품 상세 ({checkoutItems.length})
                            </h2>
                            <div className={styles.itemList}>
                                {checkoutItems.map((item, idx) => (
                                    <div key={`${item.id}-${idx}`} className={styles.orderItem}>
                                        <img
                                            src={item.imageSrc ? `/images/${item.imageSrc}` : '/images/blank.png'}
                                            alt={item.korName}
                                            className={styles.itemImage}
                                        />
                                        <div className={styles.itemDetail}>
                                            <h3 className={styles.itemName}>{item.korName}</h3>
                                            {item.options && (
                                                <p className={styles.itemOptions}>
                                                    {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(' / ')}
                                                </p>
                                            )}
                                            <div className={styles.itemBottom}>
                                                <span className={styles.itemPrice}>{item.price.toLocaleString()}원</span>
                                                <span className={styles.itemQuantity}>{item.quantity}개</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 오른쪽: 결제 요약 */}
                    <aside className={styles.summaryCard}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>최종 결제 금액</h2>

                            <div className={styles.summaryRow}>
                                <span>상품 금액</span>
                                <span>{totalPrice.toLocaleString()}원</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>배송비</span>
                                <span>{isAuthenticated ? '무료' : deliveryFee.toLocaleString() + '원'}</span>
                            </div>

                            <div className={styles.totalRow}>
                                <span>총 결제 예정액</span>
                                <span>{finalPrice.toLocaleString()}원</span>
                            </div>

                            <button
                                className={styles.paymentBtn}
                                onClick={handlePayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <Loader2 className={styles.spinner} size={22} />
                                ) : (
                                    <CreditCard size={22} />
                                )}
                                {finalPrice.toLocaleString()}원 결제하기
                            </button>

                            <p style={{
                                marginTop: '20px',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                                color: '#92400e',
                                lineHeight: 1.5
                            }}>
                                위 주문 정보를 확인하였으며, <br />
                                결제 진행에 동의합니다.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </main>
    );
}
