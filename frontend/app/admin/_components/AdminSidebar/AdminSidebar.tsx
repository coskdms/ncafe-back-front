'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ShoppingCart, Settings } from 'lucide-react';
import styles from './AdminSidebar.module.css';

const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: '대시보드' },
    { href: '/admin/menus', icon: UtensilsCrossed, label: '메뉴 관리' },
    { href: '/admin/orders', icon: ShoppingCart, label: '주문 관리' },
    { href: '/admin/settings', icon: Settings, label: '설정' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Link href="/admin">
                    <span className={styles.logoText}>NCafe</span>
                    <span className={styles.logoSub}>Admin</span>
                </Link>
            </div>

            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navItem} ${active ? styles.active : ''}`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.footer}>
                <p className={styles.cafeName}>우리동네 커피숍</p>
            </div>
        </aside>
    );
}
