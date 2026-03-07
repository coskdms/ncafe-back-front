'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { ChevronLeft, ShoppingCart, CreditCard } from 'lucide-react';
import styles from '../MenuDetail.module.css';
import { useMenuDetail } from './useMenuDetail';

interface MenuDetailClientProps {
    params: Promise<{ id: string }>;
}

export default function MenuDetailClient({ params }: MenuDetailClientProps) {
    const { id } = use(params);
    const { menu, loading, error } = useMenuDetail(id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return '';
        return price.toLocaleString('ko-KR') + '원';
    };

    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = async () => {
        if (!menu) return;

        // 카트에 아이템 추가
        await addItem({
            id: menu.id,
            korName: menu.korName,
            price: menu.price,
            imageSrc: menu.imagesSrc?.split(',')[0]?.trim() || 'blank.png'
        });

        // 팝업 열기
        setIsModalOpen(true);
    };

    const handleOrderNow = () => {
        alert(`'${menu?.korName}' 주문 화면으로 이동합니다! 🚀`);
    };

    if (loading) {
        return (
            <main className={styles.main}>
                <Navbar />
                <div className={styles.contentWrapper}>
                    <div className={styles.emptyState}>메뉴 정보를 불러오는 중입니다... ☕</div>
                </div>
                <Footer />
            </main>
        );
    }

    if (error || !menu) {
        return (
            <main className={styles.main}>
                <Navbar />
                <div className={styles.contentWrapper}>
                    <div className={styles.emptyState}>해당 메뉴를 찾을 수 없습니다 😢</div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link href="/menus" className={styles.backLink}>
                            메뉴 목록으로 돌아가기
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    const images = menu?.imagesSrc
        ? menu.imagesSrc.split(',').map(src => src.trim()).filter(Boolean)
        : ['blank.png'];

    const currentImage = images[currentImageIndex] || 'blank.png';

    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.contentWrapper}>
                <Link href="/menus" className={styles.backLink}>
                    <ChevronLeft size={20} />
                    메뉴 목록으로
                </Link>

                <div className={styles.grid}>
                    {/* 왼쪽: 상품 이미지 */}
                    <div className={styles.leftColumn}>
                        <div className={styles.imageSection}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={`/images/${currentImage}`}
                                    alt={menu.korName}
                                    className={styles.image}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/blank.png';
                                    }}
                                />
                            </div>

                            {/* 여러 이미지 썸네일 */}
                            {images.length > 1 && (
                                <div className={styles.thumbnailGrid}>
                                    {images.map((imgSrc, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.thumbnailBtn} ${currentImageIndex === index ? styles.thumbnailBtnActive : ''}`}
                                            onClick={() => setCurrentImageIndex(index)}
                                            aria-label={`이미지 ${index + 1} 보기`}
                                        >
                                            <img
                                                src={`/images/${imgSrc}`}
                                                alt={`${menu.korName} 썸네일 ${index + 1}`}
                                                className={styles.thumbnailImg}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/images/blank.png';
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 오른쪽: 상품 정보 및 주문 액션 */}
                    <div className={styles.rightColumn}>
                        <div className={styles.categoryBadge}>{menu.categoryName || '스페셜'}</div>

                        <h1 className={styles.title}>{menu.korName}</h1>
                        {menu.engName && <h2 className={styles.engTitle}>{menu.engName}</h2>}

                        <div className={styles.divider} />

                        <p className={styles.description}>
                            {menu.description || '정말 맛있는 고라파덕 카페의 자랑, 스페셜 메뉴입니다! 한 입 먹으면 기분이 좋아져요.'}
                        </p>

                        <div className={styles.price}>
                            {formatPrice(menu.price)}
                        </div>

                        {/* 주문 액션 버튼들 (사용자 페이지) */}
                        <div className={styles.actionGroup}>
                            <button className={styles.secondaryButton} onClick={handleAddToCart}>
                                <ShoppingCart size={20} />
                                장바구니 담기
                            </button>
                            <button className={styles.primaryButton} onClick={handleOrderNow}>
                                <CreditCard size={20} />
                                바로 주문하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 장바구니 담기 성공 모달 */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIcon}>🐤</div>
                        <h2 className={styles.modalTitle}>카트에 담겼습니다!</h2>
                        <p className={styles.modalMessage}>
                            {!isAuthenticated ? '[비회원]' : '[파덕이의 팬]'} <br/>
                            <strong>{menu.korName}</strong> 메뉴를 장바구니에 귀엽게 담았습니다.
                        </p>
                        <div className={styles.modalActions}>
                            <button 
                                className={styles.modalBtnPrimary} 
                                onClick={() => router.push('/cart')}
                            >
                                장바구니로 바로 이동
                            </button>
                            <button 
                                className={styles.modalBtnSecondary} 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    router.push('/menus');
                                }}
                            >
                                쇼핑 계속하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
