'use client';

import styles from './OptionsInfo.module.css';
import { useBasicInfo } from '../BasicInfo/useBasicInfo';

export default function OptionsInfo({ id }: { id: number }) {
    const { menu, loading } = useBasicInfo(id);

    if (loading) {
        return <div className={styles.optionsSection}>Loading options...</div>;
    }

    const optionGroups = menu?.optionGroups || [];

    return (
        <section className={styles.optionsSection}>
            <div className={styles.header}>
                <h2 className={styles.title}>옵션 정보</h2>
            </div>

            {optionGroups.length === 0 ? (
                <div style={{ padding: '20px', color: '#666' }}>등록된 옵션이 없습니다.</div>
            ) : (
                <div className={styles.optionsGrid}>
                    {optionGroups.map((category) => (
                        <div key={category.id || category.name} className={styles.optionCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.categoryName}>{category.name}</h3>
                                <div className={styles.badges}>
                                    {category.isRequired && <span className={`${styles.badge} ${styles.required}`}>필수</span>}
                                    {category.isMultiple ?
                                        <span className={`${styles.badge} ${styles.multi}`}>다중선택</span> :
                                        <span className={`${styles.badge} ${styles.single}`}>단일선택</span>
                                    }
                                </div>
                            </div>
                            <ul className={styles.itemList}>
                                {category.optionDetails.map((item) => (
                                    <li key={item.id || item.name} className={styles.item}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        {item.additionalPrice > 0 && <span className={styles.itemPrice}>+{item.additionalPrice.toLocaleString()}원</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
