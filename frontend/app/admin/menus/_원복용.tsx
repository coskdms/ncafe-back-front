'use client';

import { useState } from 'react';
import MenuList from './_components/MenuList/MenuList';
import MenuActionBar from './_components/MenuActionBar/MenuActionBar';
import CategoryTabs from './_components/CategoryTabs/CategoryTabs';
import styles from './page.module.css';
import { Menu } from '@/types/menu';

export default function MenusPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuCount, setMenuCount] = useState(0);

    // MenuList에서 메뉴 로드 완료시 호출되는 콜백
    const handleMenusLoaded = (menus: Menu[]) => {
        // 검색어가 있으면 필터링된 결과의 개수를 표시하기 위해 계산
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const filtered = menus.filter((menu) =>
                menu.korName.toLowerCase().includes(query) ||
                menu.engName.toLowerCase().includes(query)
            );
            setMenuCount(filtered.length);
        } else {
            setMenuCount(menus.length);
        }
    };

    return (
        <main className={styles.container}>
            <MenuActionBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                totalCount={menuCount}
            />

            {/* 카테고리 탭 */}
            <CategoryTabs
                activeId={selectedCategory}
                onSelect={setSelectedCategory}
            />

            {/* 메뉴 목록 */}
            <MenuList
                categoryId={selectedCategory}
                searchQuery={searchQuery}
                onMenusLoaded={handleMenusLoaded}
            />
        </main>
    );
}

