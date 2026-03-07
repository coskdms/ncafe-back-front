'use client';

import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/app/lib/api';
import MenuForm, { MenuFormData } from '../_components/MenuForm/MenuForm';
import styles from './page.module.css';

export default function NewMenuPage() {
    const router = useRouter();

    const handleSubmit = async (data: MenuFormData) => {
        try {
            // 새 메뉴 등록
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
                    imageSrc: ''
                })
            });

            const newMenuId = response.id;
            
            // 이미지 등록
            if (data.images && data.images.length > 0) {
                const formData = new FormData();
                const newFiles = data.images.filter(img => img instanceof File) as File[];
                
                // 새로운 메뉴이므로 기존에 유지할 이미지 id는 없음
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
            }

            alert('메뉴가 성공적으로 등록되었습니다.');
            router.push('/admin/menus');
        } catch (error) {
            console.error(error);
            alert('메뉴 등록 중 오류가 발생했습니다.');
        }
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
