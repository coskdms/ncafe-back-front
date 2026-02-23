'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MenuCard from '../MenuCard/MenuCard';
import styles from './MenuList.module.css';
import { useMenus, MenuListParams } from './useMenus';

const ITEMS_PER_PAGE = 6;

interface MenuListProps {
    selectedCategory: number | null;
    searchQuery?: string;
}

export default function MenuList({ selectedCategory, searchQuery }: MenuListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const menuListParams: MenuListParams = {
        categoryId: selectedCategory,
        searchQuery: searchQuery,
    };

    const { menus, loading, error, refetch } = useMenus(menuListParams);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(menus.length / ITEMS_PER_PAGE));
    const paginatedMenus = menus.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    if (loading) {
        return <div className={styles.emptyState}>메뉴를 불러오는 중입니다... ☕</div>;
    }

    if (error) {
        return (
            <div className={styles.emptyState}>
                <p>메뉴 정보를 불러오는데 실패했습니다: {error}</p>
                <button onClick={() => refetch()} style={{ marginTop: '12px' }}>다시 시도</button>
            </div>
        );
    }

    return (
        <>
            <div className={styles.grid}>
                {paginatedMenus.length > 0 ? (
                    paginatedMenus.map((menu) => (
                        <MenuCard key={menu.id} menu={menu} />
                    ))
                ) : (
                    <div className={styles.emptyState}>해당 카테고리에 준비된 메뉴가 없습니다 😢</div>
                )}
            </div>

            {/* Pagination UI */}
            {menus.length > ITEMS_PER_PAGE && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ''}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </>
    );
}
