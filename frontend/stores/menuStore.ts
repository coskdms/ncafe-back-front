import { create } from 'zustand';
import { Menu } from '@/types/menu';
import { MOCK_MENUS } from '@/mocks/menuData';

interface MenuState {
    menus: Menu[];
    setMenus: (menus: Menu[]) => void;
    addMenu: (menu: Menu) => void;
    updateMenu: (id: string, menu: Partial<Menu>) => void;
    deleteMenu: (id: string) => void;
    getMenu: (id: string) => Menu | undefined;
}

export const useMenuStore = create<MenuState>((set, get) => ({
    menus: MOCK_MENUS,
    setMenus: (newMenus) => set({ menus: newMenus }),
    addMenu: (menu) => set((state) => ({ menus: [menu, ...state.menus] })),
    updateMenu: (id, updatedMenu) => set((state) => ({
        menus: state.menus.map((m) => (m.id === id ? { ...m, ...updatedMenu } : m)),
    })),
    deleteMenu: (id) => set((state) => ({
        menus: state.menus.filter((m) => m.id !== id),
    })),
    getMenu: (id) => get().menus.find((m) => m.id === id),
}));
