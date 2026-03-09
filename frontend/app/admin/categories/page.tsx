'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X } from 'lucide-react';
import styles from './Categories.module.css';

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
            } else {
                alert('저장에 실패했습니다.');
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
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const moveCategory = async (index: number, direction: 'up' | 'down') => {
        const newCategories = [...categories];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= categories.length) return;

        // 위치 교체
        [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
        
        // Optimistic UI update
        setCategories(newCategories);

        // 서버에 순서 업데이트 요청
        try {
            const res = await fetch('/api/admin/categories/reorder', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategories.map(c => c.id)),
            });
            if (!res.ok) {
                fetchCategories(); // 실패 시 롤백
            }
        } catch (error) {
            console.error('Failed to reorder:', error);
            fetchCategories();
        }
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

            <div className={styles.categoryList}>
                {loading ? (
                    <div className={styles.emptyState}>로딩 중... 🐥</div>
                ) : categories.length === 0 ? (
                    <div className={styles.emptyState}>카테고리가 없습니다. 새로 추가해보세요!</div>
                ) : (
                    categories.map((category, index) => (
                        <div key={category.id} className={styles.categoryItem}>
                            <div className={styles.categoryInfo}>
                                <div className={styles.iconWrapper}>{category.icon}</div>
                                <div className={styles.categoryDetails}>
                                    <h3>{category.name}</h3>
                                    <span>순서: {category.sortOrder}</span>
                                </div>
                            </div>
                            <div className={styles.itemActions}>
                                <button 
                                    className={`${styles.actionIconBtn} ${styles.moveBtn}`}
                                    onClick={() => moveCategory(index, 'up')}
                                    disabled={index === 0}
                                    title="위로 이동"
                                >
                                    <ArrowUp size={18} />
                                </button>
                                <button 
                                    className={`${styles.actionIconBtn} ${styles.moveBtn}`}
                                    onClick={() => moveCategory(index, 'down')}
                                    disabled={index === categories.length - 1}
                                    title="아래로 이동"
                                >
                                    <ArrowDown size={18} />
                                </button>
                                <div style={{ width: '1px', height: '24px', background: '#eee', margin: '0 8px' }} />
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
                <div className={styles.modalOverlay} onClick={() => !isSaving && setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
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
                                <label>아이콘 (이모지)</label>
                                <input 
                                    type="text" 
                                    value={formData.icon}
                                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="예: ☕, 🥤, 🍰"
                                    required
                                    disabled={isSaving}
                                />
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
