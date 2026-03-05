'use client';

import { useEffect, useState } from 'react';

export interface CategoryResponseDto {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
    menuCount: number;
}

interface CategoryListResponseDto {
    categories: CategoryResponseDto[];
    totalCount: number;
    loading: boolean;
    error: string | null;
}

export function useCategories(): CategoryListResponseDto {
    const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/next-api/admin/categories');
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

    return {
        categories,
        totalCount: 0,
        loading,
        error
    };
}
