(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "backButton": "DetailHeader-module__PCG-kG__backButton",
  "dateInfo": "DetailHeader-module__PCG-kG__dateInfo",
  "header": "DetailHeader-module__PCG-kG__header",
});
}),
"[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DetailHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$DetailHeader$2f$DetailHeader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.module.css [app-client] (css module)");
'use client';
;
;
function DetailHeader({ title }) {
    // 날짜 포맷팅 함수
    const formatDate = (dateString)=>{
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$DetailHeader$2f$DetailHeader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header
    }, void 0, false, {
        fileName: "[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.tsx",
        lineNumber: 28,
        columnNumber: 9
    }, this);
}
_c = DetailHeader;
var _c;
__turbopack_context__.k.register(_c, "DetailHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "ImageGallery-module__2fm2ha__active",
  "imageSection": "ImageGallery-module__2fm2ha__imageSection",
  "mainImage": "ImageGallery-module__2fm2ha__mainImage",
  "mainImageWrapper": "ImageGallery-module__2fm2ha__mainImageWrapper",
  "placeholder": "ImageGallery-module__2fm2ha__placeholder",
  "thumbnail": "ImageGallery-module__2fm2ha__thumbnail",
  "thumbnailImage": "ImageGallery-module__2fm2ha__thumbnailImage",
  "thumbnailList": "ImageGallery-module__2fm2ha__thumbnailList",
});
}),
"[project]/app/admin/menus/[id]/_components/ImageGallery/useMenuImages.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMenuImages",
    ()=>useMenuImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useMenuImages(menuId) {
    _s();
    const [images, setImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMenuImages.useCallback[fetchImages]": async ()=>{
            if (!menuId) return;
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`http://localhost:8080/admin/menus/${menuId}/menu-images`);
                if (!response.ok) {
                    throw new Error('이미지 목록을 불러오는데 실패했습니다.');
                }
                const data = await response.json();
                // 백엔드 응답 구조: { images: [...] }
                setImages(data.images || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            } finally{
                setLoading(false);
            }
        }
    }["useMenuImages.useCallback[fetchImages]"], [
        menuId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMenuImages.useEffect": ()=>{
            fetchImages();
        }
    }["useMenuImages.useEffect"], [
        fetchImages
    ]);
    return {
        images,
        loading,
        error,
        refetch: fetchImages
    };
}
_s(useMenuImages, "scQDQ1LU3fUf3a2UvQOwkzuOnaw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ImageGallery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coffee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coffee$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/coffee.js [app-client] (ecmascript) <export default as Coffee>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$useMenuImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/ImageGallery/useMenuImages.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function ImageGallery({ menuId }) {
    _s();
    const { images, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$useMenuImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuImages"])(menuId);
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageSection,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mainImageWrapper,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].placeholder,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "로딩중..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                        lineNumber: 18,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                    lineNumber: 17,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                lineNumber: 16,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
            lineNumber: 15,
            columnNumber: 13
        }, this);
    }
    // 이미지가 없는 경우
    if (!images || images.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageSection,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mainImageWrapper,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].placeholder,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coffee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coffee$3e$__["Coffee"], {
                            size: 64
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                            lineNumber: 31,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "이미지 없음"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                            lineNumber: 32,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                    lineNumber: 30,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                lineNumber: 29,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
            lineNumber: 28,
            columnNumber: 13
        }, this);
    }
    // 현재 선택된 이미지 (기본값: 첫 번째 이미지)
    const mainImage = images[selectedIndex];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageSection,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mainImageWrapper,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageContainer,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: `http://localhost:8080/images/menus/${mainImage.srcUrl}`,
                        alt: mainImage.altText || "Menu Main Image",
                        fill: true,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mainImage,
                        priority: true
                    }, mainImage.srcUrl, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                        lineNumber: 47,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                    lineNumber: 46,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, this),
            images.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].thumbnailList,
                children: images.map((img, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].thumbnail} ${idx === selectedIndex ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ''}`,
                        onClick: ()=>setSelectedIndex(idx),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].thumbnailImageWrapper,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: `http://localhost:8080/images/menus/${img.srcUrl}`,
                                alt: `${img.altText || 'Thumbnail'} ${idx + 1}`,
                                fill: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].thumbnailImage
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                                lineNumber: 68,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                            lineNumber: 67,
                            columnNumber: 29
                        }, this)
                    }, img.id, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                        lineNumber: 62,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                lineNumber: 60,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
        lineNumber: 43,
        columnNumber: 9
    }, this);
}
_s(ImageGallery, "l+0RfMPs7MZY0D2N/IwFIvUVkSE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$useMenuImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuImages"]
    ];
});
_c = ImageGallery;
var _c;
__turbopack_context__.k.register(_c, "ImageGallery");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "BasicInfo-module__qON-ra__active",
  "badge": "BasicInfo-module__qON-ra__badge",
  "badges": "BasicInfo-module__qON-ra__badges",
  "blockTitle": "BasicInfo-module__qON-ra__blockTitle",
  "category": "BasicInfo-module__qON-ra__category",
  "description": "BasicInfo-module__qON-ra__description",
  "engName": "BasicInfo-module__qON-ra__engName",
  "header": "BasicInfo-module__qON-ra__header",
  "hidden": "BasicInfo-module__qON-ra__hidden",
  "infoBlock": "BasicInfo-module__qON-ra__infoBlock",
  "infoSection": "BasicInfo-module__qON-ra__infoSection",
  "korName": "BasicInfo-module__qON-ra__korName",
  "price": "BasicInfo-module__qON-ra__price",
  "soldOut": "BasicInfo-module__qON-ra__soldOut",
  "titleGroup": "BasicInfo-module__qON-ra__titleGroup",
});
}),
"[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BasicInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.module.css [app-client] (css module)");
'use client';
;
;
function BasicInfo({ menu }) {
    // useBasicInfo 제거
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].infoSection,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].titleGroup,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].korName,
                            children: menu?.korName
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                            lineNumber: 18,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].engName,
                            children: menu?.engName
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                            lineNumber: 19,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                    lineNumber: 17,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 16,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].infoBlock,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].blockTitle,
                        children: "가격"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 26,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                        children: [
                            "₩",
                            menu?.price?.toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].infoBlock,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].blockTitle,
                        children: "설명"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 32,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].description,
                        children: menu?.description || '설명이 없습니다.'
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 33,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
        lineNumber: 14,
        columnNumber: 9
    }, this);
}
_c = BasicInfo;
var _c;
__turbopack_context__.k.register(_c, "BasicInfo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "badge": "OptionsInfo-module__ZRlDoq__badge",
  "badges": "OptionsInfo-module__ZRlDoq__badges",
  "cardHeader": "OptionsInfo-module__ZRlDoq__cardHeader",
  "categoryName": "OptionsInfo-module__ZRlDoq__categoryName",
  "header": "OptionsInfo-module__ZRlDoq__header",
  "item": "OptionsInfo-module__ZRlDoq__item",
  "itemList": "OptionsInfo-module__ZRlDoq__itemList",
  "itemName": "OptionsInfo-module__ZRlDoq__itemName",
  "itemPrice": "OptionsInfo-module__ZRlDoq__itemPrice",
  "multi": "OptionsInfo-module__ZRlDoq__multi",
  "optionCard": "OptionsInfo-module__ZRlDoq__optionCard",
  "optionsGrid": "OptionsInfo-module__ZRlDoq__optionsGrid",
  "optionsSection": "OptionsInfo-module__ZRlDoq__optionsSection",
  "required": "OptionsInfo-module__ZRlDoq__required",
  "single": "OptionsInfo-module__ZRlDoq__single",
  "title": "OptionsInfo-module__ZRlDoq__title",
});
}),
"[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OptionsInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.module.css [app-client] (css module)");
'use client';
;
;
const DUMMY_OPTIONS = [
    {
        id: 1,
        name: '사이즈 선택',
        isRequired: true,
        isMultiSelect: false,
        items: [
            {
                id: 101,
                name: 'Regular',
                price: 0
            },
            {
                id: 102,
                name: 'Large',
                price: 500
            }
        ]
    },
    {
        id: 2,
        name: '온도 (HOT/ICE)',
        isRequired: true,
        isMultiSelect: false,
        items: [
            {
                id: 201,
                name: 'HOT',
                price: 0
            },
            {
                id: 202,
                name: 'ICE',
                price: 0
            }
        ]
    },
    {
        id: 3,
        name: '샷 추가',
        isRequired: false,
        isMultiSelect: true,
        items: [
            {
                id: 301,
                name: '샷 추가',
                price: 500
            }
        ]
    },
    {
        id: 4,
        name: '시럽 선택',
        isRequired: false,
        isMultiSelect: false,
        items: [
            {
                id: 401,
                name: '바닐라 시럽',
                price: 500
            },
            {
                id: 402,
                name: '헤이즐넛 시럽',
                price: 500
            },
            {
                id: 403,
                name: '카라멜 시럽',
                price: 500
            }
        ]
    },
    {
        id: 5,
        name: '얼음 양',
        isRequired: false,
        isMultiSelect: false,
        items: [
            {
                id: 501,
                name: '얼음 조금',
                price: 0
            },
            {
                id: 502,
                name: '얼음 보통',
                price: 0
            },
            {
                id: 503,
                name: '얼음 많이',
                price: 0
            }
        ]
    },
    {
        id: 6,
        name: '휘핑 크림',
        isRequired: false,
        isMultiSelect: false,
        items: [
            {
                id: 601,
                name: '휘핑 없이',
                price: 0
            },
            {
                id: 602,
                name: '휘핑 조금',
                price: 0
            },
            {
                id: 603,
                name: '휘핑 보통',
                price: 0
            },
            {
                id: 604,
                name: '휘핑 많이',
                price: 500
            }
        ]
    }
];
function OptionsInfo() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].optionsSection,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                    children: "옵션 정보"
                }, void 0, false, {
                    fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                    lineNumber: 89,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                lineNumber: 88,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].optionsGrid,
                children: DUMMY_OPTIONS.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].optionCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardHeader,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryName,
                                        children: category.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                        lineNumber: 96,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badges,
                                        children: [
                                            category.isRequired && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badge} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].required}`,
                                                children: "필수"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                                lineNumber: 98,
                                                columnNumber: 57
                                            }, this),
                                            category.isMultiSelect ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badge} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multi}`,
                                                children: "다중선택"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                                lineNumber: 100,
                                                columnNumber: 37
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badge} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].single}`,
                                                children: "단일선택"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                                lineNumber: 101,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                        lineNumber: 97,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                lineNumber: 95,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemList,
                                children: category.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].item,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemName,
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                                lineNumber: 108,
                                                columnNumber: 37
                                            }, this),
                                            item.price > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemPrice,
                                                children: [
                                                    "+",
                                                    item.price.toLocaleString(),
                                                    "원"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                                lineNumber: 109,
                                                columnNumber: 56
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                        lineNumber: 107,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                                lineNumber: 105,
                                columnNumber: 25
                            }, this)
                        ]
                    }, category.id, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                        lineNumber: 94,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
                lineNumber: 92,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx",
        lineNumber: 87,
        columnNumber: 9
    }, this);
}
_c = OptionsInfo;
var _c;
__turbopack_context__.k.register(_c, "OptionsInfo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionsContainer": "MenuActions-module__RK844a__actionsContainer",
  "deleteButton": "MenuActions-module__RK844a__deleteButton",
  "editButton": "MenuActions-module__RK844a__editButton",
});
}),
"[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenuActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.module.css [app-client] (css module)");
'use client';
;
;
;
;
function MenuActions() {
    // const handleDelete = () => {
    //     if (confirm('정말 삭제하시겠습니까?')) {
    //         onDelete();
    //     }
    // };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actionsContainer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editButton,
                href: ``,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                        size: 18
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                        lineNumber: 22,
                        columnNumber: 17
                    }, this),
                    "수정"
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                lineNumber: 21,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].deleteButton,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                        size: 18
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                        lineNumber: 26,
                        columnNumber: 17
                    }, this),
                    "삭제"
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
        lineNumber: 20,
        columnNumber: 9
    }, this);
}
_c = MenuActions;
var _c;
__turbopack_context__.k.register(_c, "MenuActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/[id]/_components/MenuDetailClient.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionWrapper": "MenuDetailClient-module__RAiuYW__actionWrapper",
  "container": "MenuDetailClient-module__RAiuYW__container",
  "content": "MenuDetailClient-module__RAiuYW__content",
  "errorMessage": "MenuDetailClient-module__RAiuYW__errorMessage",
  "errorWrapper": "MenuDetailClient-module__RAiuYW__errorWrapper",
  "leftColumn": "MenuDetailClient-module__RAiuYW__leftColumn",
  "loadingWrapper": "MenuDetailClient-module__RAiuYW__loadingWrapper",
  "rightColumn": "MenuDetailClient-module__RAiuYW__rightColumn",
  "spin": "MenuDetailClient-module__RAiuYW__spin",
  "spinner": "MenuDetailClient-module__RAiuYW__spinner",
});
}),
"[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenuDetailClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$DetailHeader$2f$DetailHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/OptionsInfo/OptionsInfo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/MenuDetailClient.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function MenuDetailClient({ params }) {
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$DetailHeader$2f$DetailHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "메뉴 상세"
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].leftColumn,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                menuId: id
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 24,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                id: id
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 25,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 23,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].rightColumn,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$OptionsInfo$2f$OptionsInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                            lineNumber: 30,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 29,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 21,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actionWrapper,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                    lineNumber: 36,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
_c = MenuDetailClient;
var _c;
__turbopack_context__.k.register(_c, "MenuDetailClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_admin_menus_%5Bid%5D__components_b2595474._.js.map