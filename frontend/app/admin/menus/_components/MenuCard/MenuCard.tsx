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
            <div className={styles.imageWrapper}>
                {dragEnabled && (
                    <div
                        className={styles.dragHandle}
                        {...attributes}
                        {...listeners}
                        aria-label="Drag to reorder"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical size={16} />
                    </div>
                )}

                {/* imagesSrc가 있으면 이미지 표시, 없으면 placeholder */}
                {menu.imagesSrc ? (
                    <Image
                        src={`http://localhost:8080/${menu.imagesSrc}`}
                        alt={menu.korName}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <Coffee size={48} />
                    </div>
                )}

                {!menu.isAvailable && (
                    <div className={styles.soldOutBadge}>품절</div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h3 className={styles.name}>{menu.korName}</h3>
                        <p className={styles.engName}>{menu.engName}</p>
                    </div>
                    {/* <span className={styles.category}>{menu.category.korName}</span> */}
                </div>

                <p className={styles.price}>₩{formatPrice(menu.price)}</p>

                <div className={styles.footer}>
                    <label
                        className={styles.toggle}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="checkbox"
                            checked={!menu.isAvailable}
                            onChange={() => onToggleSoldOut(menu.id)}
                        />
                        <span className={styles.toggleSlider}></span>
                        <span className={styles.toggleLabel}>품절</span>
                    </label>

                    <div className={styles.actions}>
                        <Link
                            href={`/admin/menus/${menu.id}/edit`}
                            className={styles.actionButton}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Edit size={16} />
                        </Link>
                        <button
                            className={`${styles.actionButton} ${styles.danger}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(menu.id);
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
