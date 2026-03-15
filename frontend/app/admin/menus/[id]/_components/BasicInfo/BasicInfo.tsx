'use client';

import { useBasicInfo } from './useBasicInfo';
import styles from './BasicInfo.module.css';

export default function BasicInfo({ id }: { id: number }) {

    const { menu } = useBasicInfo(id);


    return (
        <section className={styles.infoSection}>
            {/* 헤더: 이름 & 상태 */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.korName}>{menu?.korName}</h1>
                    <p className={styles.engName}>{menu?.engName}</p>
                </div>
                <div className={styles.badges}>
                </div>
            </div>

            {/* 가격 */}
            <div className={styles.infoBlock}>
                <span className={styles.blockTitle}>가격</span>
                <span className={styles.price}>₩{Number(menu?.price || 0).toLocaleString()}</span>
            </div>

            {/* 설명 */}
            <div className={styles.infoBlock}>
                <span className={styles.blockTitle}>설명</span>
                <p className={styles.description}>
                    {menu?.description || '설명이 없습니다.'}
                </p>
            </div>
        </section>
    );
}
