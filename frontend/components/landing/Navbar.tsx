'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import styles from './Navbar.module.css';

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Zustand 스토어에서 인증 상태를 가져옵니다.
    const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();

    // 컴포넌트가 처음 로드될 때 서버에 세션 유효 여부를 확인합니다.
    // (페이지 새로고침 후에도 로그인 상태를 복구하기 위함)
    useEffect(() => {
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
        router.push('/');
    };

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>🐤 고라파덕 카페</Link>
                <div className={styles.desktopLinks}>
                    <a href="#about">카페 소개</a>
                    <Link href="/menus">특별 메뉴</Link>
                    <a href="#">매장 안내</a>
                    {!isLoading && (
                        isAuthenticated ? (
                            <>
                                <span className={styles.userName}>👋 {user?.username}님</span>
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
            {isOpen && (
                <div className={styles.mobileMenu}>
                    <a href="#about" onClick={() => setIsOpen(false)}>카페 소개</a>
                    <Link href="/menus" onClick={() => setIsOpen(false)}>특별 메뉴</Link>
                    <a href="#" onClick={() => setIsOpen(false)}>매장 안내</a>
                    {!isLoading && (
                        isAuthenticated ? (
                            <>
                                <span className={styles.mobileUserName}>👋 {user?.username}님</span>
                                <button onClick={handleLogout} className={styles.mobileLoginBtn}>로그아웃</button>
                            </>
                        ) : (
                            <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsOpen(false)}>로그인</Link>
                        )
                    )}
                </div>
            )}
        </nav>
    );
}
