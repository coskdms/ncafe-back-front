'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Search } from 'lucide-react';
import CategoryTabs from './_components/CategoryTabs/CategoryTabs';
import MenuList from './_components/MenuList/MenuList';
import { useAuthStore } from '@/stores/authStore';
import { useFavoriteStore } from '@/stores/favoriteStore';
import styles from './menus.module.css';

const PsyduckIcon = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }}>
        {/* 하단 몸통 약간 */}
        <path d="M20 95 Q50 70 80 95 Z" fill="#FDE047" stroke="#D97706" strokeWidth="5" strokeLinejoin="round" />
        {/* 머리 */}
        <circle cx="50" cy="50" r="40" fill="#FDE047" stroke="#D97706" strokeWidth="5" />
        {/* 머리 위 세 가닥 털 */}
        <path d="M42 12 Q38 2 32 8" stroke="#D97706" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M50 10 Q50 0 50 2" stroke="#D97706" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M58 12 Q62 2 68 8" stroke="#D97706" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* 눈동자 */}
        <circle cx="34" cy="40" r="4" fill="#1F2937" />
        <circle cx="66" cy="40" r="4" fill="#1F2937" />
        {/* 볼터치 */}
        <ellipse cx="22" cy="52" rx="7" ry="4" fill="#FCA5A5" opacity="0.8" />
        <ellipse cx="78" cy="52" rx="7" ry="4" fill="#FCA5A5" opacity="0.8" />
        {/* 오리 주둥이 (크림색) */}
        <path d="M24 60 Q50 48 76 60 Q82 82 50 82 Q18 82 24 60 Z" fill="#FEF9C3" stroke="#D97706" strokeWidth="5" strokeLinejoin="round" />
        {/* 콧구멍 */}
        <circle cx="44" cy="60" r="1.5" fill="#D97706" />
        <circle cx="56" cy="60" r="1.5" fill="#D97706" />
    </svg>
);

export default function MenusPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
    const { isAuthenticated } = useAuthStore();
    const { loadFavorites, isLoaded } = useFavoriteStore();

    // 로그인 상태면 찜 목록 로드
    useEffect(() => {
        if (isAuthenticated && !isLoaded) {
            loadFavorites();
        }
    }, [isAuthenticated, isLoaded, loadFavorites]);

    // 입력할 때마다 검색되도록 디바운스 적용 (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setAppliedSearchQuery(searchInput);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.content}>
                <h1 className={styles.heading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <PsyduckIcon />
                    우리의 특별 메뉴
                </h1>

                {/* 귀여운 검색 바 */}
                <div className={styles.searchContainer}>
                    <form className={styles.searchForm} onSubmit={handleSearch}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="찾고 싶은 메뉴가 있나요? (예: 아메리카노)"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                </div>

                {/* 카테고리 탭 (분리된 컴포넌트) */}
                <CategoryTabs
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                />

                {/* 메뉴 목록 (분리된 컴포넌트) */}
                <MenuList
                    selectedCategory={selectedCategory}
                    searchQuery={appliedSearchQuery}
                />
            </div>

            <Footer />
        </main>
    );
}
