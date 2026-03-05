'use client';

import { Menu } from '@/types/menu';
import { useEffect, useState } from "react";
import CategoryButtons from './_components/CategoryButtons';


export default function MenusPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [categoryId, setCategoryId] = useState<number | null>(null);

    // 메뉴 fetch 함수 (categoryId가 있으면 해당 카테고리만, 없으면 전체)
    const fetchMenus = async () => {
        // new URL()을 사용하면 url을 쉽게 만들 수 있다.
        // ?을 굳이 안붙여줘도 붙어진다
        const url = new URL("/api/admin/menus", window.location.origin);
        const params = url.searchParams
        if (categoryId) {
            params.append('cid', categoryId.toString());
        }

        const response = await fetch(url);
        const data = await response.json();
        setMenus(data);
    };

    // categoryId가 변경될 때마다 fetchMenus 함수를 호출한다.
    useEffect(() => {
        // 초기 로딩: 전체 메뉴 불러오기
        fetchMenus();
    }, [categoryId]);

    const handleCategoryChange = (categoryId: number | null) => {
        console.log('선택된 카테고리:', categoryId);
        // 카테고리 ID에 따라 메뉴 다시 호출
        setCategoryId(categoryId);
    };

    return (
        <main>
            <h1>Menus</h1>

            {/* 카테고리 목록 */}
            <CategoryButtons onCategoryChange={handleCategoryChange} />

            {/* 메뉴 목록 */}
            <section>
                <h2>Menu List</h2>
                {menus.map(menu => (
                    <div key={menu.id}>
                        <div>{menu.korName}</div>
                        <div>{menu.engName}</div>
                        <div>{menu.categoryId}</div>
                        <div>{menu.price}</div>
                        <div>{menu.description}</div>
                    </div>
                ))}
            </section>

        </main>
    );
}


