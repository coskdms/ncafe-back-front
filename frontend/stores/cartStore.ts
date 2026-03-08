import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: number;
    menuId: number;
    korName: string;
    price: number;
    quantity: number;
    imageSrc?: string;
    options?: Record<string, string>;
}

interface CartState {
    items: CartItem[];
    checkoutItems: CartItem[];
    addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    syncWithServer: (isLoginAction?: boolean) => Promise<void>;
    setCheckoutItems: (items: CartItem[]) => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getCheckoutTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            checkoutItems: [],
            addItem: async (newItem) => {
                const { isAuthenticated } = (await import('@/stores/authStore')).useAuthStore.getState();
                
                // 로컬 상태 업데이트
                set((state) => {
                    const existingItemIndex = state.items.findIndex((item) => 
                        item.menuId === newItem.menuId && 
                        JSON.stringify(item.options || {}) === JSON.stringify(newItem.options || {})
                    );

                    if (existingItemIndex !== -1) {
                        const newItems = [...state.items];
                        newItems[existingItemIndex] = {
                            ...newItems[existingItemIndex],
                            quantity: newItems[existingItemIndex].quantity + 1
                        };
                        return { items: newItems };
                    }
                    return { items: [...state.items, { ...newItem, id: Date.now(), quantity: 1 }] };
                });

                // 인증된 경우 DB에 저장
                if (isAuthenticated) {
                    await fetch('/api/cart/items', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            menuId: newItem.menuId, 
                            quantity: 1, 
                            options: newItem.options 
                        }),
                    });

                    // DB 저장 후 새로고침 (정상적인 cartItem ID를 받아오기 위해)
                    get().syncWithServer();
                }
            },
            removeItem: async (id) => {
                const { isAuthenticated } = (await import('@/stores/authStore')).useAuthStore.getState();
                
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));

                if (isAuthenticated) {
                    await fetch(`/api/cart/items/${id}`, { method: 'DELETE' });
                }
            },
            updateQuantity: async (id, quantity) => {
                const { isAuthenticated } = (await import('@/stores/authStore')).useAuthStore.getState();
                
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
                    ).filter(item => item.quantity > 0),
                }));

                if (isAuthenticated) {
                    await fetch(`/api/cart/items/${id}?quantity=${quantity}`, { method: 'PUT' });
                }
            },
            clearCart: async () => {
                const { isAuthenticated } = (await import('@/stores/authStore')).useAuthStore.getState();
                
                set({ items: [] });
                if (isAuthenticated) {
                    await fetch('/api/cart/clear', { method: 'DELETE' });
                }
            },
            syncWithServer: async (isLoginAction?: boolean) => {
                const { isAuthenticated } = (await import('@/stores/authStore')).useAuthStore.getState();
                if (!isAuthenticated) return;

                try {
                    const res = await fetch('/api/cart', { cache: 'no-store' });
                    if (!res.ok) {
                         console.error('장바구니 서버 동기화 실패');
                         return;
                    }
                    
                    const serverItems = await res.json();
                    
                    if (isLoginAction) {
                        const localItems = [...get().items];
                        if (localItems.length > 0) {
                            await fetch('/api/cart/items/bulk', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(localItems.map(item => ({ 
                                    menuId: item.menuId, 
                                    quantity: item.quantity,
                                    options: item.options 
                                }))),
                            });
                            
                            const finalRes = await fetch('/api/cart', { cache: 'no-store' });
                            if (finalRes.ok) {
                                set({ items: await finalRes.json() });
                            }
                        } else {
                            set({ items: serverItems });
                        }
                    } else {
                        set({ items: serverItems });
                    }
                } catch (error) {
                    console.error('장바구니 동기화 중 오류 발생:', error);
                }
            },
            setCheckoutItems: (items) => set({ checkoutItems: items }),
            getTotalItems: () => get().items.length,
            getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
            getCheckoutTotalPrice: () => get().checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0),
        }),
        {
            name: 'ncafe-cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// 로그아웃 이벤트 발생 시 장바구니 초기화
if (typeof window !== 'undefined') {
    window.addEventListener('logout', () => {
        useCartStore.setState({ items: [], checkoutItems: [] });
    });
}
