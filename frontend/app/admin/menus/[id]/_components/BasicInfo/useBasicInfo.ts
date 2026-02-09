'use client';

import { useEffect, useState, useCallback } from 'react';

// 백엔드 MenuDetailResponse DTO에 맞는 인터페이스
export interface MenuDetailResponse {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: string;
    categoryId: string | null;
    categoryName: string | null;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UseBasicInfoResult {
    menu: MenuDetailResponse | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useBasicInfo(menuId: number): UseBasicInfoResult {
    const [menu, setMenu] = useState<MenuDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMenu = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:8080/admin/menus/${menuId}`);
            if (!response.ok) {
                throw new Error('메뉴 데이터를 불러오는데 실패했습니다.');
            }

            const data: MenuDetailResponse = await response.json();
            setMenu(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [menuId]);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    return { menu, loading, error, refetch: fetchMenu };
}
