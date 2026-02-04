'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/types/category';
import styles from './CategoryTabs.module.css';

interface CategoryTabsProps {
    activeId: string | null;
    onSelect: (id: string | null) => void;
}

export default function CategoryTabs({ activeId, onSelect }: CategoryTabsProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('http://localhost:8080/admin/categories');
                if (!response.ok) {
                    throw new Error('카테고리 데이터를 불러오는데 실패했습니다.');
                }

                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
                className={`${styles.tab} ${activeId === null ? styles.active : ''}`}
                onClick={() => onSelect(null)}
            >
                전체
            </button>

            {categories.map((category) => (
                <button
                    key={category.id}
                    className={`${styles.tab} ${activeId === String(category.id) ? styles.active : ''}`}
                    onClick={() => onSelect(String(category.id))}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}