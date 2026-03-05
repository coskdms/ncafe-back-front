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

        // BFF: 다른 컴포넌트에서 login/logout 이벤트 발생 시 상태 갱신
        const onLogin = () => checkAuth();
        const onLogout = () => checkAuth();
        window.addEventListener('login', onLogin);
        window.addEventListener('logout', onLogout);
        return () => {
            window.removeEventListener('login', onLogin);
            window.removeEventListener('logout', onLogout);
        };
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
                        {!isLoading && (
                            isAuthenticated ? (
                                <>
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
                    {!isLoading && (
                        isAuthenticated ? (
                            <>
                                <span className={styles.mobileUserName}>👋 {user?.nickname}님</span>
                                <button onClick={handleLogout} className={styles.mobileLoginBtn}>로그아웃</button>
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
