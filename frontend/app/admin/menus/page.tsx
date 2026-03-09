'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import MenuList from './_components/MenuList/MenuList';
import CategoryTabs from '../_components/category/CategoryTabs/CategoryTabs';
import styles from './page.module.css';

export default function MenusPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <main className={styles.container}>
            {/* 헤더 섹션: 카테고리 관리와 동일한 스타일 */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>메뉴 관리</h1>
                    <p>맛있는 메뉴를 등록하고 관리하세요. 🍔🍰☕</p>
                </div>
                <div className={styles.actionButtons}>
                    <Link href="/admin/menus/new" className={styles.addButton}>
                        <Plus size={20} />
                        새 메뉴 추가
                    </Link>
                </div>
            </header>

            {/* 검색 및 필터 섹션 */}
            <section className={styles.searchSection}>
                <div className={styles.searchWrapper}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="search"
                        placeholder="메뉴 이름 또는 설명 검색..."
                        value={searchQuery}
                        className={styles.searchInput}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </section>

            {/* 카테고리 탭 섹션 */}
            <section className={styles.categorySection}>
                <CategoryTabs
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                />
            </section>

            {/* 메뉴 목록 섹션 */}
            <section className={styles.listSection}>
                <MenuList
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                />
            </section>
        </main>
    );
}

