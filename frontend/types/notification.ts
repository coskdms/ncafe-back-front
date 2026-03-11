export type NotificationType = 'NEW_ORDER' | 'SOLD_OUT' | 'ORDER_STATUS' | 'SYSTEM';

export interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;       // 클릭 시 이동할 경로
    isRead: boolean;
    createdAt: string;   // ISO 날짜 문자열
}
