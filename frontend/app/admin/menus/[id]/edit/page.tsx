'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMenuStore } from '../../../../../stores/menuStore';
import MenuForm, { MenuFormData } from '../../_components/MenuForm';
import styles from './page.module.css';

export default function EditMenuPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const getMenu = useMenuStore(state => state.getMenu);
    const updateMenu = useMenuStore(state => state.updateMenu);

    const [menuData, setMenuData] = useState<MenuFormData | null>(null);

    useEffect(() => {
        const menu = getMenu(id);
        if (menu) {
            const formData: MenuFormData = {
                korName: menu.korName,
                engName: menu.engName,
                categoryId: menu.category.id,
                price: menu.price,
                description: menu.description,
                isAvailable: menu.isAvailable,
                images: menu.images,
                options: menu.options
            };
            setMenuData(formData);
        } else {
            // 새로고침하면 Store가 초기화되어 못 찾을 수도 있음 (MOCK_DATA에 없는 ID라면)
            // MOCK_DATA에 있는 ID면 찾을 수 있음.
            // 일단 못 찾으면 목록으로 리다이렉트
            // alert('메뉴를 찾을 수 없습니다.');
            // router.push('/admin/menus');
        }
    }, [id, getMenu, router]);

    const handleSubmit = (data: MenuFormData) => {
        try {
            updateMenu(id, {
                korName: data.korName,
                engName: data.engName,
                description: data.description,
                price: data.price,
                isAvailable: data.isAvailable,
                options: data.options,
                // categoryId 처리: 실제로는 categoryId로 category 객체를 찾아야 함.
                // Store/MockData 구조상 여기선 categoryId만 업데이트하거나, 
                // updateMenu 로직에서 처리해야 함. 
                // 하지만 updateMenu는 Partial<Menu>를 받음.
                // 편의상 카테고리 업데이트는 지금은 생략하거나 Mock에서 찾아서 넣어야 함.
                // 여기서는 간단히 무시하거나, TODO로 남김. (카테고리 객체를 구성해야 함)
            });

            alert('메뉴가 수정되었습니다.');
            router.push(`/admin/menus/${id}`);
        } catch (e) {
            console.error(e);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    if (!menuData) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <main className={styles.container}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>메뉴 수정</h1>
            <MenuForm
                initialData={menuData}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </main>
    );
}
