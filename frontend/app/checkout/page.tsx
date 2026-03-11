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
    const [orderType, setOrderType] = useState<'DINE_IN' | 'PICK_UP' | 'DELIVERY'>('DELIVERY');
    const [formData, setFormData] = useState({
        receiver: '',
        phone: '',
        address: '',
        memo: ''
    });

    const [availablePoints, setAvailablePoints] = useState(0);
    const [pointsToUse, setPointsToUse] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'KAKAO'>('CARD'); // CARD: KG, KAKAO: 카카오


    useEffect(() => {
        setIsMounted(true);
        // 로그인 정보가 있으면 자동 채우기 및 포인트 조회
        if (user) {
            setFormData(prev => ({
                ...prev,
                receiver: user.nickname || '',
            }));
            
            // 보유 포인트 및 회원 정보(주소, 연락처) 조회
            import('@/app/lib/api').then(({ memberAPI }) => {
                memberAPI.getGrowthInfo().then(data => {
                    if (data) {
                        setAvailablePoints(data.currentPoints || 0);
                        // 마이페이지에 저장된 기본 정보가 있다면 자동 세팅
                        setFormData(prev => ({
                            ...prev,
                            address: data.address || prev.address,
                            phone: data.phone || prev.phone
                        }));
                    }
                });
            });
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

    const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 0;
        const maxSpend = Math.min(val, availablePoints, totalPrice + deliveryFee);
        setPointsToUse(Math.max(0, maxSpend));
    };

    const handleUseAllPoints = () => {
        const maxSpend = Math.min(availablePoints, totalPrice + deliveryFee);
        setPointsToUse(maxSpend);
    };

    const totalPrice = getCheckoutTotalPrice();
    const deliveryFee = (orderType === 'DELIVERY') ? (isAuthenticated ? 0 : 3000) : 0;
    const finalPrice = Math.max(0, totalPrice + deliveryFee - pointsToUse);

    const handlePayment = async () => {
        if (isProcessing) return;

        // 폼 유효성 검사
        if (orderType === 'DINE_IN') {
            if (!formData.receiver) {
                alert('닉네임(이름)을 입력해주세요! 🐤');
                return;
            }
        } else if (orderType === 'PICK_UP') {
            if (!formData.receiver || !formData.phone) {
                alert('수령인 이름과 연락처를 모두 입력해주세요! 🐤');
                return;
            }
        } else if (orderType === 'DELIVERY') {
            if (!formData.receiver || !formData.phone || !formData.address) {
                alert('수령인 정보와 주소를 모두 입력해주세요! 🐤');
                return;
            }
        }

        setIsProcessing(true);

        try {
            // 1. 서버에 주문 생성 시도 (PENDING)
            const orderRes = await fetchAPI('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    receiverName: formData.receiver,
                    receiverPhone: orderType === 'DINE_IN' ? '' : formData.phone,
                    address: orderType === 'DELIVERY' ? formData.address : (orderType === 'PICK_UP' ? '매장 픽업' : '매장 식사'),
                    memo: orderType === 'DELIVERY' ? formData.memo : '',
                    type: orderType,
                    usedPoints: pointsToUse,
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

            // 💰 2-1. 0원 결제 처리 (포인트 전액 결제 등)
            // 포트원 V2는 0원 결제를 지원하지 않으므로, 백엔드에서 이미 처리했을 거라 믿고 즉시 이동합니다.
            if (finalPrice === 0) {
                router.push(`/checkout/success?paymentId=${orderRes.paymentId}`);
                return;
            }

            // 2-2. 포트원 V2 결제 요청
            const kakaoKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
            const kgKey = process.env.NEXT_PUBLIC_PORTONE_KG_CHANNEL_KEY;
            
            const channelKey = paymentMethod === 'KAKAO' ? kakaoKey : kgKey;

            if (!channelKey) {
                throw new Error(`${paymentMethod === 'KAKAO' ? '카카오페이' : '카드결제'} 채널 키가 설정되지 않았습니다. .env 파일을 확인해주세요.`);
            }

            // KG 이니시스 등 일부 PG사는 휴대폰 번호에 하이픈(-)이 있으면 파싱 에러가 날 수 있음
            const sanitizedPhone = formData.phone.replace(/[^0-9]/g, '');

            // KG 이니시스 V2에서 "지원하지 않는 기능" 에러는 
            // 보통 payMethod가 "CARD"일 때 추가적인 파라미터 충돌이나 
            // 필수 필드 누락(특히 고객 이메일 등) 혹은 redirectUrl의 프로토콜 문제일 수 있습니다.
            const paymentData: any = {
                storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
                channelKey: channelKey,
                paymentId: orderRes.paymentId,
                orderName: checkoutItems.length > 1
                    ? `${checkoutItems[0].korName} 외 ${checkoutItems.length - 1}건`
                    : checkoutItems[0].korName,
                totalAmount: finalPrice,
                currency: "CURRENCY_KRW",
                customer: {
                    fullName: formData.receiver || '구매자',
                    email: (user as any)?.email || 'customer@example.com', // 이니시스 V2 필수 이메일
                    phoneNumber: sanitizedPhone || '01000000000', // 이니시스 V2 필수 휴대폰 번호 📱
                },

                redirectUrl: `${window.location.origin}/checkout/success`
            };



            // 카카오페이(EASY_PAY)와 일반카드(CARD)의 payMethod 구분
            if (paymentMethod === 'KAKAO') {
                paymentData.payMethod = "EASY_PAY";
            } else {
                // KG 이니시스 V2의 경우 channelKey에 이미 수단이 포함되어 있으면 
                // payMethod를 명시하지 않거나 "CARD"로 명시합니다. 
                // 일부 환경에서는 명시하지 않는 것이 더 안정적일 수 있습니다.
                paymentData.payMethod = "CARD";
            }

            console.log('Sending Payment Request:', JSON.stringify(paymentData, null, 2));

            const response = await window.PortOne.requestPayment(paymentData);





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
                                <Ship size={20} /> 주문 유형 선택
                            </h2>
                            <div className={styles.typeSelector}>
                                <button
                                    className={`${styles.typeBtn} ${orderType === 'DINE_IN' ? styles.active : ''}`}
                                    onClick={() => setOrderType('DINE_IN')}
                                >
                                    매장 식사
                                </button>
                                <button
                                    className={`${styles.typeBtn} ${orderType === 'PICK_UP' ? styles.active : ''}`}
                                    onClick={() => setOrderType('PICK_UP')}
                                >
                                    포장 / 픽업
                                </button>
                                <button
                                    className={`${styles.typeBtn} ${orderType === 'DELIVERY' ? styles.active : ''}`}
                                    onClick={() => setOrderType('DELIVERY')}
                                >
                                    배송 주문
                                </button>
                            </div>
                        </section>

                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <User size={20} /> {orderType === 'DINE_IN' ? '닉네임 정보' : '주문자 / 수령인 정보'}
                            </h2>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{orderType === 'DINE_IN' ? '닉네임' : '수령인 이름'}</label>
                                <input
                                    type="text"
                                    name="receiver"
                                    value={formData.receiver}
                                    onChange={handleInputChange}
                                    placeholder={orderType === 'DINE_IN' ? '닉네임을 입력해주세요' : '이름을 입력해주세요'}
                                    className={styles.input}
                                />
                            </div>
                            {(orderType === 'PICK_UP' || orderType === 'DELIVERY') && (
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
                            )}
                        </section>

                        {orderType === 'DELIVERY' && (
                            <section className={styles.card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                    <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>
                                        <MapPin size={20} /> 배송지 정보
                                    </h2>
                                    {isAuthenticated && (
                                        <button 
                                            className={styles.useAllBtn}
                                            style={{ fontSize: '11px', padding: '4px 10px' }}
                                            onClick={() => {
                                                import('@/app/lib/api').then(({ memberAPI }) => {
                                                    memberAPI.getGrowthInfo().then(data => {
                                                        if (data.address || data.phone) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                address: data.address || prev.address,
                                                                phone: data.phone || prev.phone
                                                            }));
                                                            alert('마이페이지에서 정보를 불러왔습니다! 🐥');
                                                        } else {
                                                            alert('저장된 기본 정보가 없습니다. 마이페이지에서 먼저 저장해주세요! 🐤');
                                                        }
                                                    });
                                                });
                                            }}
                                        >
                                            기본 정보 불러오기
                                        </button>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>배송 주소</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="정확한 주소를 입력해주세요"
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
                        )}

                        {isAuthenticated && (
                            <section className={styles.card}>
                                <h2 className={styles.cardTitle}>
                                    <MessageSquare size={20} /> 파덕 포인트 사용 🐥
                                </h2>
                                <div className={styles.pointsActionArea}>
                                    <div className={styles.pointsStatus}>
                                        보유 포인트: <strong>{availablePoints.toLocaleString()} P</strong>
                                    </div>
                                    <div className={styles.pointsInputRow}>
                                        <input
                                            type="number"
                                            value={pointsToUse || ''}
                                            onChange={handlePointsChange}
                                            placeholder="사용할 포인트를 입력하세요"
                                            className={styles.pointInput}
                                        />
                                        <button 
                                            className={styles.useAllBtn}
                                            onClick={handleUseAllPoints}
                                        >
                                            전액 사용
                                        </button>
                                    </div>
                                    <p className={styles.pointNote}>* 결제 금액의 100%까지 사용 가능합니다.</p>
                                </div>
                            </section>
                        )}

                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <CreditCard size={20} /> 결제 수단 선택
                            </h2>
                            <div className={styles.methodSelector}>
                                <button 
                                    className={`${styles.methodBtn} ${paymentMethod === 'CARD' ? styles.active : ''}`}
                                    onClick={() => setPaymentMethod('CARD')}
                                >
                                    <CreditCard size={24} color={paymentMethod === 'CARD' ? "#f59e0b" : "#78350f"} />
                                    <span>일반 결제 (카드)</span>
                                </button>
                                <button 
                                    className={`${styles.methodBtn} ${paymentMethod === 'KAKAO' ? styles.active : ''}`}
                                    onClick={() => setPaymentMethod('KAKAO')}
                                >
                                    <div className={styles.paymentIcon}>
                                        <span style={{ fontSize: '20px' }}>💬</span>
                                    </div>
                                    <span>카카오페이</span>
                                </button>
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

                            {pointsToUse > 0 && (
                                <div className={styles.summaryRow} style={{ color: '#dc2626', fontWeight: 700 }}>
                                    <span>포인트 할인</span>
                                    <span>- {pointsToUse.toLocaleString()} P</span>
                                </div>
                            )}

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
