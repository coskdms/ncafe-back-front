import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: number;
    korName: string;
    price: number;
    quantity: number;
    imageSrc?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    syncWithServer: (isLoginAction?: boolean) => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: async (newItem) => {
                const { isAuthenticated } = (await import('@/stores/authStore')).useAuthStore.getState();
                
                // 로컬 상태 업데이트
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === newItem.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === newItem.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, { ...newItem, quantity: 1 }] };
                });

                // 인증된 경우 DB에 저장
                if (isAuthenticated) {
                    await fetch('/api/cart/items', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ menuId: newItem.id, quantity: 1 }),
                    });
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
                    // 서버 장바구니 데이터 먼저 가져오기 (캐시 방지)
                    const res = await fetch('/api/cart', { cache: 'no-store' });
                    if (!res.ok) {
                         console.error('장바구니 서버 동기화 실패 (Response not OK)');
                         return;
                    }
                    
                    const serverItems = await res.json();
                    
                    // 병합 처리 (벌크 API 사용) -> 오직 '로그인' 액션 시에만 비회원 때 담은 걸 서버로 올림
                    if (isLoginAction) {
                        const localItems = [...get().items];
                        if (localItems.length > 0) {
                            await fetch('/api/cart/items/bulk', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(localItems.map(item => ({ 
                                    menuId: item.id, 
                                    quantity: item.quantity 
                                }))),
                            });
                            
                            // 병합 완료 후 최종 서버 데이터를 다시 가져옴
                            const finalRes = await fetch('/api/cart', { cache: 'no-store' });
                            if (finalRes.ok) {
                                set({ items: await finalRes.json() });
                            }
                        } else {
                            // 비회원 상태에서 담은 게 없었다면, 그냥 서버 데이터로 로컬 상태를 덮어씀
                            set({ items: serverItems });
                        }
                    } else {
                        // 로그인 액션이 아닐 때 (예: 새로고침) -> 서버 상태로 로컬 상태 덮어쓰기 (무한 증식 복사 방지)
                        set({ items: serverItems });
                    }
                } catch (error) {
                    console.error('장바구니 동기화 중 오류 발생:', error);
                }
            },
            getTotalItems: () => get().items.length,
            getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
        }),
        {
            name: 'ncafe-cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// 로그아웃 이벤트 발생 시 장바구니 초기화 (서버 데이터는 보존, 로컬 UI만 클리어)
if (typeof window !== 'undefined') {
    window.addEventListener('logout', () => {
        // useCartStore.getState().clearCart() 대신 로컬 상태만 초기화
        useCartStore.setState({ items: [] });
    });
}
