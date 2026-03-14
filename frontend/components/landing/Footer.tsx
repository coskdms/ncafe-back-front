'use client';

import styles from './Footer.module.css';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Footer() {
    const router = useRouter();
    const pathname = usePathname();

    const scrollToSection = (sectionId: string) => {
        if (pathname !== '/') {
            router.push(`/#${sectionId}`);
            return;
        }
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <span className={styles.logo}>🐤 고라파덕 카페</span>
                    <p className={styles.tagline}>세상에서 가장 귀여운 포켓몬 카페</p>
                </div>
                <div className={styles.links}>
                    <h4>고라파덕 카페</h4>
                    <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>카페 소개</a>
                    <Link href="/menus" style={{ color: 'inherit', textDecoration: 'none' }}>메뉴</Link>
                    <a href="#location" onClick={(e) => { e.preventDefault(); scrollToSection('location'); }}>매장 안내</a>
                </div>
                <div className={styles.links}>
                    <h4>고객 지원</h4>
                    <a href="#">자주 묻는 질문</a>
                    <a href="#">예약 문의</a>
                    <a href="#">이벤트</a>
                </div>
                <div className={styles.bottom}>
                    <p>
                        © 2026{' '}
                        <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none', cursor: 'text' }}>
                            고라파덕 카페
                        </Link>
                        . All rights reserved. 🐤
                    </p>
                </div>
            </div>
        </footer>
    );
}
