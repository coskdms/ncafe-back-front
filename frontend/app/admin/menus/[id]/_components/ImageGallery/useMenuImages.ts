import { useState, useEffect, useCallback } from 'react';

export interface MenuImageResponse {
    id: number;
    menuId: number;
    srcUrl: string;
    altText: string;
    sortOrder: number;
}

interface UseMenuImagesResult {
    images: MenuImageResponse[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useMenuImages(menuId: number): UseMenuImagesResult {
    const [images, setImages] = useState<MenuImageResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = useCallback(async () => {
        if (!menuId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/next-api/admin/menus/${menuId}/menu-images`);
            if (!response.ok) {
                throw new Error('이미지 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            // 백엔드 응답 구조: { images: [...] }
            setImages(data.images || []);

        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [menuId]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    return { images, loading, error, refetch: fetchImages };
}
