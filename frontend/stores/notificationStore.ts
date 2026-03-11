import { create } from 'zustand';
import { Notification } from '@/types/notification';
import { fetchAPI } from '@/app/lib/api';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;

    fetchNotifications: () => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const data = await fetchAPI('/admin/notifications');
            if (data) {
                // 백엔드 날짜 필드명 보정 (createdAt)
                const mappedData = data.map((n: any) => ({
                    ...n,
                    isRead: n.isRead || false,
                    createdAt: n.createdAt
                }));
                
                set({
                    notifications: mappedData,
                    unreadCount: mappedData.filter((n: Notification) => !n.isRead).length,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            set({ isLoading: false });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const data = await fetchAPI('/admin/notifications/unread-count');
            if (data && typeof data.count === 'number') {
                set({ unreadCount: data.count });
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    },

    markAsRead: async (id: number) => {
        try {
            await fetchAPI(`/admin/notifications/${id}/read`, { method: 'PATCH' });
            set((state) => {
                const updated = state.notifications.map((n) =>
                    n.id === id ? { ...n, isRead: true } : n
                );
                return {
                    notifications: updated,
                    unreadCount: Math.max(0, state.unreadCount - 1),
                };
            });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await fetchAPI('/admin/notifications/read-all', { method: 'PATCH' });
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                unreadCount: 0,
            }));
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    },
}));

