'use client';

import React, { useEffect, useState } from 'react';
import styles from './MyPage.module.css';
import { useAuthStore } from '@/stores/authStore';
import { Bell, ChevronDown, Sparkles, Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { memberAPI, orderAPI, fetchAPI, favoriteAPI } from '@/app/lib/api';
import { toast } from '@/stores/toastStore';
import { isValidPhone, isValidAddress, validatePassword } from '@/utils/validators';
import { openAddressSearch } from '@/utils/addressSearch';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getDefaultOptions } from '@/app/lib/menuOptions';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    accrualRate?: number;
    discount?: number;
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
    const { settings: shopSettings, fetchSettings: fetchShopSettings } = useSettingsStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'settings'>('orders');
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
    const [orderPage, setOrderPage] = useState(1);
    const ORDERS_PER_PAGE = 5;
    const [favoriteMenus, setFavoriteMenus] = useState<any[]>([]);
    const [isFavLoading, setIsFavLoading] = useState(false);
    const [selectedFavorites, setSelectedFavorites] = useState<Set<number>>(new Set());
    const { loadFavorites, toggleFavorite } = useFavoriteStore();

    // 결제 선택 모달 관련 상태
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'KAKAO'>('CARD');

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
            const [growthData, ordersData] = await Promise.all([
                memberAPI.getGrowthInfo(),
                orderAPI.getMyOrders(),
            ]);
            await fetchShopSettings();
            setGrowthInfo(growthData);
            setOrders(ordersData);
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
        if (phone && !isValidPhone(phone)) {
            toast.warning('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
            return;
        }
        if (address && !isValidAddress(address)) {
            toast.warning('주소를 5자 이상 입력해주세요.');
            return;
        }
        try {
            await memberAPI.updateProfile(address, phone);
            toast.success('기본 정보가 저장되었습니다. 🐤');
            fetchMyData();
        } catch (error: any) {
            toast.error(error.message || '정보 수정에 실패했습니다.');
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword) {
            toast.warning('현재 비밀번호를 입력해주세요.');
            return;
        }
        const pwValidation = validatePassword(newPassword);
        if (!pwValidation.isValid) {
            toast.warning(pwValidation.message);
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.warning('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            await memberAPI.updatePassword(currentPassword, newPassword);
            toast.success('비밀번호가 변경되었습니다. 🔐');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.message || '비밀번호 변경에 실패했습니다.');
        }
    };

    const handleCancelOrder = async (paymentId: string) => {
        if (!confirm('정말로 주문을 취소하시겠어요? 사용된 포인트는 반환되고 적립된 포인트는 회수됩니다. 🐤')) {
            return;
        }

        try {
            await orderAPI.cancelOrder(paymentId);
            toast.success('주문이 취소되었습니다. 🐣');
            fetchMyData(); // 데이터 새로고침 (포인트, 등급, 주문 목록 갱신)
        } catch (error: any) {
            toast.error(error.message || '취소 처리에 실패했습니다. 고객센터로 문의해주세요.');
        }
    };

    const handlePayNow = (order: Order) => {
        setSelectedOrder(order);
        setIsPaymentModalOpen(true);
    };

    const processPayment = async () => {
        if (!selectedOrder) return;

        const { PortOne } = window;
        if (!PortOne) {
            toast.info('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요. 🐥');
            return;
        }

        try {
            const orderName = selectedOrder.items[0].korName + (selectedOrder.items.length > 1 ? ` 외 ${selectedOrder.items.length - 1}건` : '');
            const kakaoKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
            const kgKey = process.env.NEXT_PUBLIC_PORTONE_KG_CHANNEL_KEY;
            const channelKey = paymentMethod === 'KAKAO' ? kakaoKey : kgKey;

            if (!channelKey) {
                toast.error('결제 채널 설정이 올바르지 않습니다.');
                return;
            }

            const response = await PortOne.requestPayment({
                storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
                channelKey: channelKey,
                paymentId: selectedOrder.paymentId,
                orderName: orderName,
                totalAmount: selectedOrder.totalPrice,
                currency: 'CURRENCY_KRW',
                payMethod: paymentMethod === 'KAKAO' ? 'EASY_PAY' : 'CARD',
                customer: {
                    fullName: user?.nickname || '회원',
                    email: (user as any)?.email || 'customer@example.com',
                    phoneNumber: (user as any)?.phone?.replace(/[^0-9]/g, '') || '01000000000'
                },
                redirectUrl: `${window.location.origin}/checkout/success?paymentId=${selectedOrder.paymentId}`
            });

            if (response.code != null) {
                toast.error('결제가 중단되었거나 실패했습니다. 다시 시도해주세요.');
                return;
            }

            router.push(`/checkout/success?paymentId=${selectedOrder.paymentId}`);
        } catch (error) {
            console.error('Payment Error:', error);
            toast.error('결제 처리 중 오류가 발생했습니다.');
        } finally {
            setIsPaymentModalOpen(false);
            setSelectedOrder(null);
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
            toast.success('이전 주문 상품들을 장바구니에 담았어요! 🐤 장바구니로 이동합니다.');
            router.push('/cart');
        } catch (error) {
            console.error('Reorder error:', error);
            toast.error('재주문 처리 중 오류가 발생했습니다.');
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
                    <h3 className={styles.growthTitle}>
                        <Sparkles size={20} color="#f59e0b" />
                        고라파덕 성장 가이드
                    </h3>
                    <p className={styles.growthDesc}>주문할수록 파덕이가 진화하고 더 큰 혜택을 드려요! 🐣✨</p>

                    {/* 현재 혜택 강조 배너 🎁 */}
                    {growthInfo && (
                        <div className={styles.benefitBanner}>
                            <div className={styles.benefitItem}>
                                <span className={styles.benefitLabel}>현재 적립 혜택</span>
                                <span className={styles.benefitValue}>{growthInfo.accrualRate}% 적립</span>
                            </div>
                            {growthInfo.discount && growthInfo.discount > 0 ? (
                                <div className={styles.benefitItem}>
                                    <span className={styles.benefitLabel}>주문 즉시 할인</span>
                                    <span className={styles.benefitValue}>{growthInfo.discount.toLocaleString()}원</span>
                                </div>
                            ) : (
                                <div className={styles.benefitItem}>
                                    <span className={styles.benefitLabel}>다음 할인 혜택</span>
                                    <span className={styles.benefitValue}>Lv.3부터 즉시 할인!</span>
                                </div>
                            )}
                        </div>
                    )}

                        
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
                                { name: 'Lv.1 알', point: `0 ~ ${(shopSettings.level2Threshold - 1).toLocaleString()} P`, perk: '1% 적립' },
                                { name: 'Lv.2 아기 파덕', point: `${shopSettings.level2Threshold.toLocaleString()} ~ ${(shopSettings.level3Threshold - 1).toLocaleString()} P`, perk: '2% 적립' },
                                { name: 'Lv.3 청소년 골덕', point: `${shopSettings.level3Threshold.toLocaleString()} ~ ${(shopSettings.level4Threshold - 1).toLocaleString()} P`, perk: '4% 적립 + 500원 할인' },
                                { name: 'Lv.4 현자 고라파덕', point: `${shopSettings.level4Threshold.toLocaleString()} P ~`, perk: '7% 적립 + 1,000원 할인' }
                            ].map((grade, idx) => {
                                const isCurrent = idx === 3 
                                    ? growthInfo.totalAccumulatedPoints >= shopSettings.level4Threshold
                                    : (growthInfo.totalAccumulatedPoints >= [0, shopSettings.level2Threshold, shopSettings.level3Threshold][idx] && growthInfo.totalAccumulatedPoints < [shopSettings.level2Threshold, shopSettings.level3Threshold, shopSettings.level4Threshold][idx]);

                                return (
                                    <div key={idx} className={`${styles.gradeCard} ${isCurrent ? styles.highlight : ''}`}>
                                        <div className={styles.gradeName}>{grade.name}</div>
                                        <div className={styles.gradePoint}>{grade.point}</div>
                                        <div className={styles.perkInfo}>{grade.perk}</div>
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
                        className={`${styles.tab} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
                        onClick={async () => {
                            setActiveTab('favorites');
                            setIsFavLoading(true);
                            try {
                                const ids: number[] = await favoriteAPI.getIds();
                                if (ids && ids.length > 0) {
                                    const menusRes = await fetchAPI('/menus');
                                    const allMenus = menusRes?.menus || [];
                                    setFavoriteMenus(allMenus.filter((m: any) => ids.includes(m.id)));
                                } else {
                                    setFavoriteMenus([]);
                                }
                            } catch { setFavoriteMenus([]); }
                            setIsFavLoading(false);
                        }}
                    >
                        ❤️ 찜 목록
                    </div>
                    <div 
                        className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        정보 수정
                    </div>
                </div>

                {activeTab === 'favorites' ? (
                    <section>
                        {isFavLoading ? (
                            <div className={styles.emptyState}>불러오는 중... 🐤</div>
                        ) : favoriteMenus.length === 0 ? (
                            <div className={styles.emptyState}>
                                아직 찜한 메뉴가 없어요! <br/>
                                메뉴를 둘러보면서 ❤️를 눌러보세요 🐤
                                <br/><br/>
                                <Link href="/menus" style={{
                                    display: 'inline-block',
                                    padding: '12px 28px',
                                    background: '#f59e0b',
                                    color: '#fff',
                                    borderRadius: '999px',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                }}>메뉴 보러가기</Link>
                            </div>
                        ) : (
                            <>
                                {/* 찜 목록 액션 바 */}
                                <div className={styles.favActionBar}>
                                    <label className={styles.favSelectAll}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFavorites.size === favoriteMenus.length && favoriteMenus.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedFavorites(new Set(favoriteMenus.map((m: any) => m.id)));
                                                } else {
                                                    setSelectedFavorites(new Set());
                                                }
                                            }}
                                        />
                                        전체 선택 ({selectedFavorites.size}/{favoriteMenus.length})
                                    </label>
                                    <div className={styles.favActions}>
                                        <button
                                            className={styles.favCartBtn}
                                            disabled={selectedFavorites.size === 0}
                                            onClick={async () => {
                                                const selected = favoriteMenus.filter((m: any) => selectedFavorites.has(m.id));
                                                let added = 0;
                                                for (const menu of selected) {
                                                    const firstImage = menu.imagesSrc ? menu.imagesSrc.split(',')[0].trim() : 'blank.png';
                                                    const defaults = await getDefaultOptions(menu.id);
                                                    await addItem({
                                                        menuId: menu.id,
                                                        korName: menu.korName,
                                                        price: menu.price + (defaults?.additionalPrice || 0),
                                                        imageSrc: firstImage,
                                                        options: defaults?.options,
                                                    });
                                                    added++;
                                                }
                                                setSelectedFavorites(new Set());
                                                toast.success(`${added}개 메뉴를 장바구니에 담았습니다! 🛒`);
                                            }}
                                        >
                                            <ShoppingCart size={16} />
                                            선택 담기
                                        </button>
                                        <button
                                            className={styles.favCartAllBtn}
                                            onClick={async () => {
                                                for (const menu of favoriteMenus) {
                                                    const firstImage = menu.imagesSrc ? menu.imagesSrc.split(',')[0].trim() : 'blank.png';
                                                    const defaults = await getDefaultOptions(menu.id);
                                                    await addItem({
                                                        menuId: menu.id,
                                                        korName: menu.korName,
                                                        price: menu.price + (defaults?.additionalPrice || 0),
                                                        imageSrc: firstImage,
                                                        options: defaults?.options,
                                                    });
                                                }
                                                toast.success(`${favoriteMenus.length}개 메뉴를 모두 장바구니에 담았습니다! 🛒`);
                                            }}
                                        >
                                            <ShoppingCart size={16} />
                                            모두 담기
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.favoriteGrid}>
                                    {favoriteMenus.map((menu: any) => {
                                        const firstImage = menu.imagesSrc
                                            ? menu.imagesSrc.split(',')[0].trim()
                                            : 'blank.png';
                                        const isSelected = selectedFavorites.has(menu.id);
                                        return (
                                            <div key={menu.id} className={`${styles.favoriteCard} ${isSelected ? styles.favoriteCardSelected : ''}`}>
                                                <label className={styles.favCheckbox}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            setSelectedFavorites(prev => {
                                                                const next = new Set(prev);
                                                                if (next.has(menu.id)) {
                                                                    next.delete(menu.id);
                                                                } else {
                                                                    next.add(menu.id);
                                                                }
                                                                return next;
                                                            });
                                                        }}
                                                    />
                                                </label>
                                                <Link href={`/menus/${menu.id}`} className={styles.favLink}>
                                                    <img
                                                        src={`/images/${firstImage}`}
                                                        alt={menu.korName}
                                                        className={styles.favImage}
                                                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/blank.png'; }}
                                                    />
                                                    <div className={styles.favInfo}>
                                                        <h4 className={styles.favName}>{menu.korName}</h4>
                                                        <span className={styles.favPrice}>{menu.price?.toLocaleString()}원</span>
                                                    </div>
                                                </Link>
                                                <button
                                                    className={styles.favRemoveBtn}
                                                    onClick={async () => {
                                                        await toggleFavorite(menu.id);
                                                        setFavoriteMenus(prev => prev.filter(m => m.id !== menu.id));
                                                        setSelectedFavorites(prev => {
                                                            const next = new Set(prev);
                                                            next.delete(menu.id);
                                                            return next;
                                                        });
                                                        toast.info(`${menu.korName} 찜 해제 🤍`);
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </section>
                ) : activeTab === 'orders' ? (
                    <section>
                        {orders.length === 0 ? (
                            <div className={styles.emptyState}>
                                아직 주문한 내역이 없어요. <br/>
                                맛있는 메뉴를 구경해볼까요? 🐤
                            </div>
                        ) : (() => {
                            const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
                            const startIdx = (orderPage - 1) * ORDERS_PER_PAGE;
                            const paginatedOrders = orders.slice(startIdx, startIdx + ORDERS_PER_PAGE);
                            
                            return (
                                <>
                                    <div className={styles.orderList}>
                                        {paginatedOrders.map((order) => (
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
                                                        {(order.status === 'PAID' || order.status === 'PREPARING') && (
                                                            <button 
                                                                className={styles.reorderBtn}
                                                                style={{ background: '#ca8a04', color: 'white', borderColor: '#ca8a04' }}
                                                                onClick={() => router.push(`/orders/${order.paymentId}`)}
                                                            >
                                                                📱 현황 보기
                                                            </button>
                                                        )}
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

                                    {/* 페이지네이션 */}
                                    {totalPages > 1 && (
                                        <div className={styles.pagination}>
                                            <button
                                                className={styles.pageBtn}
                                                disabled={orderPage === 1}
                                                onClick={() => setOrderPage(p => p - 1)}
                                            >
                                                ‹
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    className={`${styles.pageBtn} ${orderPage === page ? styles.pageBtnActive : ''}`}
                                                    onClick={() => setOrderPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                className={styles.pageBtn}
                                                disabled={orderPage === totalPages}
                                                onClick={() => setOrderPage(p => p + 1)}
                                            >
                                                ›
                                            </button>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </section>
                ) : (
                    <section className={styles.settingsSection}>
                        <form onSubmit={handleUpdateProfile} className={styles.settingsGroup}>
                            <h3>기본 배송 정보 🏠</h3>
                            <div className={styles.inputGroup}>
                                <label>기본 배송 주소</label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                                    <input 
                                        type="text" 
                                        value={address} 
                                        readOnly
                                        placeholder="주소 검색을 클릭하세요"
                                        style={{ flex: 1, cursor: 'pointer', background: '#f9f5ef', minWidth: 0 }}
                                        onClick={async () => {
                                            try {
                                                const result = await openAddressSearch();
                                                setAddress(result.fullAddress);
                                            } catch (err: any) {
                                                toast.error(err.message);
                                            }
                                        }}
                                    />
                                    <button 
                                        type="button"
                                        className={styles.addressSearchBtn}
                                        onClick={async () => {
                                            try {
                                                const result = await openAddressSearch();
                                                setAddress(result.fullAddress);
                                            } catch (err: any) {
                                                toast.error(err.message);
                                            }
                                        }}
                                    >
                                        🔍 검색
                                    </button>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>연락처</label>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    placeholder="010-0000-0000"
                                    maxLength={13}
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
                                    maxLength={100}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>새 비밀번호</label>
                                <input 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required
                                    maxLength={100}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>새 비밀번호 확인</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required
                                    maxLength={100}
                                />
                            </div>
                            <button type="submit" className={styles.saveBtn}>비밀번호 변경하기 🐥</button>
                        </form>
                    </section>
                )}
            </main>
            <Footer />

            {/* 결제 수단 선택 모달 */}
            {isPaymentModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>결제 수단 선택 💳</h2>
                        <p className={styles.modalDesc}>결제하실 수단을 선택해주세요.</p>
                        
                        <div className={styles.methodSelector}>
                            <button 
                                className={`${styles.methodBtn} ${paymentMethod === 'CARD' ? styles.active : ''}`}
                                onClick={() => setPaymentMethod('CARD')}
                            >
                                <span className={styles.methodIcon}>💳</span>
                                <span className={styles.methodName}>일반 카드</span>
                            </button>
                            <button 
                                className={`${styles.methodBtn} ${paymentMethod === 'KAKAO' ? styles.active : ''}`}
                                onClick={() => setPaymentMethod('KAKAO')}
                            >
                                <span className={styles.methodIcon}>💬</span>
                                <span className={styles.methodName}>카카오페이</span>
                            </button>
                        </div>

                        <div className={styles.modalFooter}>
                            <button 
                                className={styles.modalCancelBtn}
                                onClick={() => setIsPaymentModalOpen(false)}
                            >
                                취소
                            </button>
                            <button 
                                className={styles.modalPayBtn}
                                onClick={processPayment}
                            >
                                {selectedOrder?.totalPrice.toLocaleString()}원 결제하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Script src="https://cdn.portone.io/v2/browser-sdk.js" />
        </div>
    );
}

