'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag,
    AlertTriangle,
    RefreshCw,
    Info,
    CheckCheck,
} from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import { Notification, NotificationType } from '@/types/notification';
import styles from './NotificationPanel.module.css';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const typeConfig: Record<NotificationType, { icon: typeof ShoppingBag; color: string; bg: string }> = {
    NEW_ORDER: { icon: ShoppingBag, color: '#f97316', bg: '#fff7ed' },
    SOLD_OUT: { icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
    ORDER_STATUS: { icon: RefreshCw, color: '#22c55e', bg: '#f0fdf4' },
    SYSTEM: { icon: Info, color: '#3b82f6', bg: '#eff6ff' },
};

function getRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
    const router = useRouter();
    const panelRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            router.push(notification.link);
        }
        onClose();
    };

    return (
        <div className={styles.panel} ref={panelRef}>
            {/* 헤더 */}
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>
                    🔔 알림센터
                    {unreadCount > 0 && (
                        <span className={styles.unreadBadgeInline}>{unreadCount}</span>
                    )}
                </h3>
                {unreadCount > 0 && (
                    <button className={styles.markAllBtn} onClick={markAllAsRead}>
                        <CheckCheck size={14} />
                        모두 읽음
                    </button>
                )}
            </div>

            {/* 알림 목록 */}
            <div className={styles.notificationList}>
                {notifications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span>📭</span>
                        <p>새로운 알림이 없습니다</p>
                    </div>
                ) : (
                    notifications.map((notification) => {
                        const config = typeConfig[notification.type];
                        const Icon = config.icon;

                        return (
                            <button
                                key={notification.id}
                                className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div
                                    className={styles.iconWrapper}
                                    style={{ backgroundColor: config.bg, color: config.color }}
                                >
                                    <Icon size={16} />
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.notifTitle}>{notification.title}</div>
                                    <div className={styles.notifMessage}>{notification.message}</div>
                                </div>
                                <div className={styles.meta}>
                                    <span className={styles.time}>{getRelativeTime(notification.createdAt)}</span>
                                    {!notification.isRead && <span className={styles.unreadDot} />}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
