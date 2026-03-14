'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Save, X } from 'lucide-react';
import styles from './Categories.module.css';
import { toast } from '@/stores/toastStore';

interface Category {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', icon: '' });
    const [isSaving, setIsSaving] = useState(false);

    // 드래그 상태
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const dragNodeRef = useRef<HTMLDivElement | null>(null);
    const mouseDownOnOverlayRef = useRef(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', icon: '☕' });
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, icon: category.icon });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const url = editingCategory 
                ? `/api/admin/categories/${editingCategory.id}` 
                : '/api/admin/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchCategories();
                toast.success(editingCategory ? '카테고리가 수정되었습니다.' : '카테고리가 추가되었습니다.');
            } else {
                toast.error('저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까? 해당 카테고리의 메뉴들이 영향을 받을 수 있습니다.')) return;
        
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCategories();
                toast.success('카테고리가 삭제되었습니다.');
            } else {
                toast.error('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    // ========= 드래그앤드롭 =========
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // 드래그 이미지를 현재 요소로 설정
        if (e.currentTarget instanceof HTMLElement) {
            dragNodeRef.current = e.currentTarget as HTMLDivElement;
            e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
        }
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragIndex !== null && dragIndex !== index) {
            setOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setOverIndex(null);
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === dropIndex) {
            setDragIndex(null);
            setOverIndex(null);
            return;
        }

        const newCategories = [...categories];
        const [dragged] = newCategories.splice(dragIndex, 1);
        newCategories.splice(dropIndex, 0, dragged);

        // sortOrder 재지정
        const updated = newCategories.map((cat, idx) => ({
            ...cat,
            sortOrder: idx + 1
        }));

        setCategories(updated);
        setDragIndex(null);
        setOverIndex(null);

        // 서버에 순서 업데이트
        try {
            const res = await fetch('/api/admin/categories/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated.map(c => c.id)),
            });
            
            if (!res.ok) {
                toast.error('순서 변경에 실패했습니다.');
                fetchCategories();
            }
        } catch (error) {
            console.error('Failed to reorder:', error);
            fetchCategories();
        }
    };

    const handleDragEnd = () => {
        setDragIndex(null);
        setOverIndex(null);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>카테고리 관리</h1>
                    <p>메뉴 테마와 카테고리를 자유롭게 구성하세요. ☕</p>
                </div>
                <div className={styles.actionButtons}>
                    <button className={styles.addButton} onClick={openAddModal}>
                        <Plus size={20} />
                        추가하기
                    </button>
                </div>
            </header>

            <p className={styles.dragHint}>💡 드래그하여 카테고리 순서를 변경할 수 있습니다</p>

            <div className={styles.categoryList}>
                {loading ? (
                    <div className={styles.emptyState}>로딩 중... 🐥</div>
                ) : categories.length === 0 ? (
                    <div className={styles.emptyState}>카테고리가 없습니다. 새로 추가해보세요!</div>
                ) : (
                    categories.map((category, index) => (
                        <div 
                            key={category.id} 
                            className={`${styles.categoryItem} ${dragIndex === index ? styles.dragging : ''} ${overIndex === index ? styles.dragOver : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            <div className={styles.categoryInfo}>
                                <div className={styles.dragHandle} title="드래그하여 순서 변경">
                                    <GripVertical size={20} />
                                </div>
                                <div className={styles.iconWrapper}>{category.icon}</div>
                                <div className={styles.categoryDetails}>
                                    <h3>{category.name}</h3>
                                    <span>순서: {index + 1}</span>
                                </div>
                            </div>
                            <div className={styles.itemActions}>
                                <button 
                                    className={`${styles.actionIconBtn} ${styles.editBtn}`}
                                    onClick={() => openEditModal(category)}
                                    title="수정"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button 
                                    className={`${styles.actionIconBtn} ${styles.deleteBtn}`}
                                    onClick={() => handleDelete(category.id)}
                                    title="삭제"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div 
                    className={styles.modalOverlay} 
                    onMouseDown={(e) => {
                        // 오버레이 자체에서 mousedown이 시작된 경우만 기록
                        if (e.target === e.currentTarget) mouseDownOnOverlayRef.current = true;
                    }}
                    onMouseUp={(e) => {
                        // 오버레이에서 mousedown 시작 + 오버레이에서 mouseup → 닫기
                        if (mouseDownOnOverlayRef.current && e.target === e.currentTarget && !isSaving) {
                            setIsModalOpen(false);
                        }
                        mouseDownOnOverlayRef.current = false;
                    }}
                >
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>{editingCategory ? '카테고리 수정' : '새 카테고리 추가'}</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>카테고리 이름</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="예: 커피, 논커피, 디저트 등"
                                    required
                                    disabled={isSaving}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>아이콘 선택</label>
                                <div className={styles.selectedEmoji}>
                                    <span className={styles.emojiPreview}>{formData.icon}</span>
                                    <span className={styles.emojiLabel}>선택된 아이콘</span>
                                </div>
                                <div className={styles.emojiGrid}>
                                    {['☕', '🥤', '🧋', '🍵', '🫖', '🥛', '🧃', '🍺',
                                      '🍰', '🧁', '🍩', '🍪', '🥐', '🥖', '🥪', '🥞',
                                      '🍦', '🍨', '🎂', '🍮', '🍫', '🍿', '🥜', '🌰',
                                      '🍓', '🍊', '🍋', '🍑', '🥝', '🍇', '🫐', '🥑',
                                      '🌿', '🌸', '🍃', '✨', '💎', '🔥', '⭐', '🐤',
                                      '🎯', '🎁', '🏷️', '📦', '🛒', '💰', '🆕', '❤️'
                                    ].map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            className={`${styles.emojiOption} ${formData.icon === emoji ? styles.emojiSelected : ''}`}
                                            onClick={() => setFormData({ ...formData, icon: emoji })}
                                            disabled={isSaving}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button 
                                    type="button" 
                                    className={styles.cancelBtn} 
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSaving}
                                >
                                    취소
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles.submitBtn}
                                    disabled={isSaving}
                                >
                                    {isSaving ? '저장 중...' : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <Save size={18} />
                                            {editingCategory ? '수정 완료' : '추가하기'}
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
