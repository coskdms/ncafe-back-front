'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
    Search, 
    Filter, 
    Calendar, 
    Package, 
    Truck, 
    CheckCircle2, 
    XCircle, 
    ChevronDown, 
    ChevronUp,
    Phone,
    MapPin,
    MessageSquare,
    User,
    RefreshCw
} from 'lucide-react';
import styles from './Orders.module.css';
import { fetchAPI } from '@/app/lib/api';
import Button from '@/components/common/Button/Button';
import { toast } from '@/stores/toastStore';

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
    status: 'PENDING' | 'PAID' | 'PREPARING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
    type: 'DELIVERY' | 'PICKUP';
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
    receiverName: string;
    receiverPhone: string;
    address: string;
    memo: string;
    memberId: string | null;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchAPI('/admin/orders');
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        let result = orders;

        if (statusFilter !== 'ALL') {
            result = result.filter(o => o.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(o => 
                o.paymentId.toLowerCase().includes(query) ||
                o.receiverName?.toLowerCase().includes(query) ||
                o.receiverPhone?.includes(query) ||
                o.items.some(item => item.korName.toLowerCase().includes(query))
            );
        }

        setFilteredOrders(result);
    }, [orders, statusFilter, searchQuery]);

    const handleStatusChange = async (paymentId: string, newStatus: string) => {
        try {
            await fetchAPI(`/admin/orders/${paymentId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            // Update local state
            setOrders(prev => prev.map(o => o.paymentId === paymentId ? { ...o, status: newStatus as any } : o));
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('상태 변경에 실패했습니다.');
        }
    };

    const handleCancelOrder = async (paymentId: string) => {
        if (!confirm('정말로 이 주문을 취소하시겠습니까? 결제된 금액은 환불 처리됩니다.')) return;
        
        try {
            await fetchAPI(`/admin/orders/${paymentId}/cancel`, { method: 'POST' });
            // Update local state
            setOrders(prev => prev.map(o => o.paymentId === paymentId ? { ...o, status: 'CANCELLED' } : o));
            toast.success('주문이 취소되었습니다.');
        } catch (error) {
            console.error('Failed to cancel order:', error);
            toast.error('주문 취소에 실패했습니다.');
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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return '결제 대기';
            case 'PAID': return '결제 완료';
            case 'PREPARING': return '음식 준비 중';
            case 'COMPLETED': return '수령 완료';
            case 'CANCELLED': return '취소됨';
            case 'FAILED': return '결제 실패';
            default: return status;
        }
    };

    const getTypeLabel = (type: string) => {
        return type === 'DELIVERY' ? '배달' : '포장';
    };

    if (isLoading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    // 통계 계산
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
    const todaySales = todayOrders
        .filter(o => o.status !== 'CANCELLED' && o.status !== 'FAILED')
        .reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingOrders = orders.filter(o => o.status === 'PAID' || o.status === 'PREPARING').length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>주문 관리 🐤📋</h1>
                    <p>우리 매장의 실시간 주문 현황을 확인하고 관리하세요.</p>
                </div>
                <Button variant="outline" onClick={fetchOrders}>
                    <RefreshCw size={18} style={{ marginRight: '8px' }} />
                    새로고침
                </Button>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>오늘 주문</span>
                    <span className={styles.statValue}>{todayOrders.length}건</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>오늘 매출</span>
                    <span className={styles.statValue}>₩{todaySales.toLocaleString()}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>처리 대기</span>
                    <span className={styles.statValue}>{pendingOrders}건</span>
                </div>
            </div>

            <div className={styles.filterSection}>
                <div className={styles.searchBar}>
                    <Search className={styles.searchIcon} size={20} />
                    <input 
                        type="text" 
                        placeholder="주문번호, 주문자명, 연락처로 검색..." 
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select 
                    className={styles.statusFilter}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">모든 상태</option>
                    <option value="PAID">결제 완료</option>
                    <option value="PREPARING">준비 중</option>
                    <option value="COMPLETED">수령 완료</option>
                    <option value="CANCELLED">취소됨</option>
                </select>
            </div>

            {filteredOrders.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3>검색 결과가 없습니다. 🐥</h3>
                    <p>다른 검색어나 필터를 선택해보세요.</p>
                </div>
            ) : (
                <div className={styles.orderList}>
                    {filteredOrders.map((order) => {
                        const isExpanded = expandedOrders.has(order.id);
                        return (
                            <div key={order.id} className={styles.orderCard}>
                                <div 
                                    className={styles.orderHeader}
                                    onClick={() => toggleOrderExpansion(order.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={styles.orderMeta}>
                                        <div className={styles.orderId}>#{order.paymentId}</div>
                                        <div className={styles.orderDate}>
                                            <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                            {new Date(order.createdAt).toLocaleString()}
                                        </div>
                                        <span className={`${styles.typeBadge} ${styles[`type-${order.type}`]}`}>
                                            {getTypeLabel(order.type)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span className={`${styles.orderStatusBadge} ${styles[`status-${order.status}`]}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                <div className={styles.orderBody} style={{ display: isExpanded ? 'grid' : 'none' }}>
                                    <div className={styles.itemsSection}>
                                        <h4>주문 상품 ({order.items.length})</h4>
                                        <div className={styles.itemList}>
                                            {order.items.map((item) => {
                                                let options = {};
                                                try {
                                                    options = item.options ? JSON.parse(item.options) : {};
                                                } catch (e) {}

                                                return (
                                                    <div key={item.id} className={styles.itemRow}>
                                                        <div className={styles.itemMainInfo}>
                                                            <span className={styles.itemName}>{item.korName}</span>
                                                            <div className={styles.itemOptions}>
                                                                {Object.entries(options).map(([key, val]: [string, any]) => (
                                                                    <span key={key} style={{ marginRight: '8px' }}>
                                                                        {key}: {val}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className={styles.itemQuantity}>
                                                            {item.price.toLocaleString()}원 × {item.quantity}개
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className={styles.customerSection}>
                                        <h4>고객 정보</h4>
                                        <div className={styles.customerInfo}>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}><User size={12} /> 주문자</span>
                                                <span className={styles.infoValue}>{order.receiverName}</span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}><Phone size={12} /> 연락처</span>
                                                <span className={styles.infoValue}>{order.receiverPhone}</span>
                                            </div>
                                            {order.type === 'DELIVERY' && (
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}><MapPin size={12} /> 배송지</span>
                                                    <span className={styles.infoValue}>{order.address}</span>
                                                </div>
                                            )}
                                            {order.memo && (
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}><MessageSquare size={12} /> 요청사항</span>
                                                    <span className={styles.infoValue}>{order.memo}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.orderFooter}>
                                    <div className={styles.totalPriceSection}>
                                        <span className={styles.totalPriceLabel}>최종 결제 금액</span>
                                        <span className={styles.totalPriceValue}>₩{order.totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.actionButtons}>
                                        {order.status === 'PAID' && (
                                            <Button onClick={() => handleStatusChange(order.paymentId, 'PREPARING')}>
                                                <Package size={16} style={{ marginRight: '6px' }} />
                                                메뉴 준비 시작
                                            </Button>
                                        )}
                                        {order.status === 'PREPARING' && (
                                            <Button style={{ background: '#059669' }} onClick={() => handleStatusChange(order.paymentId, 'COMPLETED')}>
                                                <CheckCircle2 size={16} style={{ marginRight: '6px' }} />
                                                준비 완료 및 수령
                                            </Button>
                                        )}
                                        {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && order.status !== 'FAILED' && (
                                            <Button variant="danger" onClick={() => handleCancelOrder(order.paymentId)}>
                                                <XCircle size={16} style={{ marginRight: '6px' }} />
                                                주문 취소
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
