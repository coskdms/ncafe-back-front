'use client';

import { useRouter } from 'next/navigation';
import { useMenuStore } from '../../../../stores/menuStore';
import { MOCK_CATEGORIES } from '@/mocks/menuData';
import { Menu } from '@/types/menu';
import MenuForm, { MenuFormData } from '../_components/MenuForm/MenuForm';
import styles from './page.module.css';

export default function NewMenuPage() {
    const router = useRouter();
    const addMenu = useMenuStore(state => state.addMenu);

    const handleSubmit = async (data: MenuFormData) => {
        // Menu 객체 생성
        const newMenu: Menu = {
            id: crypto.randomUUID(), // 임시 ID
            korName: data.korName,
            engName: data.engName || '',
            description: data.description || '',
            price: Number(data.price),
            categoryId: data.categoryId,
            images: [],
            isAvailable: data.isAvailable,
            isSoldOut: false,
            sortOrder: 99, // 맨 뒤로
            options: data.options,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // 이미지 처리 (File -> URL 변환)
        if (data.images && data.images.length > 0) {
            newMenu.images = data.images.map((file, idx) => ({
                id: crypto.randomUUID(),
                url: (file instanceof File) ? URL.createObjectURL(file) : file.url,
                isPrimary: idx === 0,
                sortOrder: idx + 1
            }));
        }

        addMenu(newMenu);

        // alert(`메뉴 [${data.korName}]가 등록되었습니다.`); 
        router.push('/admin/menus');
    };

    return (
        <main className={styles.container}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>새 메뉴 등록</h1>
            <MenuForm
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </main>
    );
}
