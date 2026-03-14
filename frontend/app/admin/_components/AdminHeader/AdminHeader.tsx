'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import ProfileDropdown from './ProfileDropdown';
import NotificationPanel from './NotificationPanel';
import { toast } from '@/stores/toastStore';
import styles from './AdminHeader.module.css';

const getPageTitle = (pathname: string | null) => {
    if (!pathname) return 'NCafe Admin';
    if (pathname === '/admin') return '대시보드';
    if (pathname === '/admin/menus') return '메뉴 관리';
    if (pathname === '/admin/menus/new') return '메뉴 등록';
    if (pathname.startsWith('/admin/menus/')) {
        if (pathname.endsWith('/edit')) return '메뉴 수정';
        return '메뉴 상세';
    }
    if (pathname === '/admin/categories') return '카테고리 관리';
    if (pathname === '/admin/orders') return '주문 관리';
    if (pathname === '/admin/analytics') return '매출 분석';
    if (pathname === '/admin/settings') return '설정';
    if (pathname === '/admin/rag') return 'RAG 관리';
    return 'NCafe Admin';
};

export default function AdminHeader() {
    const pathname = usePathname();
    const title = getPageTitle(pathname);
    const { user } = useAuthStore();
    const { unreadCount, fetchNotifications, fetchUnreadCount } = useNotificationStore();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const latestNotifIdRef = useRef<number>(0);
    const isFirstLoadRef = useRef(true);

    // 10초마다 알림 체크 — 새 알림 감지 시 토스트 표시
    useEffect(() => {
        const checkNotifications = async () => {
            await fetchUnreadCount();
            await fetchNotifications();

            const { notifications } = useNotificationStore.getState();
            if (notifications.length > 0) {
                const latestId = notifications[0]?.id ?? 0;

                // 최초 로드가 아닌데 새 알림이 감지되면 토스트
                if (!isFirstLoadRef.current && latestId > latestNotifIdRef.current) {
                    const newNotifs = notifications.filter(n => n.id > latestNotifIdRef.current);
                    for (const n of newNotifs) {
                        toast.success(`🐤 ${n.title}: ${n.message}`);
                    }
                }
                latestNotifIdRef.current = latestId;
            }
            isFirstLoadRef.current = false;
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 10000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount, fetchNotifications]);

    // SSE 실시간 구독 (보조 - 관리자 새 주문 토스트)
    const eventSourceRef = useRef<EventSource | null>(null);
    useEffect(() => {
        let es: EventSource;
        try {
            es = new EventSource('/api/sse/admin');
            eventSourceRef.current = es;

            es.addEventListener('new_order', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    toast.success(data.message || '새 주문이 들어왔다덕! 🐤');
                    // 즉시 갱신
                    fetchUnreadCount();
                    fetchNotifications().then(() => {
                        const { notifications } = useNotificationStore.getState();
                        if (notifications.length > 0) {
                            latestNotifIdRef.current = notifications[0].id;
                        }
                    });
                } catch (e) {
                    console.error('SSE parse error:', e);
                }
            });

            es.onerror = () => {};
        } catch {
            // SSE 미지원
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 알림 패널이 열릴 때 목록을 새로고침
    useEffect(() => {
        if (isNotifOpen) {
            fetchNotifications();
        }
    }, [isNotifOpen, fetchNotifications]);


    const handleProfileToggle = () => {
        setIsProfileOpen((prev) => !prev);
        setIsNotifOpen(false); // 다른 패널 닫기
    };

    const handleNotifToggle = () => {
        setIsNotifOpen((prev) => !prev);
        setIsProfileOpen(false); // 다른 패널 닫기
    };

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>

            <div className={styles.actions}>
                {/* 🔔 알림 버튼 */}
                <div className={styles.dropdownAnchor}>
                    <button
                        className={styles.iconButton}
                        aria-label="알림"
                        onClick={handleNotifToggle}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className={styles.badge}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    <NotificationPanel
                        isOpen={isNotifOpen}
                        onClose={() => setIsNotifOpen(false)}
                    />
                </div>

                {/* 👤 프로필 버튼 */}
                <div className={styles.dropdownAnchor}>
                    <button
                        className={styles.profileButton}
                        onClick={handleProfileToggle}
                    >
                        <span className={styles.avatarSmall}>
                            {user?.nickname?.charAt(0).toUpperCase() || 'A'}
                        </span>
                        <span>{user?.nickname || '사장님'}</span>
                        <ChevronDown
                            size={14}
                            className={`${styles.chevron} ${isProfileOpen ? styles.chevronOpen : ''}`}
                        />
                    </button>
                    <ProfileDropdown
                        isOpen={isProfileOpen}
                        onClose={() => setIsProfileOpen(false)}
                    />
                </div>
            </div>
        </header>
    );
}
