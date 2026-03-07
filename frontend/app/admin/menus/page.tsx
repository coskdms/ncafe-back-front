'use client';

import { useState } from 'react';
import MenuList from './_components/MenuList/MenuList';
import MenuActionBar from './_components/MenuActionBar/MenuActionBar';
import CategoryTabs from '../_components/category/CategoryTabs/CategoryTabs';
import styles from './page.module.css';
import { Menu } from '@/types/menu';

export default function MenusPage() {
    // 상태
    // lifting state up
    // 카테고리가 가지고 있어야할 변수를 부모에게 올리는 것
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <main className={styles.container}>
            <MenuActionBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* 카테고리 탭 */}
            <CategoryTabs
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}

            />

            {/* 메뉴 목록 */}
            <MenuList
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
            />
        </main>
    );
}

