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

export default function DetailHeader() {
    return (
        <header className={styles.header}>
            <Link href="/admin/menus" className={styles.backButton}>
                <ArrowLeft size={18} />
                <span>목록</span>
            </Link>
        </header>
    );
}
