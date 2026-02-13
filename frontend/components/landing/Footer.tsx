import { Coffee, Facebook, Instagram, Twitter } from 'lucide-react';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <div className={styles.brand}>
                        <Coffee size={24} />
                        <span className={styles.logoText}>NCafe</span>
                    </div>
                    <p className={styles.copyright}>© 2024 <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none', cursor: 'text' }}>엔카페</Link>. All rights reserved.</p>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.heading}>바로가기</h4>
                    <Link href="/" className={styles.link}>홈</Link>
                    <Link href="/menus" className={styles.link}>메뉴</Link>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.heading}>소셜 미디어</h4>
                    <div className={styles.socials}>
                        <Link href="#"><Facebook size={20} /></Link>
                        <Link href="#"><Instagram size={20} /></Link>
                        <Link href="#"><Twitter size={20} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
