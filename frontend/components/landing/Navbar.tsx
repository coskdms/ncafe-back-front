'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>🐤 고라파덕 카페</Link>
                <div className={styles.desktopLinks}>
                    <a href="#about">카페 소개</a>
                    <Link href="/menus">특별 메뉴</Link>
                    <a href="#">매장 안내</a>
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
                </div>
            )}
        </nav>
    );
}
