'use client';

import React, { useEffect, useState } from 'react';
import styles from './MyPage.module.css';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { memberAPI, orderAPI, fetchAPI } from '@/app/lib/api';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

declare global {
    interface Window {
        PortOne: any;
    }
}

interface GrowthInfo {
    nickname: string;
    currentLevel: string;
    currentPoints: number;
    totalAccumulatedPoints: number;
    nextLevel: string;
    nextGoal: number;
    remainingForNext: number;
}

interface OrderItem {
    id: number;
    menuId: number;
    korName: string;
    price: number;
    quantity: number;
    options: string;
}

interface Order {
    id: number;
    paymentId: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
}

export default function MyPage() {
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
    const { addItem } = useCartStore();
    const router = useRouter();
    
    const [growthInfo, setGrowthInfo] = useState<GrowthInfo | null>(null);
    const [shopSettings, setShopSettings] = useState<any>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

    // 설정 관련 상태
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAuthenticated) {
            fetchMyData();
        }
    }, [isAuthenticated, isAuthLoading]);

    const fetchMyData = async () => {
        setIsLoading(true);
        try {
            const [growthData, ordersData, settingsData] = await Promise.all([
                memberAPI.getGrowthInfo(),
                orderAPI.getMyOrders(),
                fetchAPI('/settings')
            ]);
            setGrowthInfo(growthData);
            setOrders(ordersData);
            setShopSettings(settingsData);
            if (growthData.address) setAddress(growthData.address);
            if (growthData.phone) setPhone(growthData.phone);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleOrderExpansion = (orderId: number) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await memberAPI.updateProfile(address, phone);
            alert('기본 정보가 저장되었습니다. 🐤');
            fetchMyData();
        } catch (error: any) {
            alert(error.message || '정보 수정에 실패했습니다.');
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            await memberAPI.updatePassword(currentPassword, newPassword);
            alert('비밀번호가 변경되었습니다. 🔐');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            alert(error.message || '비밀번호 변경에 실패했습니다.');
        }
    };

    const handleCancelOrder = async (paymentId: string) => {
        if (!confirm('정말로 주문을 취소하시겠어요? 사용된 포인트는 반환되고 적립된 포인트는 회수됩니다. 🐤')) {
            return;
        }

        try {
            await orderAPI.cancelOrder(paymentId);
            alert('주문이 취소되었습니다. 🐣');
            fetchMyData(); // 데이터 새로고침 (포인트, 등급, 주문 목록 갱신)
        } catch (error: any) {
            alert(error.message || '취소 처리에 실패했습니다. 고객센터로 문의해주세요.');
        }
    };

    const handlePayNow = async (order: Order) => {
        const { PortOne } = window;
        if (!PortOne) {
            alert('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요. 🐥');
            return;
        }

        try {
            const orderName = order.items[0].korName + (order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : '');
            
            // 재결제 시에도 고객 정보(이메일, 연락처) 누락 시 이니시스 등에서 에러 발생 가능
            const response = await PortOne.requestPayment({
                storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
                channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!, // 기본 카카오 채널
                paymentId: order.paymentId,
                orderName: orderName,
                totalAmount: order.totalPrice,
                currency: 'CURRENCY_KRW',
                payMethod: 'EASY_PAY',
                customer: {
                    fullName: user?.nickname || '회원',
                    email: (user as any)?.email || 'customer@example.com',
                    phoneNumber: (user as any)?.phone?.replace(/[^0-9]/g, '') || '01000000000'
                },
                redirectUrl: `${window.location.origin}/checkout/success?paymentId=${order.paymentId}`
            });


            if (response.code != null) {
                // 결제창 닫힘 혹은 실패
                alert('결제가 중단되었거나 실패했습니다. 다시 시도해주세요.');
                return;
            }

            // 결제 성공 (V2는 결과가 서버로 가거나 리다이렉트됨)
            router.push(`/checkout/success?paymentId=${order.paymentId}`);
        } catch (error) {
            console.error('Payment Error:', error);
            alert('결제 처리 중 오류가 발생했습니다.');
        }
    };

    const handleReorder = async (order: Order) => {
        try {
            for (const item of order.items) {
                let parsedOptions = {};
                try {
                    parsedOptions = item.options ? JSON.parse(item.options) : {};
                } catch (e) {
                    console.error('Failed to parse options', e);
                }

                await addItem({
                    menuId: item.menuId,
                    korName: item.korName,
                    price: item.price,
                    options: parsedOptions
                });
            }
            alert('이전 주문 상품들을 장바구니에 담았어요! 🐤 장바구니로 이동합니다.');
            router.push('/cart');
        } catch (error) {
            console.error('Reorder error:', error);
            alert('재주문 처리 중 오류가 발생했습니다.');
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return '결제 대기';
            case 'PAID': return '결제 완료';
            case 'CANCELLED': return '취소됨';
            case 'PREPARING': return '준비 중';
            case 'READY': return '수령 대기';
            case 'COMPLETED': return '수령 완료';
            default: return status;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return styles.statusPending;
            case 'PAID': return styles.statusPaid;
            case 'CANCELLED': return styles.statusCancelled;
            default: return styles.statusPaid;
        }
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className={styles.main}>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.emptyState}>파덕이가 데이터를 가져오고 있어요... 🐤</div>
                </div>
                <Footer />
            </div>
        );
    }

    const progress = growthInfo ? (growthInfo.totalAccumulatedPoints / growthInfo.nextGoal) * 100 : 0;

    return (
        <div className={styles.main}>
            <Navbar />
            
            <main className={styles.container}>
                <h1 className={styles.title}>내 정보 🐥</h1>

                {/* 프로필 카드 */}
                <div className={styles.profileCard}>
                    <div className={styles.profileInfo}>
                        <div className={styles.welcomeText}>반가워요, {user?.nickname}님!</div>
                        <div className={styles.levelBadge}>{growthInfo?.currentLevel || 'Lv.1 갓 태어난 알'}</div>
                    </div>
                    <div className={styles.pointsContainer}>
                        <div className={styles.pointLabel}>보유 포인트</div>
                        <div className={styles.pointValue}>{growthInfo?.currentPoints.toLocaleString()} P</div>
                    </div>
                </div>

                {/* 고라파덕 성장 가이드 (진화 타임라인) */}
                {growthInfo && shopSettings && (
                    <div className={styles.growthSection}>
                        <div className={styles.growthTitle}>
                            고라파덕 성장 가이드 🐣
                        </div>
                        <p className={styles.growthDesc}>포인트를 모을수록 파덕이가 멋지게 성장해요!</p>
                        
                        <div className={styles.evolutionContainer}>
                            {/* 타임라인 배경 라인 */}
                            <div className={styles.evolutionTimeline}>
                                <div 
                                    className={styles.evolutionProgress} 
                                    style={{ width: `${Math.min(100, (growthInfo.totalAccumulatedPoints / shopSettings.level4Threshold) * 100)}%` }}
                                ></div>
                            </div>

                            {[
                                { id: 1, name: '알', points: `${shopSettings.level1Threshold.toLocaleString()} P`, img: '/images/growth/stage_1.png', threshold: shopSettings.level1Threshold },
                                { id: 2, name: '아기 파덕', points: `${shopSettings.level2Threshold.toLocaleString()} P`, img: '/images/growth/stage_2.png', threshold: shopSettings.level2Threshold },
                                { id: 3, name: '청소년 골덕', points: `${shopSettings.level3Threshold.toLocaleString()} P`, img: '/images/growth/stage_3.png', threshold: shopSettings.level3Threshold },
                                { id: 4, name: '현자 파덕', points: `${shopSettings.level4Threshold.toLocaleString()} P`, img: '/images/growth/stage_4.png', threshold: shopSettings.level4Threshold }
                            ].map((stage, idx) => {
                                const isReached = growthInfo.totalAccumulatedPoints >= stage.threshold;
                                
                                // 현재 등급 판단
                                const isCurrent = idx === 3 
                                    ? growthInfo.totalAccumulatedPoints >= shopSettings.level4Threshold
                                    : (growthInfo.totalAccumulatedPoints >= stage.threshold && growthInfo.totalAccumulatedPoints < [shopSettings.level2Threshold, shopSettings.level3Threshold, shopSettings.level4Threshold][idx]);

                                return (
                                    <div 
                                        key={stage.id} 
                                        className={`${styles.stageWrapper} ${isReached ? styles.reachedStage : ''} ${isCurrent ? styles.activeStage : ''}`}
                                    >
                                        <div className={styles.stageImageContainer}>
                                            <img src={stage.img} alt={stage.name} className={styles.stageImage} />
                                        </div>
                                        <div className={styles.stageLabel}>{stage.name}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 등급 정보 카드 */}
                        <div className={styles.gradeInfoRow}>
                            {[
                                { name: 'Lv.1 알', point: `${shopSettings.level1Threshold.toLocaleString()} ~ ${(shopSettings.level2Threshold - 1).toLocaleString()} P` },
                                { name: 'Lv.2 아기', point: `${shopSettings.level2Threshold.toLocaleString()} ~ ${(shopSettings.level3Threshold - 1).toLocaleString()} P` },
                                { name: 'Lv.3 청소년', point: `${shopSettings.level3Threshold.toLocaleString()} ~ ${(shopSettings.level4Threshold - 1).toLocaleString()} P` },
                                { name: 'Lv.4 현자', point: `${shopSettings.level4Threshold.toLocaleString()} P ~` }
                            ].map((grade, idx) => {
                                const isCurrent = idx === 3 
                                    ? growthInfo.totalAccumulatedPoints >= shopSettings.level4Threshold
                                    : (growthInfo.totalAccumulatedPoints >= [shopSettings.level1Threshold, shopSettings.level2Threshold, shopSettings.level3Threshold][idx] && growthInfo.totalAccumulatedPoints < [shopSettings.level2Threshold, shopSettings.level3Threshold, shopSettings.level4Threshold][idx]);

                                return (
                                    <div key={idx} className={`${styles.gradeCard} ${isCurrent ? styles.highlight : ''}`}>
                                        <div className={styles.gradeName}>{grade.name}</div>
                                        <div className={styles.gradePoint}>{grade.point}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {growthInfo.nextGoal > 0 && growthInfo.totalAccumulatedPoints < shopSettings.level4Threshold && (
                            <p className={styles.remainingText} style={{ marginTop: '30px' }}>
                                다음 진화까지 <strong>{growthInfo.remainingForNext.toLocaleString()} P</strong> 남았어요! 화이팅! 🐥🔥
                            </p>
                        )}
                    </div>
                )}

                {/* 탭 메뉴 */}
                <div className={styles.tabContainer}>
                    <div 
                        className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        주문 내역
                    </div>
                    <div 
                        className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        정보 수정
                    </div>
                </div>

                {activeTab === 'orders' ? (
                    <section>
                        {orders.length === 0 ? (
                            <div className={styles.emptyState}>
                                아직 주문한 내역이 없어요. <br/>
                                맛있는 메뉴를 구경해볼까요? 🐤
                            </div>
                        ) : (
                            <div className={styles.orderList}>
                                {orders.map((order) => (
                                    <div key={order.id} className={styles.orderCard}>
                                        <div 
                                            className={styles.expandableHeader}
                                            onClick={() => toggleOrderExpansion(order.id)}
                                        >
                                            <div className={styles.orderHeader}>
                                                <div className={styles.orderDate}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                    <span style={{ marginLeft: '10px', fontSize: '12px', color: '#94a3b8' }}>
                                                        {order.paymentId}
                                                    </span>
                                                </div>
                                                <span className={`${styles.statusBadge} ${getStatusStyle(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>

                                            <div className={styles.itemSummary}>
                                                <div className={styles.itemNameMain}>
                                                    {order.items[0]?.korName}
                                                    {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                                                    <span style={{ fontSize: '14px', marginLeft: '8px', color: '#f59e0b' }}>
                                                        {expandedOrders.has(order.id) ? '▲ 닫기' : '▼ 상세보기'}
                                                    </span>
                                                </div>
                                                {!expandedOrders.has(order.id) && (
                                                    <span className={styles.itemCountText}>
                                                        총 {order.items.reduce((acc, item) => acc + item.quantity, 0)}개 상품
                                                    </span>
                                                )}
                                            </div>

                                            {expandedOrders.has(order.id) && (
                                                <div className={styles.orderItemsList}>
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className={styles.orderItemRow}>
                                                            <div className={styles.itemInfo}>
                                                                <div>{item.korName}</div>
                                                                {item.options && (
                                                                    <div className={styles.itemOptions}>
                                                                        {Object.entries(JSON.parse(item.options)).map(([key, val]: [string, any]) => (
                                                                            <span key={key}>{key}: {val} </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className={styles.itemPriceQty}>
                                                                {item.price.toLocaleString()}원 / {item.quantity}개
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.orderFooter}>
                                            <div className={styles.totalPrice}>{order.totalPrice.toLocaleString()}원</div>
                                            <div className={styles.actionBtns}>
                                                {order.status === 'PENDING' && (
                                                    <button 
                                                        className={styles.reorderBtn}
                                                        style={{ background: '#f59e0b', color: 'white', borderColor: '#f59e0b' }}
                                                        onClick={() => handlePayNow(order)}
                                                    >
                                                        바로 결제
                                                    </button>
                                                )}
                                                <button 
                                                    className={styles.reorderBtn}
                                                    onClick={() => handleReorder(order)}
                                                >
                                                    재주문
                                                </button>
                                                {order.status === 'PAID' && 
                                                 (new Date().getTime() - new Date(order.createdAt).getTime() < 24 * 60 * 60 * 1000) && (
                                                    <button 
                                                        className={styles.cancelBtn}
                                                        onClick={() => handleCancelOrder(order.paymentId)}
                                                    >
                                                        취소하기
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                ) : (
                    <section className={styles.settingsSection}>
                        <form onSubmit={handleUpdateProfile} className={styles.settingsGroup}>
                            <h3>기본 배송 정보 🏠</h3>
                            <div className={styles.inputGroup}>
                                <label>기본 배송 주소</label>
                                <input 
                                    type="text" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    placeholder="배송받으실 주소를 입력해주세요"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>연락처</label>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    placeholder="010-0000-0000"
                                />
                            </div>
                            <button type="submit" className={styles.saveBtn}>정보 저장하기 🐤</button>
                        </form>

                        <form onSubmit={handleUpdatePassword} className={styles.settingsGroup} style={{ marginTop: '40px' }}>
                            <h3>비밀번호 변경 🔐</h3>
                            <div className={styles.inputGroup}>
                                <label>현재 비밀번호</label>
                                <input 
                                    type="password" 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>새 비밀번호</label>
                                <input 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>새 비밀번호 확인</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.saveBtn}>비밀번호 변경하기 🐥</button>
                        </form>
                    </section>
                )}
            </main>

            <Footer />
            <Script src="https://cdn.portone.io/v2/browser-sdk.js" />
        </div>
    );
}
