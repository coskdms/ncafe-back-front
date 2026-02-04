'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/common/Button';
import MenuCard from '../MenuCard';
import styles from './MenuList.module.css';
import { useMenus, MenuListParams } from './useMenus';

const ITEMS_PER_PAGE = 8; // 페이지당 메뉴 개수


export default function MenuList({ selectedCategory, searchQuery }: { selectedCategory: number | null, searchQuery: string }) {
    const [currentPage, setCurrentPage] = useState(1);

    // params 객체로 전달 (선택되지 않은 경우 null)
    const menuListParams: MenuListParams = {
        categoryId: selectedCategory,  // 이미 null | number 타입
        searchQuery: searchQuery || null,
    };

    // 커스텀 훅으로 메뉴 데이터 관리
    const { menus, setMenus, totalCount, loading, error, refetch } = useMenus(menuListParams);

    // selectedCategory가 변경될 때 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    // 검색어 변경 시 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const paginatedMenus = (() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return menus.slice(startIndex, endIndex);
    })();

    // 페이지 번호 배열 생성 (최대 5개 표시)
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // 품절 토글 (isAvailable 사용)
    const handleToggleSoldOut = async (id: number) => {
        const menu = menus.find(m => m.id === id);
        if (menu) {
            // TODO: 백엔드 API 호출하여 품절 상태 업데이트
            setMenus(prev => prev.map(m =>
                m.id === id ? { ...m, isAvailable: !m.isAvailable } : m
            ));
        }
    };

    // 메뉴 삭제
    const handleDelete = async (id: number) => {
        if (confirm('정말 이 메뉴를 삭제하시겠습니까?')) {
            // TODO: 백엔드 API 호출하여 메뉴 삭제
            setMenus(prev => prev.filter(m => m.id !== id));
        }
    };



    if (loading) {
        return (
            <div className={styles.empty}>
                <p>메뉴를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.empty}>
                <p>{error}</p>
                <Button variant="outline" onClick={refetch}>다시 시도</Button>
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className={styles.empty}>
                <p>등록된 메뉴가 없습니다.</p>
                <Link href="/admin/menus/new">
                    <Button variant="outline">첫 메뉴 추가하기</Button>
                </Link>
            </div>
        );
    }



    return (
        <>
            <div className={styles.menuGrid}>
                {paginatedMenus.map((menu) => (
                    <MenuCard
                        key={menu.id}
                        menu={menu}
                        onToggleSoldOut={handleToggleSoldOut}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {getPageNumbers().map((page, index) => (
                        page === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
                        ) : (
                            <button
                                key={page}
                                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={18} />
                    </button>

                    <span className={styles.pageInfo}>
                        {totalCount}개 중 {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
                    </span>
                </div>
            )}
        </>
    );
}

