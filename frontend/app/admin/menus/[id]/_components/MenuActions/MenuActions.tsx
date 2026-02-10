'use client';

import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import styles from './MenuActions.module.css';

interface MenuActionsProps {
    menuId: number;
    onDelete: () => void;
}

export default function MenuActions() {
    // const handleDelete = () => {
    //     if (confirm('정말 삭제하시겠습니까?')) {
    //         onDelete();
    //     }
    // };

    return (
        <div className={styles.actionsContainer}>
            <Link className={styles.editButton} href={``}>
                <Edit size={18} />
                수정
            </Link>
            <button className={styles.deleteButton}>
                <Trash2 size={18} />
                삭제
            </button>
        </div>
    );
}
