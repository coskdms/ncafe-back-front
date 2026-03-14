'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import styles from './MenuCard.module.css';
import { CustomerMenuResponse } from '../MenuList/useMenus';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';

interface MenuCardProps {
    menu: CustomerMenuResponse;
}

export default function MenuCard({ menu }: MenuCardProps) {
    const { isAuthenticated } = useAuthStore();
    const { isFavorited, toggleFavorite } = useFavoriteStore();
    const favorited = isFavorited(menu.id);

    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return '';
        return price.toLocaleString('ko-KR') + '원';
    };

    const firstImage = menu.imagesSrc
        ? menu.imagesSrc.split(',')[0].trim()
        : 'blank.png';

    const handleHeartClick = async (e: React.MouseEvent) => {
        e.preventDefault(); // Link 이동 방지
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.info('로그인 후 찜할 수 있습니다! 🐤');
            return;
        }

        const result = await toggleFavorite(menu.id);
        if (result) {
            toast.success(`${menu.korName} 찜 완료! ❤️`);
        } else {
            toast.info(`${menu.korName} 찜 해제 🤍`);
        }
    };

    return (
        <Link href={`/menus/${menu.id}`} style={{ textDecoration: 'none' }}>
            <div className={styles.card}>
                {/* 찜 하트 버튼 */}
                <button
                    className={`${styles.heartBtn} ${favorited ? styles.heartActive : ''}`}
                    onClick={handleHeartClick}
                    aria-label={favorited ? '찜 해제' : '찜하기'}
                >
                    <Heart
                        size={18}
                        fill={favorited ? '#ef4444' : 'none'}
                        color={favorited ? '#ef4444' : '#a3a3a3'}
                    />
                </button>

                <img
                    src={`/images/${firstImage}`}
                    alt={menu.korName}
                    className={styles.cardImage}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/blank.png';
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
