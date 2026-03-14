'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ShoppingBag, Clock, Home, Coffee } from 'lucide-react';
import { fetchAPI } from '@/app/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import styles from './OrderTracker.module.css';

interface OrderItem {
    id: number;
    menuId: number;
    korName: string;
    price: number;
    quantity: number;
    options: string;
}

interface OrderData {
    id: number;
    paymentId: string;
    status: 'PENDING' | 'PAID' | 'PREPARING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
    type: string;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
    receiverName: string;
    receiverPhone: string;
    address: string;
    memo: string;
}

// 단계 정의
const STEPS = [
    { key: 'PAID', label: '결제 완료', icon: '💳', emoji: '✅' },
    { key: 'PREPARING', label: '준비 중', icon: '🍳', emoji: '🔥' },
    { key: 'COMPLETED', label: '완료', icon: '🎉', emoji: '✅' },
];

// 상태별 메시지
const STATUS_MESSAGES: Record<string, { emoji: string; text: string; time?: string }> = {
    PENDING: {
        emoji: '⏳',
        text: '결제를 기다리고 있다덕!\n곧 맛있는 음료를 준비할 수 있을 거다덕~',
    },
    PAID: {
        emoji: '🐤',
        text: '결제가 완료되었다덕!\n사장님이 곧 주문을 확인할 거다덕~ 조금만 기다려달라덕!',
        time: '예상 대기: 약 3~5분',
    },
    PREPARING: {
        emoji: '☕',
        text: '사장님이 정성껏 메뉴를 만들고 있다덕!\n맛있게 만들어지고 있으니 기대해달라덕~ 🔥',
        time: '예상 소요: 약 10~15분',
    },
    COMPLETED: {
        emoji: '🎊',
        text: '주문이 완료되었다덕!\n맛있게 드시라덕~ 또 주문해달라덕! 😋',
    },
    CANCELLED: {
        emoji: '😢',
        text: '이 주문은 취소되었다덕...\n다음에 또 주문해달라덕! 💛',
    },
    FAILED: {
        emoji: '💦',
        text: '결제에 실패했다덕...\n다시 시도해달라덕!',
    },
};

function getStepIndex(status: string): number {
    switch (status) {
        case 'PAID': return 0;
        case 'PREPARING': return 1;
        case 'COMPLETED': return 2;
        default: return -1;
    }
}

function getProgressWidth(status: string): string {
    const stepIdx = getStepIndex(status);
    if (stepIdx < 0) return '0%';
    // 0 = 0%, 1 = 50%, 2 = 100%
    return `${(stepIdx / (STEPS.length - 1)) * 100}%`;
}

export default function OrderTrackerPage({
    params,
}: {
    params: Promise<{ paymentId: string }>;
}) {
    const { paymentId } = use(params);
    const router = useRouter();
    const { user } = useAuthStore();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const eventSourceRef = useRef<EventSource | null>(null);

    const fetchOrder = async () => {
        try {
            const data = await fetchAPI(`/orders/${paymentId}`);
            setOrder(data);
        } catch (error) {
            console.error('주문 조회 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
        // 진행 중인 주문에만 빠른 폴링 (5초) 적용
        const interval = setInterval(() => {
            // 주문이 완료/취소되면 폴링 중단
            if (order && (order.status === 'COMPLETED' || order.status === 'CANCELLED' || order.status === 'FAILED')) {
                return;
            }
            fetchOrder();
        }, 5000);
        return () => clearInterval(interval);
    }, [paymentId, order?.status]);

    // SSE 실시간 구독 (보조 수단 - 프록시 환경에서는 폴링이 더 안정적)
    useEffect(() => {
        if (!user?.nickname) return;

        let es: EventSource;
        try {
            es = new EventSource(`/api/sse/user/${user.nickname}`);
            eventSourceRef.current = es;

            es.addEventListener('order_status', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.paymentId === paymentId) {
                        // SSE로 직접 상태 업데이트 (fetchOrder 호출 없이 즉시 반영)
                        if (data.status) {
                            setOrder(prev => prev ? { ...prev, status: data.status as OrderData['status'] } : prev);
                        }
                        toast.success(data.message || '주문 상태가 변경되었다덕! 🐤');
                        // 추가로 전체 데이터도 갱신
                        fetchOrder();
                    }
                } catch (e) {
                    console.error('SSE parse error:', e);
                }
            });

            es.addEventListener('connected', () => {
                console.log('🐤 SSE 실시간 연결 성공!');
            });

            es.onerror = () => {
                // SSE 에러 시 폴링이 백업으로 동작하므로 조용히 처리
            };
        } catch {
            // SSE 지원 안 되는 환경 - 폴링으로 대체
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.nickname, paymentId]);

    if (isLoading) {
        return (
            <div className={styles.main}>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner} />
                        <p className={styles.loadingText}>주문 정보를 불러오는 중이다덕... 🐤</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.main}>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.loadingState}>
                        <p className={styles.loadingText}>주문을 찾을 수 없다덕... 😢</p>
                        <Link href="/mypage" className={styles.primaryBtn} style={{ maxWidth: 300, margin: '20px auto' }}>
                            마이페이지로 이동
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentStatus = order.status;
    const currentStepIdx = getStepIndex(currentStatus);
    const isCancelled = currentStatus === 'CANCELLED' || currentStatus === 'FAILED';
    const message = STATUS_MESSAGES[currentStatus] || STATUS_MESSAGES.PENDING;

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <Link href="/mypage" className={styles.backLink}>
                    <ChevronLeft size={18} />
                    마이페이지로 돌아가기
                </Link>

                {/* 헤더 */}
                <div className={styles.headerCard}>
                    <span className={styles.duckEmoji}>🐤</span>
                    <h1 className={styles.headerTitle}>주문 현황</h1>
                    <p className={styles.headerSub}>파덕이가 실시간으로 알려드린다덕!</p>
                    <span className={styles.orderId}>주문번호: {order.paymentId}</span>
                </div>

                {/* 프로그레스 트래커 */}
                {!isCancelled && (
                    <div className={styles.tracker}>
                        <div className={styles.steps}>
                            {/* 진행 라인 */}
                            <div
                                className={styles.progressLine}
                                style={{ width: getProgressWidth(currentStatus) }}
                            />

                            {STEPS.map((step, idx) => {
                                let circleClass = styles.stepInactive;
                                let labelClass = '';

                                if (idx < currentStepIdx) {
                                    circleClass = styles.stepCompleted;
                                    labelClass = styles.stepLabelCompleted;
                                } else if (idx === currentStepIdx) {
                                    circleClass = styles.stepActive;
                                    labelClass = styles.stepLabelActive;
                                }

                                return (
                                    <div key={step.key} className={styles.step}>
                                        <div className={`${styles.stepCircle} ${circleClass}`}>
                                            {idx < currentStepIdx ? '✓' : step.icon}
                                        </div>
                                        <span className={`${styles.stepLabel} ${labelClass}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 취소/실패 배너 */}
                {isCancelled && (
                    <div className={styles.cancelledBanner}>
                        <span className={styles.statusEmoji}>{currentStatus === 'CANCELLED' ? '🚫' : '⚠️'}</span>
                        <p className={styles.cancelledText}>
                            {currentStatus === 'CANCELLED' ? '이 주문은 취소되었습니다.' : '결제에 실패했습니다.'}
                        </p>
                    </div>
                )}

                {/* 상태 메시지 */}
                <div className={styles.statusMessage}>
                    <span className={styles.statusEmoji}>{message.emoji}</span>
                    <p className={styles.statusText}>
                        {message.text.split('\n').map((line, i) => (
                            <span key={i}>{line}<br /></span>
                        ))}
                    </p>
                    {message.time && (
                        <span className={styles.estimatedTime}>
                            <Clock size={16} />
                            {message.time}
                        </span>
                    )}
                </div>

                {/* 주문 상세 */}
                <div className={styles.detailCard}>
                    <h2 className={styles.detailTitle}>
                        <ShoppingBag size={20} />
                        주문 상품
                    </h2>
                    <div className={styles.itemList}>
                        {order.items.map((item) => {
                            let options: Record<string, string> = {};
                            try {
                                options = item.options ? JSON.parse(item.options) : {};
                            } catch {}

                            return (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>{item.korName}</span>
                                        {Object.keys(options).length > 0 && (
                                            <span className={styles.itemOptions}>
                                                {Object.entries(options).map(([k, v]) => `${k}: ${v}`).join(' / ')}
                                            </span>
                                        )}
                                    </div>
                                    <span className={styles.itemPrice}>
                                        {(item.price * item.quantity).toLocaleString()}원 ({item.quantity}개)
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>총 결제 금액</span>
                        <span className={styles.totalValue}>
                            {order.totalPrice.toLocaleString()}원
                        </span>
                    </div>
                </div>

                {/* 버튼 */}
                <div className={styles.actions}>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => router.push('/')}
                    >
                        <Home size={18} />
                        홈으로
                    </button>
                    <button
                        className={styles.secondaryBtn}
                        onClick={() => router.push('/menus')}
                    >
                        <Coffee size={18} />
                        추가 주문
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
