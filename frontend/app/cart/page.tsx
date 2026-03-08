'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Cart.module.css';
import Navbar from '@/components/landing/Navbar';

export default function CartPage() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();

    const totalPrice = getTotalPrice();
    const totalItems = getTotalItems();
    
    // 배송비 설정: 회원이면 0원, 비회원이면 3000원
    const deliveryFee = isAuthenticated ? 0 : 3000;
    const finalTotalPrice = totalPrice + deliveryFee;

    // 클라이언트 마운트 전에는 렌더링하지 않음 (Zustand Hydration Mismatch 에러 방지)
    if (!isMounted) {
        return (
            <div className={styles.main}>
                <Navbar />
                <main className={styles.cartContainer}></main>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.main}>
                <Navbar />
                <main className={styles.cartContainer}>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🛒</div>
                        <h2 className={styles.emptyText}>장바구니가 비어 있습니다.</h2>
                        <Link href="/menus" className={styles.goMenuBtn}>
                            메뉴 담으러 가기
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.main}>
            <Navbar />
            <main className={styles.cartContainer}>
                <header className={styles.title}>
                    <ShoppingBag size={32} color="#ca8a04" />
                    장바구니 ({totalItems})
                </header>

                <div className={styles.cartLayout}>
                    {/* 왼쪽: 상품 목록 */}
                    <section className={styles.itemList}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.imageWrapper}>
                                    <img 
                                        src={item.imageSrc ? `/images/${item.imageSrc}` : '/images/blank.png'} 
                                        alt={item.korName}
                                        className={styles.image}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/blank.png';
                                        }}
                                    />
                                </div>
                                <div className={styles.itemInfo}>
                                    <h3 className={styles.itemName}>{item.korName}</h3>
                                    <p className={styles.itemPrice}>{item.price.toLocaleString()}원</p>
                                    
                                    {item.options && Object.keys(item.options).length > 0 && (
                                        <div className={styles.itemOptions}>
                                            {Object.entries(item.options).map(([group, val]) => (
                                                <span key={group} className={styles.optionBadge}>
                                                    {group}: {val}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <div className={styles.quantityControl}>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className={styles.qBtn}
                                        aria-label="감소"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className={styles.quantity}>{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className={styles.qBtn}
                                        aria-label="증가"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className={styles.removeBtn}
                                    aria-label="삭제"
                                >
                                    <Trash2 size={22} />
                                </button>
                            </div>
                        ))}
                        
                        <button onClick={clearCart} className={styles.clearBtn}>
                            장바구니 전체 비우기
                        </button>
                    </section>

                    {/* 오른쪽: 주문 요약 */}
                    <aside className={styles.summaryCard}>
                        <h2 className={styles.summaryTitle}>주문 요약</h2>
                        
                        {/* 회원 혜택 실시간 안내 */}
                        <div style={{ 
                            background: isAuthenticated ? '#f0fdf4' : '#fff7ed', 
                            padding: '12px', 
                            borderRadius: '12px', 
                            marginBottom: '20px',
                            border: isAuthenticated ? '1px solid #bbf7d0' : '1px solid #ffedd5',
                            fontSize: '0.85rem'
                        }}>
                            {isAuthenticated ? (
                                <p style={{ color: '#166534', fontWeight: 600, textAlign: 'center', margin: 0 }}>
                                    ✨ 파덕이의 팬 멤버십 혜택으로 <br/> <strong>배송비 무료</strong>가 적용되었습니다!
                                </p>
                            ) : (
                                <p style={{ color: '#9a3412', fontWeight: 600, textAlign: 'center', margin: 0 }}>
                                    💡 로그인하시면 <strong>배송비 3,000원</strong>을 <br/> 즉시 할인받으실 수 있어요!
                                </p>
                            )}
                        </div>

                        <div className={styles.summaryRow}>
                            <span>상품 총합</span>
                            <span style={{ color: '#451a03' }}>{totalPrice.toLocaleString()}원</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>배송비 / 팁</span>
                            <span style={{ color: isAuthenticated ? '#16a34a' : '#ca8a04', fontWeight: isAuthenticated ? 800 : 700 }}>
                                {isAuthenticated ? '0원 (혜택)' : '3,000원'}
                            </span>
                        </div>
                        
                        <div className={styles.totalRow}>
                            <span>총 결제 금액</span>
                            <span style={{ color: '#ca8a04' }}>
                                {finalTotalPrice.toLocaleString()}원
                            </span>
                        </div>

                        <button 
                            className={styles.orderBtn}
                            onClick={() => {
                                useCartStore.getState().setCheckoutItems(items);
                                router.push('/checkout');
                            }}
                        >
                            주문하기
                        </button>
                        
                        <p style={{ 
                            marginTop: 'var(--space-5)', 
                            textAlign: 'center', 
                            fontSize: 'var(--text-sm)',
                            color: '#78350f',
                            lineHeight: 1.5,
                            fontWeight: 500
                        }}>
                            {isAuthenticated 
                                ? `고마워덕! ${user?.nickname || '회원'}님을 위한 맛있는 메뉴를 준비할게덕! 🐤`
                                : `비회원으로도 주문이 가능하지만,\n회원가입 시 배송비 0원 혜택이 상시 제공됩니다! 🐥`}
                        </p>
                        
                        <Link href="/menus" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 'var(--space-2)',
                            marginTop: 'var(--space-8)',
                            fontSize: 'var(--text-sm)',
                            color: '#ca8a04',
                            fontWeight: 700
                        }}>
                            <ArrowLeft size={16} />
                            계속 쇼핑하기
                        </Link>
                    </aside>
                </div>
            </main>
        </div>
    );
}
