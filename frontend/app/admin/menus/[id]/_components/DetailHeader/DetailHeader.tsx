'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './DetailHeader.module.css';

// interface DetailHeaderProps {
//     backUrl: string;
//     backLabel?: string;
//     createdAt: string;
//     updatedAt: string;
// }

export default function DetailHeader({ title }: { title: string }) {
    // 날짜 포맷팅 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <header className={styles.header}>
            {/* <Link href={backUrl} className={styles.backButton}>
                <ArrowLeft size={20} />
                <span>{backLabel}</span>
            </Link>
            <div className={styles.dateInfo}>
                <span>생성: {formatDate(createdAt)}</span>
                <span>수정: {formatDate(updatedAt)}</span>
            </div> */}
        </header>
    );
}
