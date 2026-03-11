'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import ProfileDropdown from './ProfileDropdown';
import NotificationPanel from './NotificationPanel';
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

    // 컴포넌트 마운트 시 알림 개수 로드
    useEffect(() => {
        fetchUnreadCount();

        // 30초마다 읽지 않은 알림 수만 폴링 (서버 부하 감소)
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

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
