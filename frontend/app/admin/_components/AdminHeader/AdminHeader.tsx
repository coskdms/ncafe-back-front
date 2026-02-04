'use client';

import { usePathname } from 'next/navigation';
import { Bell, User } from 'lucide-react';
import styles from './AdminHeader.module.css';

const getPageTitle = (pathname: string) => {
    if (pathname === '/admin') return '대시보드';
    if (pathname === '/admin/menus') return '메뉴 관리';
    if (pathname === '/admin/menus/new') return '메뉴 등록';
    if (pathname.startsWith('/admin/menus/')) {
        if (pathname.endsWith('/edit')) return '메뉴 수정';
        return '메뉴 상세';
    }
    return 'NCafe Admin';
};

export default function AdminHeader() {
    const pathname = usePathname();
    const title = getPageTitle(pathname);

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>

            <div className={styles.actions}>
                <button className={styles.iconButton} aria-label="알림">
                    <Bell size={20} />
                </button>
                <button className={styles.profileButton}>
                    <User size={20} />
                    <span>사장님</span>
                </button>
            </div>
        </header>
    );
}
