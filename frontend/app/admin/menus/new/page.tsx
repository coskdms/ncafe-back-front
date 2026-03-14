'use client';

import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/app/lib/api';
import MenuForm, { MenuFormData } from '../_components/MenuForm/MenuForm';
import styles from './page.module.css';
import { toast } from '@/stores/toastStore';
import { getErrorMessage } from '@/utils/errorMessage';

export default function NewMenuPage() {
    const router = useRouter();

    const handleSubmit = async (data: MenuFormData) => {
        let newMenuId: number | null = null;

        try {
            // 1단계: 메뉴 정보 등록
            const response = await fetchAPI('/admin/menus', {
                method: 'POST',
                body: JSON.stringify({
                    korName: data.korName,
                    engName: data.engName || '',
                    description: data.description || '',
                    price: String(data.price),
                    categoryId: data.categoryId,
                    isAvailable: data.isAvailable,
                    sortOrder: 99,
                    imageSrc: '',
                    optionGroups: data.optionGroups
                })
            });

            newMenuId = response.id;
        } catch (error) {
            console.error(error);
            toast.error(getErrorMessage(error, '메뉴 등록 중 오류가 발생했습니다.'));
            return;
        }

        // 2단계: 이미지 업로드 (메뉴는 이미 저장됨)
        if (data.images && data.images.length > 0 && newMenuId) {
            try {
                const formData = new FormData();
                const newFiles = data.images.filter(img => img instanceof File) as File[];
                
                const imageOrder = data.images.map(img => {
                    const fileIndex = newFiles.indexOf(img as File);
                    return `file:${fileIndex}`;
                });
                
                newFiles.forEach(file => formData.append('files', file));
                imageOrder.forEach(order => formData.append('imageOrder', order));

                await fetchAPI(`/admin/menus/${newMenuId}/images`, {
                    method: 'POST',
                    body: formData
                });

                toast.success('메뉴가 성공적으로 등록되었습니다.');
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                toast.warning('메뉴는 등록되었지만, 이미지 업로드에 실패했습니다. 메뉴 수정에서 이미지를 다시 등록해주세요.');
            }
        } else {
            toast.success('메뉴가 성공적으로 등록되었습니다.');
        }

        router.push('/admin/menus');
    };

    return (
        <main className={styles.container}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>새 메뉴 등록</h1>
            <MenuForm
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </main>
    );
}
