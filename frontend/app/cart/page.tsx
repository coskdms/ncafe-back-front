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
import { toast } from '@/stores/toastStore';

export default function CartPage() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();

    // 옵션 변경 모달
    interface OptionDetail { name: string; additionalPrice: number; sortOrder: number; }
    interface OptionGroup { name: string; isRequired: boolean; isMultiple: boolean; sortOrder: number; optionDetails: OptionDetail[]; }
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editOptionGroups, setEditOptionGroups] = useState<OptionGroup[]>([]);
    const [editSelectedOptions, setEditSelectedOptions] = useState<Record<string, string[]>>({});
    const [editBasePrice, setEditBasePrice] = useState(0);

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
                                            <button
                                                className={styles.optionChangeBtn}
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch(`/api/menus/${item.menuId}`);
                                                        if (!res.ok) return;
                                                        const detail = await res.json();
                                                        if (detail.optionGroups?.length > 0) {
                                                            setEditingItemId(item.id);
                                                            setEditOptionGroups(detail.optionGroups);
                                                            setEditBasePrice(detail.price);
                                                            const current: Record<string, string[]> = {};
                                                            if (item.options) {
                                                                Object.entries(item.options).forEach(([k, v]) => {
                                                                    current[k] = [v as string];
                                                                });
                                                            }
                                                            setEditSelectedOptions(current);
                                                        }
                                                    } catch (err) {
                                                        console.error('Failed to load options:', err);
                                                    }
                                                }}
                                            >
                                                변경
                                            </button>
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

            {/* 옵션 변경 모달 */}
            {editingItemId !== null && (
                <div className={styles.optionOverlay} onClick={() => setEditingItemId(null)}>
                    <div className={styles.optionEditModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.optionEditHeader}>
                            <h3>🔧 옵션 변경</h3>
                            <button onClick={() => setEditingItemId(null)} className={styles.optionCloseBtn}>✕</button>
                        </div>
                        <div className={styles.optionEditBody}>
                            {editOptionGroups.map((group) => (
                                <div key={group.name} className={styles.optionEditGroup}>
                                    <div className={styles.optionEditGroupHeader}>
                                        <span className={styles.optionEditGroupName}>{group.name}</span>
                                        <span className={group.isRequired ? styles.optionEditRequired : styles.optionEditOptional}>
                                            {group.isRequired ? '필수' : '선택'}
                                        </span>
                                    </div>
                                    <div className={styles.optionEditList}>
                                        {group.optionDetails.map((opt) => {
                                            const isSelected = (editSelectedOptions[group.name] || []).includes(opt.name);
                                            return (
                                                <label key={opt.name} className={`${styles.optionEditItem} ${isSelected ? styles.optionEditItemSelected : ''}`}>
                                                    <input
                                                        type={group.isMultiple ? 'checkbox' : 'radio'}
                                                        name={`cart-edit-${group.name}`}
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            setEditSelectedOptions(prev => {
                                                                if (group.isMultiple) {
                                                                    const current = prev[group.name] || [];
                                                                    return {
                                                                        ...prev,
                                                                        [group.name]: isSelected
                                                                            ? current.filter(n => n !== opt.name)
                                                                            : [...current, opt.name]
                                                                    };
                                                                } else {
                                                                    return { ...prev, [group.name]: [opt.name] };
                                                                }
                                                            });
                                                        }}
                                                    />
                                                    <span>{opt.name}</span>
                                                    {opt.additionalPrice > 0 && (
                                                        <span className={styles.optionEditPrice}>+{opt.additionalPrice.toLocaleString()}원</span>
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.optionEditFooter}>
                            <div className={styles.optionEditTotal}>
                                변경 가격: {(() => {
                                    let total = editBasePrice;
                                    editOptionGroups.forEach(g => {
                                        (editSelectedOptions[g.name] || []).forEach(name => {
                                            const opt = g.optionDetails.find(d => d.name === name);
                                            if (opt) total += opt.additionalPrice || 0;
                                        });
                                    });
                                    return total.toLocaleString();
                                })()}원
                            </div>
                            <div className={styles.optionEditBtns}>
                                <button onClick={() => setEditingItemId(null)} className={styles.optionEditCancelBtn}>
                                    취소
                                </button>
                                <button
                                    className={styles.optionEditConfirmBtn}
                                    onClick={() => {
                                        const missing = editOptionGroups.filter(
                                            g => g.isRequired && (!editSelectedOptions[g.name] || editSelectedOptions[g.name].length === 0)
                                        );
                                        if (missing.length > 0) {
                                            toast.error(`필수 옵션을 선택해주세요: ${missing.map(g => g.name).join(', ')}`);
                                            return;
                                        }

                                        let newPrice = editBasePrice;
                                        const newOptions: Record<string, string> = {};
                                        editOptionGroups.forEach(g => {
                                            const selected = editSelectedOptions[g.name] || [];
                                            if (selected.length > 0) {
                                                newOptions[g.name] = selected.join(', ');
                                            }
                                            selected.forEach(name => {
                                                const opt = g.optionDetails.find(d => d.name === name);
                                                if (opt) newPrice += opt.additionalPrice || 0;
                                            });
                                        });

                                        // cartStore의 아이템 업데이트
                                        const store = useCartStore.getState();
                                        const updatedItems = store.items.map(it =>
                                            it.id === editingItemId
                                                ? { ...it, price: newPrice, options: newOptions }
                                                : it
                                        );
                                        useCartStore.setState({ items: updatedItems });
                                        setEditingItemId(null);
                                        toast.success('옵션이 변경되었습니다! ✅');
                                    }}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
