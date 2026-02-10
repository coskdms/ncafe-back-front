'use client';

import styles from './OptionsInfo.module.css';

interface OptionItem {
    id: number;
    name: string;
    price: number;
}

interface OptionCategory {
    id: number;
    name: string;
    isRequired: boolean;
    isMultiSelect: boolean;
    items: OptionItem[];
}

const DUMMY_OPTIONS: OptionCategory[] = [
    {
        id: 1,
        name: '사이즈 선택',
        isRequired: true,
        isMultiSelect: false,
        items: [
            { id: 101, name: 'Regular', price: 0 },
            { id: 102, name: 'Large', price: 500 },
        ]
    },
    {
        id: 2,
        name: '온도 (HOT/ICE)',
        isRequired: true,
        isMultiSelect: false,
        items: [
            { id: 201, name: 'HOT', price: 0 },
            { id: 202, name: 'ICE', price: 0 },
        ]
    },
    {
        id: 3,
        name: '샷 추가',
        isRequired: false,
        isMultiSelect: true,
        items: [
            { id: 301, name: '샷 추가', price: 500 },
        ]
    },
    {
        id: 4,
        name: '시럽 선택',
        isRequired: false,
        isMultiSelect: false,
        items: [
            { id: 401, name: '바닐라 시럽', price: 500 },
            { id: 402, name: '헤이즐넛 시럽', price: 500 },
            { id: 403, name: '카라멜 시럽', price: 500 },
        ]
    },
    {
        id: 5,
        name: '얼음 양',
        isRequired: false,
        isMultiSelect: false,
        items: [
            { id: 501, name: '얼음 조금', price: 0 },
            { id: 502, name: '얼음 보통', price: 0 },
            { id: 503, name: '얼음 많이', price: 0 },
        ]
    },
    {
        id: 6,
        name: '휘핑 크림',
        isRequired: false,
        isMultiSelect: false,
        items: [
            { id: 601, name: '휘핑 없이', price: 0 },
            { id: 602, name: '휘핑 조금', price: 0 },
            { id: 603, name: '휘핑 보통', price: 0 },
            { id: 604, name: '휘핑 많이', price: 500 },
        ]
    }
];

export default function OptionsInfo() {
    return (
        <section className={styles.optionsSection}>
            <div className={styles.header}>
                <h2 className={styles.title}>옵션 정보</h2>
            </div>

            <div className={styles.optionsGrid}>
                {DUMMY_OPTIONS.map((category) => (
                    <div key={category.id} className={styles.optionCard}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.categoryName}>{category.name}</h3>
                            <div className={styles.badges}>
                                {category.isRequired && <span className={`${styles.badge} ${styles.required}`}>필수</span>}
                                {category.isMultiSelect ?
                                    <span className={`${styles.badge} ${styles.multi}`}>다중선택</span> :
                                    <span className={`${styles.badge} ${styles.single}`}>단일선택</span>
                                }
                            </div>
                        </div>
                        <ul className={styles.itemList}>
                            {category.items.map((item) => (
                                <li key={item.id} className={styles.item}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    {item.price > 0 && <span className={styles.itemPrice}>+{item.price.toLocaleString()}원</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
