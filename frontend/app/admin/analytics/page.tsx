'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, BarChart3, Award, ShoppingBag, Calendar } from 'lucide-react';
import { fetchAPI } from '@/app/lib/api';
import styles from './Analytics.module.css';
import common from '../common.module.css';

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

type Period = '7days' | '30days' | 'all' | 'custom';

export default function AnalyticsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<Period>('7days');
    
    // 커스텀 날짜
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const [customStart, setCustomStart] = useState(weekAgo);
    const [customEnd, setCustomEnd] = useState(today);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchAPI('/admin/orders');
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // 유효한 주문만 (PAID, PREPARING, COMPLETED)
    const validOrders = useMemo(() =>
        orders.filter(o => ['PAID', 'PREPARING', 'COMPLETED'].includes(o.status)),
        [orders]
    );

    // 기간별 필터
    const filteredOrders = useMemo(() => {
        const now = new Date();
        let cutoff: Date;
        let endDate: Date | null = null;
        
        switch (period) {
            case '7days':
                cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30days':
                cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'custom':
                cutoff = new Date(customStart + 'T00:00:00');
                endDate = new Date(customEnd + 'T23:59:59');
                break;
            default:
                cutoff = new Date(0);
        }
        return validOrders.filter(o => {
            const d = new Date(o.createdAt);
            return d >= cutoff && (endDate ? d <= endDate : true);
        });
    }, [validOrders, period, customStart, customEnd]);

    // ── 일별 매출 집계 ──
    const dailySales = useMemo(() => {
        const map = new Map<string, { date: string; sales: number; count: number }>();
        
        let days: number;
        let startDate: Date;
        
        if (period === 'custom') {
            const start = new Date(customStart);
            const end = new Date(customEnd);
            days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);
            startDate = start;
        } else {
            days = period === '7days' ? 7 : period === '30days' ? 30 : 14;
            startDate = new Date();
            startDate.setDate(startDate.getDate() - (days - 1));
        }

        // 빈 날짜 채우기
        for (let i = 0; i < days; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const key = d.toISOString().split('T')[0];
            map.set(key, { date: key, sales: 0, count: 0 });
        }

        for (const order of filteredOrders) {
            const dateKey = order.createdAt.split('T')[0];
            const existing = map.get(dateKey);
            if (existing) {
                existing.sales += order.totalPrice;
                existing.count += 1;
            }
        }

        return Array.from(map.values());
    }, [filteredOrders, period, customStart, customEnd]);

    // ── 인기 메뉴 TOP 5 ──
    const topMenus = useMemo(() => {
        const menuMap = new Map<string, { name: string; count: number; revenue: number }>();
        for (const order of filteredOrders) {
            for (const item of order.items) {
                const existing = menuMap.get(item.korName);
                if (existing) {
                    existing.count += item.quantity;
                    existing.revenue += item.price * item.quantity;
                } else {
                    menuMap.set(item.korName, {
                        name: item.korName,
                        count: item.quantity,
                        revenue: item.price * item.quantity,
                    });
                }
            }
        }
        return Array.from(menuMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [filteredOrders]);

    const summary = useMemo(() => {
        const totalSales = filteredOrders.reduce((s, o) => s + o.totalPrice, 0);
        const totalOrders = filteredOrders.length;
        const totalDays = dailySales.length || 1;
        const avgDailySales = Math.round(totalSales / totalDays);
        return { totalSales, totalOrders, avgDailySales };
    }, [filteredOrders, dailySales]);

    if (isLoading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ fontWeight: 700, color: '#78350f' }}>데이터를 분석 중이다덕... 🐤📊</p>
            </div>
        );
    }

    // ── SVG 차트 매출 추이 ──
    const maxSales = Math.max(...dailySales.map(d => d.sales), 1);
    const chartPadding = { top: 20, right: 20, bottom: 40, left: 55 };
    const chartW = 600;
    const chartH = 260;
    const plotW = chartW - chartPadding.left - chartPadding.right;
    const plotH = chartH - chartPadding.top - chartPadding.bottom;

    const points = dailySales.map((d, i) => {
        const x = chartPadding.left + (i / Math.max(dailySales.length - 1, 1)) * plotW;
        const y = chartPadding.top + plotH - (d.sales / maxSales) * plotH;
        return { x, y, ...d };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = linePath + ` L ${points[points.length - 1]?.x} ${chartPadding.top + plotH} L ${points[0]?.x} ${chartPadding.top + plotH} Z`;

    // Y축 라벨
    const yLabels = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
        value: Math.round(maxSales * ratio),
        y: chartPadding.top + plotH - ratio * plotH,
    }));

    return (
        <div className={common.pageContainer}>
            <header className={common.pageHeader}>
                <div className={common.pageHeaderTitle}>
                    <h1>매출 분석</h1>
                    <p>기간별 매출 데이터를 한눈에 확인하세요 📊</p>
                </div>
            </header>

            {/* 기간 선택 */}
            <div className={styles.periodTabs}>
                {([
                    { key: '7days' as Period, label: '최근 7일' },
                    { key: '30days' as Period, label: '최근 30일' },
                    { key: 'all' as Period, label: '전체' },
                    { key: 'custom' as Period, label: '직접 설정' },
                ]).map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.periodTab} ${period === tab.key ? styles.periodTabActive : ''}`}
                        onClick={() => setPeriod(tab.key)}
                    >
                        {tab.key === 'custom' && <Calendar size={14} />}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 커스텀 날짜 선택 */}
            {period === 'custom' && (
                <div className={styles.customDateRange}>
                    <div className={styles.dateField}>
                        <label>시작일</label>
                        <input
                            type="date"
                            value={customStart}
                            max={customEnd}
                            onChange={e => setCustomStart(e.target.value)}
                            className={styles.dateInput}
                        />
                    </div>
                    <span className={styles.dateSeparator}>~</span>
                    <div className={styles.dateField}>
                        <label>종료일</label>
                        <input
                            type="date"
                            value={customEnd}
                            min={customStart}
                            max={today}
                            onChange={e => setCustomEnd(e.target.value)}
                            className={styles.dateInput}
                        />
                    </div>
                </div>
            )}

            {/* 요약 통계 */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>💰 총 매출</span>
                    <span className={styles.summaryValue}>₩{summary.totalSales.toLocaleString()}</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>📦 총 주문</span>
                    <span className={styles.summaryValue}>{summary.totalOrders}건</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>📊 1일 평균 매출</span>
                    <span className={styles.summaryValue}>₩{summary.avgDailySales.toLocaleString()}</span>
                </div>
            </div>

            {/* 매출 추이 차트 (순수 SVG) */}
            <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>
                    <TrendingUp size={20} />
                    일별 매출 추이
                </h3>
                <div className={styles.chartWrapper}>
                    <svg viewBox={`0 0 ${chartW} ${chartH}`} className={styles.svgChart} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fde047" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* 그리드 라인 */}
                        {yLabels.map((l, i) => (
                            <g key={i}>
                                <line
                                    x1={chartPadding.left}
                                    y1={l.y}
                                    x2={chartW - chartPadding.right}
                                    y2={l.y}
                                    className={styles.gridLine}
                                />
                                <text
                                    x={chartPadding.left - 8}
                                    y={l.y + 4}
                                    className={styles.axisLabel}
                                    textAnchor="end"
                                >
                                    {l.value >= 10000
                                        ? `${(l.value / 10000).toFixed(l.value >= 100000 ? 0 : 1)}만`
                                        : l.value >= 1000
                                        ? `${(l.value / 1000).toFixed(0)}천`
                                        : l.value.toString()}
                                </text>
                            </g>
                        ))}

                        {/* 에어리어 */}
                        {points.length > 1 && <path d={areaPath} className={styles.chartArea} />}

                        {/* 라인 */}
                        {points.length > 1 && <path d={linePath} className={styles.chartLine} />}

                        {/* 점 + 라벨 */}
                        {points.map((p, i) => (
                            <g key={i}>
                                <circle cx={p.x} cy={p.y} r={4} className={styles.chartDot} />
                                {/* X축 날짜 */}
                                {(dailySales.length <= 10 || i % Math.ceil(dailySales.length / 8) === 0) && (
                                    <text
                                        x={p.x}
                                        y={chartH - 8}
                                        className={styles.chartLabel}
                                    >
                                        {p.date.slice(5)}
                                    </text>
                                )}
                                {/* 값 라벨 (0이 아닌 경우만) */}
                                {p.sales > 0 && dailySales.length <= 10 && (
                                    <text
                                        x={p.x}
                                        y={p.y - 10}
                                        className={styles.chartValueLabel}
                                    >
                                        {p.sales >= 10000
                                            ? `${(p.sales / 10000).toFixed(1)}만`
                                            : p.sales.toLocaleString()}
                                    </text>
                                )}
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* 인기 메뉴 TOP 5 */}
            <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>
                    <Award size={20} />
                    인기 메뉴 TOP 5
                </h3>
                {topMenus.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#78350f', padding: '24px' }}>
                        아직 주문 데이터가 없다덕... 🐥
                    </p>
                ) : (
                    <div className={styles.topMenuList}>
                        {topMenus.map((menu, idx) => {
                            const maxCount = topMenus[0]?.count || 1;
                            const rankClass = idx === 0 ? styles.rank1
                                : idx === 1 ? styles.rank2
                                : idx === 2 ? styles.rank3
                                : styles.rankOther;

                            return (
                                <div key={menu.name} className={styles.topMenuItem}>
                                    <span className={`${styles.topMenuRank} ${rankClass}`}>
                                        {idx + 1}
                                    </span>
                                    <span className={styles.topMenuName}>{menu.name}</span>
                                    <div className={styles.topMenuBar}>
                                        <div
                                            className={styles.topMenuBarFill}
                                            style={{ width: `${(menu.count / maxCount) * 100}%` }}
                                        />
                                    </div>
                                    <span className={styles.topMenuCount}>{menu.count}개</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 일별 주문 건수 막대 차트 */}
            <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>
                    <ShoppingBag size={20} />
                    일별 주문 건수
                </h3>
                <div className={styles.chartWrapper}>
                    <svg viewBox={`0 0 ${chartW} ${chartH}`} className={styles.svgChart} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
                        {(() => {
                            const maxCount = Math.max(...dailySales.map(d => d.count), 1);
                            const barWidth = Math.max(plotW / dailySales.length - 4, 8);

                            return dailySales.map((d, i) => {
                                const barH = (d.count / maxCount) * plotH;
                                const x = chartPadding.left + (i / dailySales.length) * plotW + 2;
                                const y = chartPadding.top + plotH - barH;

                                return (
                                    <g key={i}>
                                        <rect
                                            x={x}
                                            y={y}
                                            width={barWidth}
                                            height={barH}
                                            rx={4}
                                            className={styles.chartBar}
                                        />
                                        {d.count > 0 && (
                                            <text
                                                x={x + barWidth / 2}
                                                y={y - 6}
                                                className={styles.chartValueLabel}
                                            >
                                                {d.count}
                                            </text>
                                        )}
                                        {(dailySales.length <= 10 || i % Math.ceil(dailySales.length / 8) === 0) && (
                                            <text
                                                x={x + barWidth / 2}
                                                y={chartH - 8}
                                                className={styles.chartLabel}
                                            >
                                                {d.date.slice(5)}
                                            </text>
                                        )}
                                    </g>
                                );
                            });
                        })()}
                    </svg>
                </div>
            </div>
        </div>
    );
}
