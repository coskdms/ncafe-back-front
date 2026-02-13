(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/admin/menus/[id]/_components/useMenuDetail.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMenuDetail",
    ()=>useMenuDetail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useMenuDetail(menuId) {
    _s();
    const [menu, setMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMenuDetail.useCallback[fetchMenu]": async ()=>{
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`http://localhost:8080/admin/menus/${menuId}`);
                if (!response.ok) {
                    throw new Error('메뉴 데이터를 불러오는데 실패했습니다.');
                }
                const data = await response.json();
                setMenu(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            } finally{
                setLoading(false);
            }
        }
    }["useMenuDetail.useCallback[fetchMenu]"], [
        menuId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMenuDetail.useEffect": ()=>{
            fetchMenu();
        }
    }["useMenuDetail.useEffect"], [
        fetchMenu
    ]);
    return {
        menu,
        loading,
        error,
        refetch: fetchMenu
    };
}
_s(useMenuDetail, "YhdnbMMJzdQt4wp0zPKtOk546hI=");
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
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ImageGallery({ images, altText }) {
    _s();
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // 이미지 URL 생성 함수
    const getImageUrl = (src)=>{
        return src.startsWith('http') ? src : `http://localhost:8080/${src}`;
    };
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
                            lineNumber: 27,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "이미지 없음"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                            lineNumber: 28,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                    lineNumber: 26,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                lineNumber: 25,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
            lineNumber: 24,
            columnNumber: 13
        }, this);
    }
    const mainImage = images[selectedIndex];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageSection,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mainImageWrapper,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: getImageUrl(mainImage),
                    alt: altText,
                    fill: true,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mainImage,
                    priority: true
                }, void 0, false, {
                    fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                    lineNumber: 41,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                lineNumber: 40,
                columnNumber: 13
            }, this),
            images.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].thumbnailList,
                children: images.map((img, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].thumbnail} ${idx === selectedIndex ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ''}`,
                        onClick: ()=>setSelectedIndex(idx),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: getImageUrl(img),
                            alt: `${altText} ${idx + 1}`,
                            fill: true,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].thumbnailImage
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                            lineNumber: 59,
                            columnNumber: 29
                        }, this)
                    }, idx, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                        lineNumber: 54,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
                lineNumber: 52,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
        lineNumber: 38,
        columnNumber: 9
    }, this);
}
_s(ImageGallery, "G8fEPHHi9+P2oI7WxiQDc3s4+J4=");
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
function BasicInfo({ korName, engName, description, price, categoryName, isAvailable, isSoldOut }) {
    const formatPrice = (priceStr)=>{
        const numPrice = parseFloat(priceStr);
        return new Intl.NumberFormat('ko-KR').format(numPrice);
    };
    const getStatusBadge = ()=>{
        if (isSoldOut) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badge} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].soldOut}`,
                children: "품절"
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 31,
                columnNumber: 20
            }, this);
        }
        if (!isAvailable) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badge} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hidden}`,
                children: "숨김"
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 34,
                columnNumber: 20
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badge} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active}`,
            children: "판매중"
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
            lineNumber: 36,
            columnNumber: 16
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].infoSection,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].titleGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].korName,
                                children: korName
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                                lineNumber: 44,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].engName,
                                children: engName
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                                lineNumber: 45,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badges,
                        children: [
                            categoryName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badge} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].category}`,
                                children: categoryName
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                                lineNumber: 49,
                                columnNumber: 25
                            }, this),
                            getStatusBadge()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 47,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 42,
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
                        lineNumber: 59,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                        children: [
                            "₩",
                            formatPrice(price)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 60,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 58,
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
                        lineNumber: 65,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].description,
                        children: description || '설명이 없습니다.'
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 66,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 64,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
        lineNumber: 40,
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
"[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionButtons": "MenuActions-module__RK844a__actionButtons",
  "actionsContainer": "MenuActions-module__RK844a__actionsContainer",
  "backButton": "MenuActions-module__RK844a__backButton",
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function MenuActions({ menuId, onDelete }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleDelete = ()=>{
        if (confirm('정말 삭제하시겠습니까?')) {
            onDelete();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actionsContainer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/admin/menus",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].backButton,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                        size: 20
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                        lineNumber: 25,
                        columnNumber: 17
                    }, this),
                    "목록으로"
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                lineNumber: 24,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actionButtons,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/admin/menus/${menuId}/edit`,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editButton,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                                lineNumber: 31,
                                columnNumber: 21
                            }, this),
                            "수정"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                        lineNumber: 30,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].deleteButton,
                        onClick: handleDelete,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                                lineNumber: 35,
                                columnNumber: 21
                            }, this),
                            "삭제"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                        lineNumber: 34,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
                lineNumber: 29,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
        lineNumber: 23,
        columnNumber: 9
    }, this);
}
_s(MenuActions, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = MenuActions;
var _c;
__turbopack_context__.k.register(_c, "MenuActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/common/Button/Button.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button": "Button-module__AEIVMa__button",
  "danger": "Button-module__AEIVMa__danger",
  "disabled": "Button-module__AEIVMa__disabled",
  "fullWidth": "Button-module__AEIVMa__fullWidth",
  "ghost": "Button-module__AEIVMa__ghost",
  "lg": "Button-module__AEIVMa__lg",
  "md": "Button-module__AEIVMa__md",
  "outline": "Button-module__AEIVMa__outline",
  "primary": "Button-module__AEIVMa__primary",
  "secondary": "Button-module__AEIVMa__secondary",
  "sm": "Button-module__AEIVMa__sm",
});
}),
"[project]/components/common/Button/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/common/Button/Button.module.css [app-client] (css module)");
'use client';
;
;
function Button({ variant = 'primary', size = 'md', children, fullWidth = false, className = '', disabled, ...props }) {
    const classNames = [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].button,
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"][variant],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"][size],
        fullWidth ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fullWidth : '',
        disabled ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].disabled : '',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: classNames,
        disabled: disabled,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/common/Button/Button.tsx",
        lineNumber: 34,
        columnNumber: 9
    }, this);
}
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/common/Button/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/Button/Button.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/[id]/_components/MenuDetailClient.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "backButton": "MenuDetailClient-module__RAiuYW__backButton",
  "container": "MenuDetailClient-module__RAiuYW__container",
  "content": "MenuDetailClient-module__RAiuYW__content",
  "dateInfo": "MenuDetailClient-module__RAiuYW__dateInfo",
  "errorMessage": "MenuDetailClient-module__RAiuYW__errorMessage",
  "errorWrapper": "MenuDetailClient-module__RAiuYW__errorWrapper",
  "header": "MenuDetailClient-module__RAiuYW__header",
  "loadingWrapper": "MenuDetailClient-module__RAiuYW__loadingWrapper",
  "rightSection": "MenuDetailClient-module__RAiuYW__rightSection",
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$useMenuDetail$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/useMenuDetail.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/common/Button/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/MenuDetailClient.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function MenuDetailClient({ menuId }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { menu, loading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$useMenuDetail$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuDetail"])(menuId);
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
    // 로딩 상태
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 38,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "메뉴 정보를 불러오는 중..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 39,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 37,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
            lineNumber: 36,
            columnNumber: 13
        }, this);
    }
    // 에러 상태
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorMessage,
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 50,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/admin/menus",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            variant: "outline",
                            children: "목록으로 돌아가기"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                            lineNumber: 52,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 51,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 49,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
            lineNumber: 48,
            columnNumber: 13
        }, this);
    }
    // 메뉴를 찾을 수 없는 경우
    if (!menu) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorMessage,
                        children: "메뉴를 찾을 수 없습니다."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 64,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/admin/menus",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            variant: "outline",
                            children: "목록으로 돌아가기"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                            lineNumber: 66,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 65,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 63,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
            lineNumber: 62,
            columnNumber: 13
        }, this);
    }
    const handleDelete = async ()=>{
        try {
            const response = await fetch(`http://localhost:8080/admin/menus/${menu.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('메뉴가 삭제되었습니다.');
                router.push('/admin/menus');
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (err) {
            alert('삭제 중 오류가 발생했습니다.');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/admin/menus",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].backButton,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 95,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "목록으로"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 96,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 94,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dateInfo,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "생성: ",
                                    formatDate(menu.createdAt)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 99,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "수정: ",
                                    formatDate(menu.updatedAt)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 100,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 98,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 93,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        images: menu.images,
                        altText: menu.korName
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 106,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].rightSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                korName: menu.korName,
                                engName: menu.engName,
                                description: menu.description,
                                price: menu.price,
                                categoryName: menu.categoryName,
                                isAvailable: menu.isAvailable,
                                isSoldOut: menu.isSoldOut
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 113,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                menuId: menu.id,
                                onDelete: handleDelete
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 124,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 112,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 104,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
        lineNumber: 91,
        columnNumber: 9
    }, this);
}
_s(MenuDetailClient, "NtTvsRZCDPWmqa49Rf6qIAqcZEo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$useMenuDetail$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuDetail"]
    ];
});
_c = MenuDetailClient;
var _c;
__turbopack_context__.k.register(_c, "MenuDetailClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_6eae7f93._.js.map