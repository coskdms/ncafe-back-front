'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, ArrowLeft, Coffee } from 'lucide-react';
import Button from '@/components/common/Button';
import { useMenuStore } from '../../../../../stores/menuStore';
import styles from '../page.module.css';

interface MenuDetailClientProps {
    menuId: string;
}

export default function MenuDetailClient({ menuId }: MenuDetailClientProps) {
    const router = useRouter();
    const menu = useMenuStore(state => state.getMenu(menuId));
    const deleteMenu = useMenuStore(state => state.deleteMenu);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (!menu) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '100px 0' }}>
                <p style={{ marginBottom: '20px', fontSize: '18px', color: '#666' }}>메뉴를 찾을 수 없습니다.</p>
                <Link href="/admin/menus">
                    <Button variant="outline">목록으로 돌아가기</Button>
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        if (confirm('정말 삭제하시겠습니까?')) {
            deleteMenu(menu.id);
            alert('삭제되었습니다.');
            router.push('/admin/menus');
        }
    };

    const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR').format(price);

    const images = menu.images && menu.images.length > 0 ? menu.images : [];
    const mainImage = images[selectedImageIndex];

    return (
        <main className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/admin/menus" style={{ cursor: 'pointer' }}>
                        <ArrowLeft size={24} color="#666" />
                    </Link>
                    <div className={styles.titleGroup}>
                        <h1 className={styles.title}>{menu.korName}</h1>
                        <span className={styles.subtitle}>{menu.engName}</span>
                    </div>
                </div>
                <div className={styles.badges}>
                    <span className={`${styles.badge} ${styles.categoryBadge}`}>
                        {menu.category.korName}
                    </span>
                    {menu.isSoldOut ? (
                        <span className={`${styles.badge} ${styles.statusBadge} ${styles.soldOut}`}>품절</span>
                    ) : !menu.isAvailable ? (
                        <span className={`${styles.badge} ${styles.statusBadge} ${styles.hidden}`}>숨김</span>
                    ) : (
                        <span className={`${styles.badge} ${styles.statusBadge}`}>판매중</span>
                    )}
                </div>
            </div>

            <div className={styles.content}>
                {/* Left: Image Gallery */}
                <div className={styles.imageSection}>
                    <div className={styles.mainImageWrapper}>
                        {mainImage ? (
                            <Image
                                src={mainImage.url}
                                alt={menu.korName}
                                fill
                                className={styles.mainImage}
                                priority
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                <Coffee size={64} />
                            </div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className={styles.thumbnailGrid}>
                            {images.map((img, idx) => (
                                <div
                                    key={img.id}
                                    className={`${styles.thumbnail} ${idx === selectedImageIndex ? styles.active : ''}`}
                                    onClick={() => setSelectedImageIndex(idx)}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`Thumbnail ${idx}`}
                                        fill
                                        className={styles.thumbnailImage}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Info & Options */}
                <div className={styles.infoSection}>
                    <div className={styles.infoBlock}>
                        <span className={styles.blockTitle}>PRICE</span>
                        <span className={styles.price}>₩{formatPrice(menu.price)}</span>
                    </div>

                    <div className={styles.infoBlock}>
                        <span className={styles.blockTitle}>DESCRIPTION</span>
                        <p className={styles.description}>{menu.description}</p>
                    </div>

                    {menu.options && menu.options.length > 0 && (
                        <div className={styles.infoBlock}>
                            <span className={styles.blockTitle}>OPTIONS</span>
                            <div className={styles.optionList}>
                                {menu.options.map(opt => (
                                    <div key={opt.id} className={styles.optionGroup}>
                                        <div className={styles.optionHeader}>
                                            <span>{opt.name}</span>
                                            <span className={styles.optionType}>
                                                {opt.required ? '필수' : '선택'} / {opt.type === 'radio' ? '단일 선택' : '다중 선택'}
                                            </span>
                                        </div>
                                        <div className={styles.optionItems}>
                                            {opt.items.map(item => (
                                                <div key={item.id} className={styles.optionItem}>
                                                    <span>{item.name}</span>
                                                    <span className={styles.itemPrice}>
                                                        {item.priceDelta > 0 ? `+${formatPrice(item.priceDelta)}원` : '무료'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Link href={`/admin/menus/${menu.id}/edit`} style={{ flex: 1 }}>
                            <Button fullWidth variant="secondary">
                                <Edit size={18} style={{ marginRight: '8px' }} />
                                메뉴 수정
                            </Button>
                        </Link>
                        <Button variant="danger" onClick={handleDelete}>
                            <Trash2 size={18} />
                            삭제
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
