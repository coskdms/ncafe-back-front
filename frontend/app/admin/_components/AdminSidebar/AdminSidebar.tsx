'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ShoppingCart, Settings, Menu, X, FolderTree } from 'lucide-react';
import styles from './AdminSidebar.module.css';
import { useState, useEffect } from 'react';

const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: '대시보드' },
    { href: '/admin/menus', icon: UtensilsCrossed, label: '메뉴 관리' },
    { href: '/admin/categories', icon: FolderTree, label: '카테고리 관리' },
    { href: '/admin/orders', icon: ShoppingCart, label: '주문 관리' },
    { href: '/admin/settings', icon: Settings, label: '설정' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // 경로 변경 시 모바일 메뉴 닫기
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // 모바일 메뉴 열리면 스크롤 잠금
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile Top Bar */}
            <div className={styles.mobileBar}>
                <Link href="/admin" className={styles.mobileLogoLink}>
                    <span className={styles.logoText}>NCafe</span>
                    <span className={styles.logoSub}>Admin</span>
                </Link>
                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle sidebar"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
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
        </>
    );
}
