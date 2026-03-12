'use client';

import DetailHeader from './DetailHeader/DetailHeader';
import ImageGallery from './ImageGallery/ImageGallery';
import BasicInfo from './BasicInfo/BasicInfo';
import OptionsInfo from './OptionsInfo/OptionsInfo';
import MenuActions from './MenuActions/MenuActions';
import styles from './MenuDetailClient.module.css';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/app/lib/api';
import { toast } from '@/stores/toastStore';

export default function MenuDetailClient({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            await fetchAPI(`/admin/menus/${id}`, { method: 'DELETE' });
            toast.success('삭제되었습니다.');
            router.push('/admin/menus');
        } catch (error) {
            console.error('삭제 오류:', error);
            toast.error('메뉴를 삭제하는 중 오류가 발생했습니다.');
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.content}>
                {/* 왼쪽 컬럼: 이미지 & 기본 정보 */}
                <div className={styles.leftColumn}>
                    <ImageGallery menuId={id} />
                    <BasicInfo id={id} />
                </div>

                {/* 오른쪽 컬럼: 옵션 정보 */}
                <div className={styles.rightColumn}>
                    <OptionsInfo id={id} />
                </div>
            </div>

            {/* 하단 액션 버튼 */}
            <div className={styles.actionWrapper}>
                <MenuActions menuId={id} onDelete={handleDelete} />
            </div>
        </main>
    );
}
