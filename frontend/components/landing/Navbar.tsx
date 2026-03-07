'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingCart } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Zustand 스토어에서 인증 상태와 카트 상태를 가져옵니다.
    const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const cartItemsCount = useCartStore((state) => state.getTotalItems());

    // 컴포넌트 처음 로드될 때 서버 세션 확인 및 마운트 상태 설정
    useEffect(() => {
        setIsMounted(true);
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        window.location.href = '/';
    };

    return (
        <>
            <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.inner}>
                    <Link href="/" className={styles.logo}>🐤 고라파덕 카페</Link>
                    <div className={styles.desktopLinks}>
                        <Link href="/#about">카페 소개</Link>
                        <Link href="/menus">특별 메뉴</Link>
                        <Link href="/#location">매장 안내</Link>
                        
                        {/* 장바구니 아이콘 추가 */}
                        <Link href="/cart" className={styles.cartIcon} title="장바구니">
                            <ShoppingCart size={22} />
                            {isMounted && cartItemsCount > 0 && (
                                <span className={styles.cartBadge}>{cartItemsCount}</span>
                            )}
                        </Link>

                        {!isLoading && (
                            isAuthenticated ? (
                                <>
                                    {user?.role === 'ADMIN' && (
                                        <Link href="/admin" className={styles.adminBtn}>관리자 메뉴</Link>
                                    )}
                                    <span className={styles.userName}>👋 {user?.nickname}님</span>
                                    <button onClick={handleLogout} className={styles.logoutBtn}>로그아웃</button>
                                </>
                            ) : (
                                <Link href="/login" className={styles.loginBtn}>로그인</Link>
                            )
                        )}
                    </div>
                    <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)} aria-label="메뉴">
                        {isOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>
            {isOpen && (
                <div className={styles.mobileMenu}>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="닫기">
                        ✕
                    </button>
                    <Link href="/#about" onClick={() => setIsOpen(false)}>카페 소개</Link>
                    <Link href="/menus" onClick={() => setIsOpen(false)}>특별 메뉴</Link>
                    <Link href="/#location" onClick={() => setIsOpen(false)}>매장 안내</Link>
                    
                    {/* 모바일 장바구니 링크 */}
                    <Link href="/cart" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        장바구니
                        {isMounted && cartItemsCount > 0 && (
                            <span style={{ 
                                background: '#ef4444', 
                                color: 'white', 
                                borderRadius: '12px', 
                                padding: '2px 10px', 
                                fontSize: '0.9rem' 
                            }}>
                                {cartItemsCount}
                            </span>
                        )}
                    </Link>

                    {!isLoading && (
                        isAuthenticated ? (
                            <>
                                {user?.role === 'ADMIN' && (
                                    <Link href="/admin" className={styles.mobileAdminBtn} onClick={() => setIsOpen(false)}>관리자 메뉴</Link>
                                )}
                                <span className={styles.mobileUserName}>👋 {user?.nickname}님</span>
                                <button onClick={handleLogout} className={styles.mobileLogoutBtn}>로그아웃</button>
                            </>
                        ) : (
                            <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsOpen(false)}>로그인</Link>
                        )
                    )}
                </div>
            )}
        </>
    );
}
