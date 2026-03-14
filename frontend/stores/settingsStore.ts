import { create } from 'zustand';
import { fetchAPI } from '@/app/lib/api';

export interface ShopSettings {
    shopName: string;
    businessHours: string;
    shopPhone: string;
    shopAddress: string;
    notice: string;
    minOrderAmount: number;
    deliveryFee: number;
    estimatedPrepTime: string;
    pointAccrualRate: number;
    level1Threshold: number;
    level2Threshold: number;
    level3Threshold: number;
    level4Threshold: number;
}

interface SettingsState {
    settings: ShopSettings | null;
    isLoading: boolean;
    lastFetchedAt: number;
    fetchSettings: () => Promise<ShopSettings | null>;
    invalidate: () => void;
}

const CACHE_DURATION = 30 * 1000; // 30초 캐시 (관리자 변경 즉시 반영을 위해 짧게 설정)

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: null,
    isLoading: false,
    lastFetchedAt: 0,

    fetchSettings: async () => {
        const { settings, lastFetchedAt, isLoading } = get();
        const now = Date.now();

        // 캐시가 유효하면 기존 데이터 반환
        if (settings && (now - lastFetchedAt < CACHE_DURATION) && !isLoading) {
            return settings;
        }

        // 이미 로딩 중이면 기존 데이터 반환
        if (isLoading) return settings;

        set({ isLoading: true });
        try {
            const data = await fetchAPI('/settings');
            set({ settings: data, lastFetchedAt: Date.now(), isLoading: false });
            return data;
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            set({ isLoading: false });
            return settings;
        }
    },

    // 관리자가 설정을 변경한 후 호출 — 캐시를 무효화하여 다음 접근 시 새로 가져옴
    invalidate: () => {
        set({ lastFetchedAt: 0 });
    },
}));
