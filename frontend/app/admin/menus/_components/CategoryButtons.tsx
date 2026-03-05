'use client';

import { Category } from '@/types/category';
import { useEffect, useState } from 'react';

interface CategoryButtonsProps {
    onCategoryChange?: (categoryId: number | null) => void;
}

export default function CategoryButtons({ onCategoryChange }: CategoryButtonsProps) {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/next-api/admin/categories');
            const data = await response.json();
            setCategories(data);
        }
        fetchCategories();
    }, []);

    const handleClick = (categoryId: number | null) => {
        if (onCategoryChange) {
            onCategoryChange(categoryId);
        }
    };

    return (
        <section>
            <h2>Categories</h2>
            <button
                type="button"
                style={{ padding: '8px 16px', marginRight: '8px', cursor: 'pointer' }}
                onClick={() => handleClick(null)}
            >
                전체
            </button>
            {categories.map(category => (
                <button
                    key={category.id}
                    type="button"
                    style={{ padding: '8px 16px', marginRight: '8px', cursor: 'pointer' }}
                    onClick={() => handleClick(category.id)}
                >
                    {category.name}
                </button>
            ))}
        </section>
    );
}


