import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (message, type = 'info') => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        set((state) => ({
            toasts: [...state.toasts, { id, message, type }],
        }));
        // 3초 후 자동 제거
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, 3000);
    },
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}));

// 간편 호출 함수
export const toast = {
    success: (msg: string) => useToastStore.getState().addToast(msg, 'success'),
    error: (msg: string) => useToastStore.getState().addToast(msg, 'error'),
    info: (msg: string) => useToastStore.getState().addToast(msg, 'info'),
    warning: (msg: string) => useToastStore.getState().addToast(msg, 'warning'),
};
