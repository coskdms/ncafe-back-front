'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 메뉴 열렸을 때 스크롤 잠금
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
                    <Coffee size={22} />
                    <span>NCafe</span>
                </Link>

                {/* Desktop Links */}
                <div className={styles.desktopLinks}>
                    <Link href="/" className={styles.link}>홈</Link>
                    <Link href="/menus" className={styles.link}>메뉴</Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={styles.toggle}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
                <div className={styles.mobileLinks}>
                    <Link href="/" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                        홈
                    </Link>
                    <Link href="/menus" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                        메뉴
                    </Link>
                </div>
            </div>
        </nav>
    );
}
