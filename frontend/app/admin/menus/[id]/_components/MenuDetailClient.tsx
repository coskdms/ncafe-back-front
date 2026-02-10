'use client';

import DetailHeader from './DetailHeader/DetailHeader';
import ImageGallery from './ImageGallery/ImageGallery';
import BasicInfo from './BasicInfo/BasicInfo';
import OptionsInfo from './OptionsInfo/OptionsInfo';
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
                {/* 왼쪽 컬럼: 이미지 & 기본 정보 */}
                <div className={styles.leftColumn}>
                    <ImageGallery menuId={id} />
                    <BasicInfo id={id} />
                </div>

                {/* 오른쪽 컬럼: 옵션 정보 */}
                <div className={styles.rightColumn}>
                    <OptionsInfo />
                </div>
            </div>

            {/* 하단 액션 버튼 */}
            <div className={styles.actionWrapper}>
                <MenuActions />
            </div>
        </main>
    );
}
