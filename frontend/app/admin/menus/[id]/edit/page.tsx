'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MenuForm, { MenuFormData } from '../../_components/MenuForm/MenuForm';
import styles from './page.module.css';
import { fetchAPI } from '@/app/lib/api';
import { toast } from '@/stores/toastStore';
import { getErrorMessage } from '@/utils/errorMessage';

export default function EditMenuPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [menuData, setMenuData] = useState<MenuFormData | null>(null);

    useEffect(() => {
        const fetchMenuDetail = async () => {
            try {
                const [data, imagesData] = await Promise.all([
                    fetchAPI(`/admin/menus/${id}`),
                    fetchAPI(`/admin/menus/${id}/menu-images`).catch(() => ({ images: [] }))
                ]);

                if (data) {
                    const formattedImages = imagesData?.images ? imagesData.images.map((img: any) => ({
                        id: img.id,
                        url: `/images/${img.srcUrl}`,
                        isPrimary: img.sortOrder === 0
                    })) : [];

                    const formData: MenuFormData = {
                        korName: data.korName,
                        engName: data.engName || '',
                        categoryId: String(data.categoryId || ''),
                        price: Number(data.price),
                        description: data.description || '',
                        isAvailable: data.isAvailable,
                        images: formattedImages,
                        optionGroups: data.optionGroups || []
                    };
                    setMenuData(formData);
                } else {
                    toast.error('메뉴를 찾을 수 없습니다.');
                    router.push('/admin/menus');
                }
            } catch (error) {
                console.error(error);
                toast.error(getErrorMessage(error, '메뉴 데이터를 불러오는 중 오류가 발생했습니다.'));
                router.push('/admin/menus');
            }
        };

        if (id) {
            fetchMenuDetail();
        }
    }, [id, router]);

    const handleSubmit = async (data: MenuFormData) => {
        try {
            await fetchAPI(`/admin/menus/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    korName: data.korName,
                    engName: data.engName,
                    description: data.description,
                    price: String(data.price),
                    categoryId: data.categoryId,
                    isAvailable: data.isAvailable,
                    sortOrder: 1, // 기존 유지 또는 새로 세팅 로직
                    imageSrc: '', // 메인 이미지는 서버에서 처리
                    optionGroups: data.optionGroups
                })
            });

            // 이미지 업로드
            const formData = new FormData();
            const newFiles = data.images.filter(img => img instanceof File) as File[];
            const retainedImageIds = data.images
                .filter(img => !(img instanceof File) && (img as any).id)
                .map(img => (img as any).id);

            // 전체 이미지 순서 정보 생성 (id:번호 또는 file:인덱스)
            const imageOrder = data.images.map(img => {
                if (img instanceof File) {
                    const fileIndex = newFiles.indexOf(img);
                    return `file:${fileIndex}`;
                } else {
                    return `id:${(img as any).id}`;
                }
            });

            retainedImageIds.forEach(imgId => formData.append('retainedImageIds', imgId.toString()));
            newFiles.forEach(file => formData.append('files', file));
            imageOrder.forEach(order => formData.append('imageOrder', order));

            await fetchAPI(`/admin/menus/${id}/images`, {
                method: 'POST',
                body: formData
            });

            toast.success('메뉴가 수정되었습니다.');
            router.push(`/admin/menus/${id}`);
        } catch (e) {
            console.error(e);
            toast.error(getErrorMessage(e, '메뉴 수정 중 오류가 발생했습니다.'));
        }
    };

    if (!menuData) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <main className={styles.container}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>메뉴 수정</h1>
            <MenuForm
                initialData={menuData}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </main>
    );
}
