'use client';

import { useToastStore, ToastType } from '@/stores/toastStore';
import styles from './Toast.module.css';

const ICONS: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    info: '🐥',
    warning: '⚠️',
};

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className={styles.toastContainer}>
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`${styles.toast} ${styles[t.type]}`}
                    onClick={() => removeToast(t.id)}
                    role="alert"
                >
                    <span className={styles.icon}>{ICONS[t.type]}</span>
                    <span className={styles.message}>{t.message}</span>
                    <button
                        className={styles.closeBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            removeToast(t.id);
                        }}
                    >
                        ✕
                    </button>
                    <div className={styles.progressBar} />
                </div>
            ))}
        </div>
    );
}
