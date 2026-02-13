'use client';

import React from 'react';
import styles from './MarqueeSection.module.css';

export default function MarqueeSection() {
    // Duplicate text to create seamless loop
    const items = [
        "신선한 커피", "매일 로스팅", "아늑한 분위기", "프리미엄 원두", "전문 바리스타",
        "매일 08:00 - 22:00", "무료 와이파이", "수제 디저트"
    ];

    // Create enough duplicates to fill screen
    const repeatedItems = [...items, ...items, ...items, ...items];

    return (
        <div className={styles.marqueeContainer}>
            <div className={styles.track}>
                {repeatedItems.map((item, index) => (
                    <div key={index} className={styles.item}>
                        {item}
                        <span className={styles.separator}></span>
                    </div>
                ))}
            </div>
        </div>
    );
}
