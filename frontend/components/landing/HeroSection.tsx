'use client';

import React from 'react';
import styles from './HeroSection.module.css';
import Button from '@/components/common/Button/Button';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <section className={styles.hero}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <span className={styles.badge}>NCafe에 오신 것을 환영합니다</span>
                <h1 className={styles.title}>
                    순간을 내리고,<br />
                    추억을 만듭니다
                </h1>
                <p className={styles.subtitle}>
                    장인이 직접 로스팅한 커피와 따뜻한 분위기, 소중한 순간들이 함께하는 곳.<br />
                    일상 속 작은 행복을 경험해보세요.
                </p>
                <div className={styles.actions}>
                    <Button variant="primary" size="lg">
                        주문하기
                    </Button>
                    <Link href="/menus">
                        <Button
                            variant="outline"
                            size="lg"
                            style={{ color: 'white', borderColor: 'white' }}
                        >
                            메뉴 보기
                        </Button>
                    </Link>
                </div>
            </div>

            <button className={styles.scrollIndicator} onClick={scrollToContent} aria-label="Scroll down">
                <ChevronDown size={32} />
            </button>
        </section>
    );
}
