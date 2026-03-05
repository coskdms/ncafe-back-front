'use client';

import { useEffect, useState, useCallback } from 'react';

export interface CustomerMenuResponse {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    imagesSrc: string;
}

interface MenuListResponseDto {
    menus: CustomerMenuResponse[];
    setMenus: React.Dispatch<React.SetStateAction<CustomerMenuResponse[]>>;
    totalCount: number;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export interface MenuListParams {
    categoryId?: number | null;
    searchQuery?: string;
}

export function useMenus(params?: MenuListParams): MenuListResponseDto {
    const { categoryId, searchQuery } = params || {};
    const [menus, setMenus] = useState<CustomerMenuResponse[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMenus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            let url = '/api/menus';
            const queryParams = new URLSearchParams();
            if (categoryId !== undefined && categoryId !== null) {
                queryParams.append('categoryId', categoryId.toString());
            }
            if (searchQuery) {
                queryParams.append('searchQuery', searchQuery);
            }
            const qs = queryParams.toString();
            if (qs) {
                url += `?${qs}`;
            }
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('메뉴 데이터를 불러오는데 실패했습니다.');
            }
            const data = await res.json();
            setMenus(data.menus || []);
            setTotalCount(data.totalCount || data.menus?.length || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [categoryId, searchQuery]);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    return { menus, setMenus, totalCount, loading, error, refetch: fetchMenus };
}
