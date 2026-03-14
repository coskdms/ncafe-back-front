'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import common from './common.module.css';
import { fetchAPI } from '@/app/lib/api';
import { ShoppingBag, Utensils, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardStats {
    todayOrderCount: number;
    totalMenuCount: number;
    soldOutMenuCount: number;
    todaySales: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await fetchAPI('/admin/dashboard/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <main className={styles.container}>
                <div className={styles.welcome}>
                    <h2>데이터를 불러오는 중입니다... 🐤</h2>
                </div>
            </main>
        );
    }

    return (
        <main className={common.pageContainer}>
            <header className={common.pageHeader}>
                <div className={common.pageHeaderTitle}>
                    <h1>대시보드</h1>
                    <p>안녕하세요, 사장님! 오늘도 파덕이와 함께 번창하세요 👋</p>
                </div>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                        <ShoppingBag size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statLabel}>오늘 주문</span>
                        <span className={styles.statValue}>{(stats?.todayOrderCount ?? 0).toLocaleString()}건</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                        <Utensils size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statLabel}>총 메뉴</span>
                        <span className={styles.statValue}>{(stats?.totalMenuCount ?? 0).toLocaleString()}개</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statLabel}>품절 메뉴</span>
                        <span className={styles.statValue}>{(stats?.soldOutMenuCount ?? 0).toLocaleString()}개</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statLabel}>오늘 매출</span>
                        <span className={styles.statValue}>₩{(stats?.todaySales ?? 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <section className={styles.quickLinks}>
                <h3>빠른 관리 🛠️</h3>
                <div className={styles.linkGrid}>
                    <a href="/admin/orders" className={styles.linkCard}>📋 주문 관리 바로가기</a>
                    <a href="/admin/menus" className={styles.linkCard}>☕️ 메뉴 관리 바로가기</a>
                    <a href="/admin/analytics" className={styles.linkCard}>📊 매출 분석 바로가기</a>
                    <a href="/admin/settings" className={styles.linkCard}>⚙️ 환경 설정 바로가기</a>
                </div>
            </section>
        </main>
    );
}
