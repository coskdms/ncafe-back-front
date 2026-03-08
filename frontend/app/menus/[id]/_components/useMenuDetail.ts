'use client';

import { useEffect, useState, useCallback } from 'react';

import { MenuOptionGroup } from '@/types/menu';

export interface CustomerMenuDetail {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    imagesSrc: string;
    optionGroups: MenuOptionGroup[];
}

interface MenuDetailResponseDto {
    menu: CustomerMenuDetail | null;
    loading: boolean;
    error: boolean;
}

export function useMenuDetail(id: string): MenuDetailResponseDto {
    const [menu, setMenu] = useState<CustomerMenuDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchMenuDetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/menus/${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setMenu(data);
                } else {
                    setError(true);
                }
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Failed to fetch menu detail:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchMenuDetail();
    }, [fetchMenuDetail]);

    return { menu, loading, error };
}
