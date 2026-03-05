'use client';

import { useEffect, useState, useCallback } from 'react';

// 백엔드 MenuResponse DTO에 맞는 인터페이스
export interface MenuResponse {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;  // Integer
    categoryName: string | null;
    imagesSrc: string | null;
    isAvailable: boolean;
    isSoldOut: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}
// 백엔드 MenuListResponse DTO에 맞는 인터페이스
export interface MenuListResponse {
    menus: MenuResponse[];
    totalCount: number;
}

interface MenuListResponseDto {
    menus: MenuResponse[];
    setMenus: React.Dispatch<React.SetStateAction<MenuResponse[]>>;
    totalCount: number;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// 메뉴 목록 요청 파라미터
export interface MenuListParams {
    categoryId?: number | null;
    searchQuery?: string | null;
}

export function useMenus(params?: MenuListParams): MenuListResponseDto {
    const { categoryId, searchQuery } = params || {};

    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMenus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const url = new URL("/next-api/admin/menus", window.location.origin);
            if (categoryId) {
                url.searchParams.append('categoryId', categoryId.toString());
            }
            if (searchQuery && searchQuery.trim()) {
                url.searchParams.append('searchQuery', searchQuery.trim());
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('메뉴 데이터를 불러오는데 실패했습니다.');
            }

            // 백엔드 응답: { menus: [], totalCount: 100 }
            const data: MenuListResponse = await response.json();
            setMenus(data.menus);
            setTotalCount(data.totalCount);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [categoryId, searchQuery]);

    // categoryId, searchQuery가 변경될 때마다 fetch
    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    return { menus, setMenus, totalCount, loading, error, refetch: fetchMenus };
}
