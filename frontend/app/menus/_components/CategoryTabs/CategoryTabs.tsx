'use client';

import styles from './CategoryTabs.module.css';
import { useCategories } from './useCategories';

interface CategoryTabsProps {
    selectedCategory: number | null;
    onCategorySelect: (categoryId: number | null) => void;
}

export default function CategoryTabs({ selectedCategory, onCategorySelect }: CategoryTabsProps) {
    const { categories, loading, error } = useCategories();

    if (loading) {
        return <div className={styles.tabs}><div className={styles.tab}>불러오는 중...</div></div>;
    }

    if (error) {
        return <div className={styles.tabs}><div className={styles.tab}>카테고리 오류</div></div>;
    }

    return (
        <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${selectedCategory === null ? styles.tabActive : ''}`}
                onClick={() => onCategorySelect(null)}
            >
                전체 보기
            </button>
            {categories.map(cat => (
                <button
                    key={cat.id}
                    className={`${styles.tab} ${selectedCategory === cat.id ? styles.tabActive : ''}`}
                    onClick={() => onCategorySelect(cat.id)}
                >
                    {cat.icon} {cat.name}
                </button>
            ))}
        </div>
    );
}
