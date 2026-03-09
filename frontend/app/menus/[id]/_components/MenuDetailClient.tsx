'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { ChevronLeft, ShoppingCart, CreditCard, X } from 'lucide-react';
import styles from '../MenuDetail.module.css';
import { useMenuDetail } from './useMenuDetail';

interface MenuDetailClientProps {
    params: Promise<{ id: string }>;
}

export default function MenuDetailClient({ params }: MenuDetailClientProps) {
    const { id } = use(params);
    const { menu, loading, error } = useMenuDetail(id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'cart' | 'order'>('cart');
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return '';
        return price.toLocaleString('ko-KR') + '원';
    };

    const addItem = useCartStore((state) => state.addItem);

    const handleOptionChange = (groupName: string, optionName: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [groupName]: optionName
        }));
    };

    const calculateTotalPrice = () => {
        if (!menu) return 0;
        let total = menu.price;

        // 선택된 옵션들의 추가 비용 합산
        if (menu.optionGroups) {
            menu.optionGroups.forEach(group => {
                const selectedOptionName = selectedOptions[group.name];
                if (selectedOptionName) {
                    const option = group.optionDetails.find(d => d.name === selectedOptionName);
                    if (option) {
                        total += option.additionalPrice || 0;
                    }
                }
            });
        }
        return total;
    };

    const handleAddToCart = async () => {
        if (!menu) return;

        // 필수 옵션 체크
        const missingRequired = menu.optionGroups?.filter(g => g.isRequired && !selectedOptions[g.name]);
        if (missingRequired && missingRequired.length > 0) {
            // 모달이 안 열려있었다면 열어줌
            if (!isOptionModalOpen) {
                setModalMode('cart');
                setIsOptionModalOpen(true);
                return;
            }
            alert(`필수 옵션을 선택해주세요: ${missingRequired.map(g => g.name).join(', ')}`);
            return;
        }

        // 카트에 아이템 추가
        await addItem({
            menuId: menu.id,
            korName: menu.korName,
            price: calculateTotalPrice(),
            imageSrc: menu.imagesSrc?.split(',')[0]?.trim() || 'blank.png',
            options: selectedOptions
        });

        setIsOptionModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    const handleOrderNow = () => {
        if (!menu) return;

        // 필수 옵션 체크
        const missingRequired = menu.optionGroups?.filter(g => g.isRequired && !selectedOptions[g.name]);
        if (missingRequired && missingRequired.length > 0) {
            if (!isOptionModalOpen) {
                setModalMode('order');
                setIsOptionModalOpen(true);
                return;
            }
            alert(`필수 옵션을 선택해주세요: ${missingRequired.map(g => g.name).join(', ')}`);
            return;
        }

        // 바로 주문을 위한 체크아웃 아이템 설정
        const buyNowItem = {
            menuId: menu.id,
            korName: menu.korName,
            price: calculateTotalPrice(),
            imageSrc: menu.imagesSrc?.split(',')[0]?.trim() || 'blank.png',
            options: selectedOptions,
            id: Date.now(), // 임시 ID
            quantity: 1
        };

        useCartStore.getState().setCheckoutItems([buyNowItem]);
        setIsOptionModalOpen(false);
        router.push('/checkout');
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

                        {/* 주문 액션 버튼들 */}
                        <div className={styles.actionGroup}>
                            {menu.optionGroups && menu.optionGroups.length > 0 ? (
                                <button className={styles.secondaryButton} onClick={() => {
                                    setModalMode('cart');
                                    setIsOptionModalOpen(true);
                                }}>
                                    <ShoppingCart size={20} />
                                    옵션 선택하기
                                </button>
                            ) : (
                                <button className={styles.secondaryButton} onClick={handleAddToCart}>
                                    <ShoppingCart size={20} />
                                    장바구니 담기
                                </button>
                            )}
                            <button className={styles.primaryButton} onClick={handleOrderNow}>
                                <CreditCard size={20} />
                                바로 주문하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모바일 하단 고정 바 */}
            <div className={styles.mobileStickyBar}>
                {menu.optionGroups && menu.optionGroups.length > 0 ? (
                    <button className={styles.secondaryButton} onClick={() => {
                        setModalMode('cart');
                        setIsOptionModalOpen(true);
                    }}>
                        옵션 선택
                    </button>
                ) : (
                    <button className={styles.secondaryButton} onClick={handleAddToCart}>
                        장바구니
                    </button>
                )}
                <button className={styles.primaryButton} onClick={handleOrderNow}>
                    바로 주문
                </button>
            </div>

            {/* 옵션 선택 모달 (Glassmorphism) */}
            {isOptionModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsOptionModalOpen(false)}>
                    <div className={styles.optionModalContainer} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.optionModalHeader}>
                            <h2 className={styles.optionModalTitle}>옵션 선택</h2>
                            <button className={styles.closeButton} onClick={() => setIsOptionModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.optionModalBody}>
                            {menu.optionGroups?.map((group) => (
                                <div key={group.id} className={styles.optionGroup}>
                                    <div className={styles.optionGroupName}>
                                        {group.name}
                                        {group.isRequired && <span className={styles.requiredBadge}>필수</span>}
                                    </div>
                                    <div className={styles.optionList}>
                                        {group.optionDetails.map((option) => (
                                            <div key={option.id} className={styles.optionItem}>
                                                <input
                                                    type="radio"
                                                    id={`modal-option-${option.id}`}
                                                    name={`modal-group-${group.id}`}
                                                    className={styles.optionInput}
                                                    checked={selectedOptions[group.name] === option.name}
                                                    onChange={() => handleOptionChange(group.name, option.name)}
                                                />
                                                <label htmlFor={`modal-option-${option.id}`} className={styles.optionLabel}>
                                                    <span>{option.name}</span>
                                                    {option.additionalPrice > 0 && (
                                                        <span className={styles.optionPrice}>+{formatPrice(option.additionalPrice)}</span>
                                                    )}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.optionModalFooter}>
                            <div className={styles.modalTotalPriceRow}>
                                <span className={styles.modalTotalLabel}>총 주문 금액</span>
                                <span className={styles.modalTotalValue}>{formatPrice(calculateTotalPrice())}</span>
                            </div>
                            <button 
                                className={styles.primaryButton} 
                                onClick={modalMode === 'order' ? handleOrderNow : handleAddToCart} 
                                style={{ width: '100%' }}
                            >
                                {modalMode === 'order' ? (
                                    <>
                                        <CreditCard size={20} />
                                        바로 주문하기
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        장바구니 담기
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 장바구니 담기 성공 모달 */}
            {isSuccessModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsSuccessModalOpen(false)}>
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
                                    setIsSuccessModalOpen(false);
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

