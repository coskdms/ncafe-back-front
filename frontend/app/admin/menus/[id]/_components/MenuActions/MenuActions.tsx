'use client';

import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import styles from './MenuActions.module.css';

interface MenuActionsProps {
    menuId: number;
    onDelete: () => void;
}

export default function MenuActions({ menuId, onDelete }: MenuActionsProps) {
    const handleDelete = () => {
        if (confirm('정말 삭제하시겠습니까?')) {
            onDelete();
        }
    };

    return (
        <div className={styles.actionsContainer}>
            <Link className={styles.backButton} href="/admin/menus">
                목록으로
            </Link>
            <Link className={styles.editButton} href={`/admin/menus/${menuId}/edit`}>
                <Edit size={18} />
                수정
            </Link>
            <button className={styles.deleteButton} onClick={handleDelete}>
                <Trash2 size={18} />
                삭제
            </button>
        </div>
    );
}
