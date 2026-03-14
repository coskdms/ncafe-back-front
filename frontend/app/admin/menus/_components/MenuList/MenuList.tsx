'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/common/Button';
import MenuCard from '../MenuCard';
import styles from './MenuList.module.css';
import { useMenus, MenuListParams, MenuResponse } from './useMenus';
import { fetchAPI } from '@/app/lib/api';
import { toast } from '@/stores/toastStore';
import { getErrorMessage } from '@/utils/errorMessage';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';

const ITEMS_PER_PAGE = 8;

export default function MenuList({ selectedCategory, searchQuery }: { selectedCategory: number | null, searchQuery: string }) {
    const [currentPage, setCurrentPage] = useState(1);

    const menuListParams: MenuListParams = {
        categoryId: selectedCategory,
        searchQuery: searchQuery || null,
    };

    const { menus, setMenus, totalCount, loading, error, refetch } = useMenus(menuListParams);

    // DnD 센서 설정
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const paginatedMenus = (() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return menus.slice(startIndex, endIndex);
    })();

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // 품절 토글 — 서버에 저장
    const handleToggleSoldOut = async (id: number) => {
        const menu = menus.find(m => m.id === id);
        if (!menu) return;

        const newAvailability = !menu.isAvailable;

        // 낙관적 업데이트
        setMenus(prev => prev.map(m =>
            m.id === id ? { ...m, isAvailable: newAvailability } : m
        ));

        try {
            await fetchAPI(`/admin/menus/${id}/availability`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAvailability),
            });
        } catch (err) {
            console.error('품절 상태 변경 실패:', err);
            // 실패 시 원복
            setMenus(prev => prev.map(m =>
                m.id === id ? { ...m, isAvailable: menu.isAvailable } : m
            ));
            toast.error(getErrorMessage(err, '품절 상태를 변경하는 중 오류가 발생했습니다.'));
        }
    };

    // 드래그 앤 드롭 종료 핸들러
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = menus.findIndex(m => m.id === active.id);
        const newIndex = menus.findIndex(m => m.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reorderedMenus = arrayMove(menus, oldIndex, newIndex);
        setMenus(reorderedMenus);

        try {
            const menuIds = reorderedMenus.map(m => m.id);
            await fetchAPI('/admin/menus/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuIds),
            });
        } catch (err) {
            console.error('순서 변경 실패:', err);
            refetch();
            toast.error(getErrorMessage(err, '메뉴 순서를 변경하는 중 오류가 발생했습니다.'));
        }
    };

    // 메뉴 삭제
    const handleDelete = async (id: number) => {
        if (confirm('정말 이 메뉴를 삭제하시겠습니까?')) {
            try {
                await fetchAPI(`/admin/menus/${id}`, { method: 'DELETE' });
                toast.success('삭제되었습니다.');
                refetch();
            } catch (error) {
                console.error('삭제 오류:', error);
                toast.error(getErrorMessage(error, '메뉴를 삭제하는 중 오류가 발생했습니다.'));
            }
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
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={paginatedMenus.map(m => m.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className={styles.menuList}>
                        {paginatedMenus.map((menu) => (
                            <MenuCard
                                key={menu.id}
                                menu={menu}
                                onToggleSoldOut={handleToggleSoldOut}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

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
