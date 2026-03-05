'use client';

import Link from 'next/link';
import styles from './MenuCard.module.css';
import { CustomerMenuResponse } from '../MenuList/useMenus';

interface MenuCardProps {
    menu: CustomerMenuResponse;
}

export default function MenuCard({ menu }: MenuCardProps) {
    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return '';
        return price.toLocaleString('ko-KR') + '원';
    };

    const firstImage = menu.imagesSrc
        ? menu.imagesSrc.split(',')[0].trim()
        : 'blank.png';

    return (
        <Link href={`/menus/${menu.id}`} style={{ textDecoration: 'none' }}>
            <div className={styles.card}>
                <img
                    src={`/next-images/${firstImage}`}
                    alt={menu.korName}
                    className={styles.cardImage}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/next-images/blank.png';
                    }}
                />
                <h3 className={styles.cardTitle}>{menu.korName}</h3>
                {menu.engName && (
                    <div className={styles.cardSubtitle}>
                        {menu.engName}
                    </div>
                )}
                <p className={styles.cardDesc}>
                    {menu.description || '맛있는 고라파덕 카페의 메뉴입니다!'}
                </p>
                <div className={styles.cardPriceContainer}>
                    <span className={styles.cardPrice}>
                        {formatPrice(menu.price)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
