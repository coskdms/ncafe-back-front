'use client';

import CategoryTabs from '../_components/category/CategoryTabs/CategoryTabs';
import { useState } from 'react';

export default function CategoriesPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    return (
        <main style={{ padding: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>카테고리 관리</h1>
            
            <section style={{ marginBottom: '24px' }}>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                    여기에서 메뉴 카테고리를 새롭게 등록, 수정 및 삭제할 수 있습니다.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                        + 새 카테고리 추가
                    </button>
                    <button style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                        순서 변경
                    </button>
                </div>
            </section>

            <section style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>등록된 카테고리 확인</h2>
                {/* 기존에 있던 CategoryTabs 컴포넌트를 활용해 리스트처럼 보여주기 */}
                <CategoryTabs 
                    selectedCategory={selectedCategory} 
                    onCategorySelect={setSelectedCategory} 
                />
                
                <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '4px' }}>
                    {selectedCategory ? (
                        <p>ID가 <strong>{selectedCategory}</strong>인 카테고리를 선택하셨습니다. (여기에 수정 폼이 위치할 수 있습니다.)</p>
                    ) : (
                        <p>카테고리를 선택하거나 새 카테고리를 추가해보세요.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
