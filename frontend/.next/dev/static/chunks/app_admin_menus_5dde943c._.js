(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "CategoryTabs-module__OhFZKa__active",
  "tab": "CategoryTabs-module__OhFZKa__tab",
  "tabs": "CategoryTabs-module__OhFZKa__tabs",
});
}),
"[project]/app/admin/menus/_components/CategoryTabs/useCategories.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCategories",
    ()=>useCategories
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useCategories() {
    _s();
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCategories.useEffect": ()=>{
            const fetchCategories = {
                "useCategories.useEffect.fetchCategories": async ()=>{
                    try {
                        setLoading(true);
                        setError(null);
                        const response = await fetch('http://localhost:8080/admin/categories');
                        if (!response.ok) {
                            throw new Error('카테고리 데이터를 불러오는데 실패했습니다.');
                        }
                        const data = await response.json();
                        setCategories(data);
                    } catch (err) {
                        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
                    } finally{
                        setLoading(false);
                    }
                }
            }["useCategories.useEffect.fetchCategories"];
            fetchCategories();
        }
    }["useCategories.useEffect"], []);
    return {
        categories,
        totalCount: 0,
        loading,
        error
    };
}
_s(useCategories, "PEFWK5NudK8G7IEShrERrFoV+TY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$useCategories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/CategoryTabs/useCategories.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function CategoryTabs({ selectedCategory, onCategorySelect }) {
    _s();
    const { categories, loading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$useCategories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategories"])();
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabs,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: "카테고리 로딩 중..."
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.tsx",
                lineNumber: 16,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.tsx",
            lineNumber: 15,
            columnNumber: 13
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabs,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: error
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.tsx",
                lineNumber: 24,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.tsx",
            lineNumber: 23,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabs,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tab} ${selectedCategory === null ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ''}`,
                onClick: ()=>onCategorySelect(null),
                children: "전체"
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, this),
            categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tab} ${selectedCategory === category.id ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ''}`,
                    onClick: ()=>onCategorySelect(category.id),
                    children: category.name
                }, category.id, false, {
                    fileName: "[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.tsx",
                    lineNumber: 39,
                    columnNumber: 17
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.tsx",
        lineNumber: 30,
        columnNumber: 9
    }, this);
}
_s(CategoryTabs, "bSXpEfQkOpJYmWGwXHHdNQXOVa8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$useCategories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategories"]
    ];
});
_c = CategoryTabs;
var _c;
__turbopack_context__.k.register(_c, "CategoryTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/page.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "page-module__k_mG6W__container",
  "title": "page-module__k_mG6W__title",
});
}),
"[project]/app/admin/menus/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenusPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './_components/MenuList'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './_components/MenuActionBar'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/CategoryTabs/CategoryTabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$page$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/page.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function MenusPage() {
    _s();
    // 상태
    // lifting state up
    // 카테고리가 가지고 있어야할 변수를 부모에게 올리는 것
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$page$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuActionBar, {
                searchQuery: searchQuery,
                setSearchQuery: setSearchQuery
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/page.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$CategoryTabs$2f$CategoryTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                selectedCategory: selectedCategory,
                onCategorySelect: setSelectedCategory
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/page.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuList, {
                searchQuery: searchQuery,
                selectedCategory: selectedCategory
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/page.tsx",
                lineNumber: 32,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/page.tsx",
        lineNumber: 18,
        columnNumber: 9
    }, this);
}
_s(MenusPage, "tRKYdkeEGz9JjVi4SMb20x7SzaA=");
_c = MenusPage;
var _c;
__turbopack_context__.k.register(_c, "MenusPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_admin_menus_5dde943c._.js.map