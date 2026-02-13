module.exports = [
"[project]/mocks/menuData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 목업 메뉴 데이터
__turbopack_context__.s([
    "MOCK_CATEGORIES",
    ()=>MOCK_CATEGORIES,
    "MOCK_MENUS",
    ()=>MOCK_MENUS
]);
const MOCK_CATEGORIES = [
    {
        id: '1',
        korName: '커피',
        engName: 'Coffee',
        sortOrder: 1
    },
    {
        id: '2',
        korName: '음료',
        engName: 'Beverage',
        sortOrder: 2
    },
    {
        id: '3',
        korName: '티',
        engName: 'Tea',
        sortOrder: 3
    },
    {
        id: '4',
        korName: '디저트',
        engName: 'Dessert',
        sortOrder: 4
    },
    {
        id: '5',
        korName: '베이커리',
        engName: 'Bakery',
        sortOrder: 5
    }
];
const MOCK_MENUS = [
    {
        id: '1',
        korName: '아메리카노',
        engName: 'Americano',
        description: '진한 에스프레소에 물을 더해 깔끔한 맛을 즐길 수 있는 커피',
        price: 4500,
        categoryId: '1',
        images: [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&h=300&fit=crop',
                isPrimary: true,
                sortOrder: 1
            }
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [
            {
                id: '1',
                name: '사이즈',
                type: 'radio',
                required: true,
                items: [
                    {
                        id: '1',
                        name: 'Regular',
                        priceDelta: 0
                    },
                    {
                        id: '2',
                        name: 'Large',
                        priceDelta: 500
                    }
                ]
            },
            {
                id: '2',
                name: '샷 추가',
                type: 'checkbox',
                required: false,
                items: [
                    {
                        id: '3',
                        name: '샷 추가',
                        priceDelta: 500
                    }
                ]
            }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: '2',
        korName: '카페라떼',
        engName: 'Cafe Latte',
        description: '부드러운 우유와 에스프레소의 조화',
        price: 5000,
        categoryId: '1',
        images: [
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
                isPrimary: true,
                sortOrder: 1
            }
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 2,
        options: [
            {
                id: '3',
                name: '사이즈',
                type: 'radio',
                required: true,
                items: [
                    {
                        id: '4',
                        name: 'Regular',
                        priceDelta: 0
                    },
                    {
                        id: '5',
                        name: 'Large',
                        priceDelta: 500
                    }
                ]
            }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: '3',
        korName: '바닐라라떼',
        engName: 'Vanilla Latte',
        description: '달콤한 바닐라 시럽이 들어간 라떼',
        price: 5500,
        categoryId: '1',
        images: [
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop',
                isPrimary: true,
                sortOrder: 1
            }
        ],
        isAvailable: true,
        isSoldOut: true,
        sortOrder: 3,
        options: [],
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
    },
    {
        id: '4',
        korName: '자몽에이드',
        engName: 'Grapefruit Ade',
        description: '상큼한 자몽과 탄산수의 청량한 조합',
        price: 5500,
        categoryId: '2',
        images: [
            {
                id: '4',
                url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
                isPrimary: true,
                sortOrder: 1
            }
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: '5',
        korName: '녹차라떼',
        engName: 'Green Tea Latte',
        description: '고급 말차와 부드러운 우유의 조화',
        price: 5500,
        categoryId: '2',
        images: [
            {
                id: '5',
                url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop',
                isPrimary: true,
                sortOrder: 1
            }
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: '6',
        korName: '티라미수',
        engName: 'Tiramisu',
        description: '부드러운 마스카포네 크림과 커피의 풍미',
        price: 6500,
        categoryId: '3',
        images: [
            {
                id: '6',
                url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
                isPrimary: true,
                sortOrder: 1
            }
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: '7',
        korName: '크로와상',
        engName: 'Croissant',
        description: '겉은 바삭하고 속은 부드러운 프랑스식 페이스트리',
        price: 3500,
        categoryId: '4',
        images: [
            {
                id: '7',
                url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
                isPrimary: true,
                sortOrder: 1
            }
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    }
];
}),
"[project]/stores/menuStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMenuStore",
    ()=>useMenuStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$mocks$2f$menuData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/mocks/menuData.ts [app-ssr] (ecmascript)");
;
;
const useMenuStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        menus: __TURBOPACK__imported__module__$5b$project$5d2f$mocks$2f$menuData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_MENUS"],
        setMenus: (newMenus)=>set({
                menus: newMenus
            }),
        addMenu: (menu)=>set((state)=>({
                    menus: [
                        menu,
                        ...state.menus
                    ]
                })),
        updateMenu: (id, updatedMenu)=>set((state)=>({
                    menus: state.menus.map((m)=>m.id === id ? {
                            ...m,
                            ...updatedMenu
                        } : m)
                })),
        deleteMenu: (id)=>set((state)=>({
                    menus: state.menus.filter((m)=>m.id !== id)
                })),
        getMenu: (id)=>get().menus.find((m)=>m.id === id)
    }));
}),
"[project]/app/admin/menus/[id]/edit/page.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "page-module__kuJd9a__container",
});
}),
"[project]/app/admin/menus/[id]/edit/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditMenuPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$menuStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stores/menuStore.ts [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../_components/MenuForm'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$edit$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/edit/page.module.css [app-ssr] (css module)");
'use client';
;
;
;
;
;
;
function EditMenuPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const id = params?.id;
    const getMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$menuStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((state)=>state.getMenu);
    const updateMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$menuStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((state)=>state.updateMenu);
    const [menuData, setMenuData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const menu = getMenu(id);
        if (menu) {
            const formData = {
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
    }, [
        id,
        getMenu,
        router
    ]);
    const handleSubmit = (data)=>{
        try {
            updateMenu(id, {
                korName: data.korName,
                engName: data.engName,
                description: data.description,
                price: data.price,
                isAvailable: data.isAvailable,
                options: data.options
            });
            alert('메뉴가 수정되었습니다.');
            router.push(`/admin/menus/${id}`);
        } catch (e) {
            console.error(e);
            alert('수정 중 오류가 발생했습니다.');
        }
    };
    if (!menuData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$edit$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/[id]/edit/page.tsx",
            lineNumber: 68,
            columnNumber: 16
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$edit$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    fontSize: '24px',
                    fontWeight: 'bold'
                },
                children: "메뉴 수정"
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/edit/page.tsx",
                lineNumber: 73,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuForm, {
                initialData: menuData,
                onSubmit: handleSubmit,
                onCancel: ()=>router.back()
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/edit/page.tsx",
                lineNumber: 74,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/edit/page.tsx",
        lineNumber: 72,
        columnNumber: 9
    }, this);
}
}),
"[project]/node_modules/zustand/esm/vanilla.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStore",
    ()=>createStore
]);
const createStoreImpl = (createState)=>{
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace)=>{
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
            listeners.forEach((listener)=>listener(state, previousState));
        }
    };
    const getState = ()=>state;
    const getInitialState = ()=>initialState;
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    const api = {
        setState,
        getState,
        getInitialState,
        subscribe
    };
    const initialState = state = createState(setState, getState, api);
    return api;
};
const createStore = (createState)=>createState ? createStoreImpl(createState) : createStoreImpl;
;
}),
"[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "create",
    ()=>create,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/vanilla.mjs [app-ssr] (ecmascript)");
;
;
const identity = (arg)=>arg;
function useStore(api, selector = identity) {
    const slice = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(api.subscribe, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(()=>selector(api.getState()), [
        api,
        selector
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(()=>selector(api.getInitialState()), [
        api,
        selector
    ]));
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useDebugValue(slice);
    return slice;
}
const createImpl = (createState)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStore"])(createState);
    const useBoundStore = (selector)=>useStore(api, selector);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = (createState)=>createState ? createImpl(createState) : createImpl;
;
}),
];

//# sourceMappingURL=_237d4d6d._.js.map