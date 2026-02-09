'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Coffee } from 'lucide-react';
import styles from './ImageGallery.module.css';
import { useMenuImages } from './useMenuImages';

export default function ImageGallery({ menuId }: { menuId: number }) {
    const { images, loading } = useMenuImages(menuId);
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (loading) {
        return (
            <section className={styles.imageSection}>
                <div className={styles.mainImageWrapper}>
                    <div className={styles.placeholder}>
                        <span>로딩중...</span>
                    </div>
                </div>
            </section>
        );
    }

    // 이미지가 없는 경우
    if (!images || images.length === 0) {
        return (
            <section className={styles.imageSection}>
                <div className={styles.mainImageWrapper}>
                    <div className={styles.placeholder}>
                        <Coffee size={64} />
                        <span>이미지 없음</span>
                    </div>
                </div>
            </section>
        );
    }

    // 현재 선택된 이미지 (기본값: 첫 번째 이미지)
    const mainImage = images[selectedIndex];

    return (
        <section className={styles.imageSection}>
            {/* 메인 이미지 */}
            <div className={styles.mainImageWrapper}>
                <div className={styles.imageContainer}>
                    <Image
                        key={mainImage.srcUrl}
                        src={`http://localhost:8080/images/menus/${mainImage.srcUrl}`}
                        alt={mainImage.altText || "Menu Main Image"}
                        fill
                        className={styles.mainImage}
                        priority
                    />
                </div>
            </div>

            {/* 썸네일 목록 (이미지가 2개 이상일 때만 표시) */}
            {images.length > 1 && (
                <div className={styles.thumbnailList}>
                    {images.map((img, idx) => (
                        <button
                            key={img.id}
                            className={`${styles.thumbnail} ${idx === selectedIndex ? styles.active : ''}`}
                            onClick={() => setSelectedIndex(idx)}
                        >
                            <div className={styles.thumbnailImageWrapper}>
                                <Image
                                    src={`http://localhost:8080/images/menus/${img.srcUrl}`}
                                    alt={`${img.altText || 'Thumbnail'} ${idx + 1}`}
                                    fill
                                    className={styles.thumbnailImage}
                                />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
