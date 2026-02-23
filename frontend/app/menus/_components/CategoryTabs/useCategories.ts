'use client';

import { useEffect, useState, useCallback } from 'react';

export interface CategoryResponse {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
}

interface CategoryListResponseDto {
    categories: CategoryResponse[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useCategories(): CategoryListResponseDto {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/categories');
            if (!res.ok) {
                throw new Error('카테고리 데이터를 불러오는데 실패했습니다.');
            }
            const data = await res.json();
            setCategories(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, error, refetch: fetchCategories };
}
