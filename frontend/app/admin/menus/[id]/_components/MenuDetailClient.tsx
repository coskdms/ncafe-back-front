'use client';

import DetailHeader from './DetailHeader/DetailHeader';
import ImageGallery from './ImageGallery/ImageGallery';
import BasicInfo from './BasicInfo/BasicInfo';
import MenuActions from './MenuActions/MenuActions';
import styles from './MenuDetailClient.module.css';
import { use } from 'react';

export default function MenuDetailClient({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);

    return (
        <main className={styles.container}>
            {/* 헤더 */}
            <DetailHeader
                title="메뉴 상세"
            />

            <div className={styles.content}>
                {/* 왼쪽: 이미지 갤러리 */}
                <ImageGallery
                    menuId={id}
                />

                {/* 오른쪽: 기본 정보 */}
                <div className={styles.rightSection}>
                    <BasicInfo
                        id={id}
                    />

                    {/* 액션 버튼 */}
                    <MenuActions />
                </div>
            </div>
        </main>
    );
}
