'use client';

import styles from './CategoryTabs.module.css';
import { CategoryResponseDto, useCategories } from './useCategories';


export default function CategoryTabs({ selectedCategory, onCategorySelect }: {
    selectedCategory: number | null;
    onCategorySelect: (categoryId: number | null) => void;
}) {
    const { categories, loading, error } = useCategories();

    if (loading) {
        return (
            <div className={styles.tabs}>
                <span>카테고리 로딩 중...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.tabs}>
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${selectedCategory === null ? styles.active : ''}`}
                onClick={() => onCategorySelect(null)}
            >
                전체
            </button>

            {categories.map((category: CategoryResponseDto) => (
                <button
                    key={category.id}
                    className={`${styles.tab} ${selectedCategory === category.id ? styles.active : ''}`}
                    onClick={() => onCategorySelect(category.id)}
                >
                    {category.icon} &nbsp;
                    {category.name}
                </button>
            ))}
        </div>
    );
}