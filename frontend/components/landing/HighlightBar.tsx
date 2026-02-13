import React from 'react';
import styles from './HighlightBar.module.css';

export default function HighlightBar() {
    const highlights = [
        { value: '12+', label: '년의 경험' },
        { value: '50+', label: '원두 종류' },
        { value: '4.9', label: '고객 평점' },
        { value: '100%', label: '스페셜티 원두' },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {highlights.map((item, index) => (
                    <div key={index} className={styles.item}>
                        <span className={styles.value}>{item.value}</span>
                        <span className={styles.label}>{item.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
