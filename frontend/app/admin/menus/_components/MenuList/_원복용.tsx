'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/common/Button';
import MenuCard from '../MenuCard';
import { Menu } from '@/types/menu';
import styles from './MenuList.module.css';
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
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';

const ITEMS_PER_PAGE = 8; // 페이지당 메뉴 개수

interface MenuListProps {
    categoryId?: string | null;
    searchQuery?: string;
    onMenusLoaded?: (menus: Menu[]) => void;
}

export default function MenuList({ categoryId, searchQuery, onMenusLoaded }: MenuListProps) {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 백엔드 응답을 프론트엔드 Menu 타입으로 매핑
    // 추후 db수정시 삭제 
    const mapApiResponseToMenu = (apiMenu: any): Menu => {
        return {
            id: String(apiMenu.id),
            korName: apiMenu.korName || '',
            engName: apiMenu.engName || '',
            description: apiMenu.description || '',
            price: typeof apiMenu.price === 'string' ? parseInt(apiMenu.price, 10) : (apiMenu.price || 0),
            categoryId: String(apiMenu.categoryId || ''),
            images: apiMenu.image
                ? [{ id: '1', url: apiMenu.image, isPrimary: true, sortOrder: 0 }]
                : [],
            isAvailable: apiMenu.isAvailable ?? true,
            isSoldOut: apiMenu.isSoldOut ?? (apiMenu.isAvailable === false),
            sortOrder: apiMenu.sortOrder || 0,
            options: apiMenu.options || [],
            createdAt: apiMenu.createdAt ? new Date(apiMenu.createdAt) : new Date(),
            updatedAt: apiMenu.updatedAt ? new Date(apiMenu.updatedAt) : new Date(),
        };
    };

    // 백엔드에서 메뉴 데이터 fetch
    const fetchMenus = async () => {
        try {
            setLoading(true);
            setError(null);

            const url = new URL("http://localhost:8080/admin/menus");
            if (categoryId) {
                url.searchParams.append('cid', categoryId.toString());
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('메뉴 데이터를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            // 백엔드 응답을 프론트엔드 타입으로 매핑
            const mappedMenus = data.map(mapApiResponseToMenu);
            setMenus(mappedMenus);
            onMenusLoaded?.(mappedMenus);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // categoryId가 변경될 때마다 fetch 및 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
        fetchMenus();
    }, [categoryId]);

    // 검색어 변경 시 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // 검색어 필터링
    const filteredMenus = useMemo(() => {
        if (!searchQuery) return menus;

        const query = searchQuery.toLowerCase();
        return menus.filter((menu) =>
            menu.korName.toLowerCase().includes(query) ||
            menu.engName.toLowerCase().includes(query)
        );
    }, [menus, searchQuery]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredMenus.length / ITEMS_PER_PAGE);

    const paginatedMenus = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredMenus.slice(startIndex, endIndex);
    }, [filteredMenus, currentPage]);

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

    // 품절 토글
    const handleToggleSoldOut = async (id: string) => {
        const menu = menus.find(m => m.id === id);
        if (menu) {
            // TODO: 백엔드 API 호출하여 품절 상태 업데이트
            setMenus(prev => prev.map(m =>
                m.id === id ? { ...m, isSoldOut: !m.isSoldOut } : m
            ));
        }
    };

    // 메뉴 삭제
    const handleDelete = async (id: string) => {
        if (confirm('정말 이 메뉴를 삭제하시겠습니까?')) {
            // TODO: 백엔드 API 호출하여 메뉴 삭제
            setMenus(prev => prev.filter(m => m.id !== id));
        }
    };

    // 메뉴 순서 변경
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = menus.findIndex((item) => item.id === active.id);
            const newIndex = menus.findIndex((item) => item.id === over.id);

            const newOrder = arrayMove(menus, oldIndex, newIndex);
            setMenus(newOrder);
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
                <Button variant="outline" onClick={fetchMenus}>다시 시도</Button>
            </div>
        );
    }

    if (filteredMenus.length === 0) {
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
                    strategy={rectSortingStrategy}
                >
                    <div className={styles.menuGrid}>
                        {paginatedMenus.map((menu) => (
                            <MenuCard
                                key={menu.id}
                                menu={menu}
                                onToggleSoldOut={handleToggleSoldOut}
                                onDelete={handleDelete}
                                dragEnabled={!searchQuery}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

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
                        {filteredMenus.length}개 중 {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredMenus.length)}
                    </span>
                </div>
            )}
        </>
    );
}

