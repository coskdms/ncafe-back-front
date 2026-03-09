'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Coffee, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuResponse } from '../MenuList/useMenus';
import styles from './MenuCard.module.css';

interface MenuCardProps {
    menu: MenuResponse;
    onToggleSoldOut: (id: number) => void;
    onDelete: (id: number) => void;
    dragEnabled?: boolean;
}

export default function MenuCard({ menu, onToggleSoldOut, onDelete, dragEnabled = true }: MenuCardProps) {
    const router = useRouter();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: menu.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // price 포맷팅
    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('ko-KR').format(numPrice);
    };

    const handleCardClick = () => {
        if (!isDragging) {
            router.push(`/admin/menus/${menu.id}`);
        }
    };

    return (
        <div
            className={`${styles.card} ${isDragging ? styles.isDragging : ''}`}
            ref={setNodeRef}
            style={style}
            onClick={handleCardClick}
        >
            <div className={styles.menuInfo}>
                {dragEnabled && (
                    <div
                        className={styles.dragHandle}
                        {...attributes}
                        {...listeners}
                        aria-label="Drag to reorder"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical size={20} />
                    </div>
                )}
                
                <div className={styles.imageWrapper}>
                    {menu.imagesSrc ? (
                        <Image
                            src={`/images/${menu.imagesSrc}`}
                            alt={menu.korName}
                            fill
                            sizes="60px"
                            className={styles.image}
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            <Coffee size={24} />
                        </div>
                    )}
                    {!menu.isAvailable && (
                        <div className={styles.soldOutBadge}>품절</div>
                    )}
                </div>

                <div className={styles.menuDetails}>
                    <h3 className={styles.name}>{menu.korName}</h3>
                    <p className={styles.engName}>{menu.engName}</p>
                    <p className={styles.price}>₩{formatPrice(menu.price)}</p>
                </div>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.toggleWrapper} onClick={(e) => e.stopPropagation()}>
                    <span className={styles.toggleLabel}>품절 표시</span>
                    <label className={styles.toggle}>
                        <input
                            type="checkbox"
                            checked={!menu.isAvailable}
                            onChange={() => onToggleSoldOut(menu.id)}
                        />
                        <span className={styles.toggleSlider}></span>
                    </label>
                </div>

                <div className={styles.itemActions}>
                    <Link
                        href={`/admin/menus/${menu.id}/edit`}
                        className={`${styles.actionIconBtn} ${styles.editBtn}`}
                        onClick={(e) => e.stopPropagation()}
                        title="수정"
                    >
                        <Edit size={18} />
                    </Link>
                    <button
                        className={`${styles.actionIconBtn} ${styles.deleteBtn}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(menu.id);
                        }}
                        title="삭제"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
