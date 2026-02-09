module.exports = [
"[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "backButton": "DetailHeader-module__PCG-kG__backButton",
  "dateInfo": "DetailHeader-module__PCG-kG__dateInfo",
  "header": "DetailHeader-module__PCG-kG__header",
});
}),
"[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DetailHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$DetailHeader$2f$DetailHeader$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.module.css [app-ssr] (css module)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$DetailHeader$2f$DetailHeader$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header
    }, void 0, false, {
        fileName: "[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.tsx",
        lineNumber: 28,
        columnNumber: 9
    }, this);
}
}),
"[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ImageGallery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.module.css [app-ssr] (css module)");
'use client';
;
;
;
;
function ImageGallery() {
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // 이미지 URL 생성 함수
    const getImageUrl = (src)=>{
        return src.startsWith('http') ? src : `http://localhost:8080/${src}`;
    };
    // 이미지가 없는 경우
    // if (!images || images.length === 0) {
    //     return (
    //         <section className={styles.imageSection}>
    //             <div className={styles.mainImageWrapper}>
    //                 <div className={styles.placeholder}>
    //                     <Coffee size={64} />
    //                     <span>이미지 없음</span>
    //                 </div>
    //             </div>
    //         </section>
    //     );
    // }
    // const mainImage = images[selectedIndex];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].imageSection,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mainImageWrapper,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                src: "/images/menu/americano.png",
                alt: "Americano",
                fill: true,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mainImage,
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
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx",
        lineNumber: 38,
        columnNumber: 9
    }, this);
}
}),
"[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BasicInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../useMenuDetail'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.module.css [app-ssr] (css module)");
'use client';
;
;
;
function BasicInfo({ id }) {
    const { menu } = useMenuDetail(id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].infoSection,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].titleGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].korName,
                                children: menu?.korName
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                                lineNumber: 16,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].engName,
                                children: menu?.engName
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                                lineNumber: 17,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 15,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].badges
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 19,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 14,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].infoBlock,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blockTitle,
                        children: "가격"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 25,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].price,
                        children: [
                            "₩",
                            menu?.price
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 26,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 24,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].infoBlock,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blockTitle,
                        children: "설명"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 31,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].description,
                        children: menu?.description || '설명이 없습니다.'
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                        lineNumber: 32,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx",
        lineNumber: 12,
        columnNumber: 9
    }, this);
}
}),
"[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionsContainer": "MenuActions-module__RK844a__actionsContainer",
  "deleteButton": "MenuActions-module__RK844a__deleteButton",
  "editButton": "MenuActions-module__RK844a__editButton",
});
}),
"[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenuActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.module.css [app-ssr] (css module)");
'use client';
;
;
function MenuActions() {
    // const handleDelete = () => {
    //     if (confirm('정말 삭제하시겠습니까?')) {
    //         onDelete();
    //     }
    // };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].actionsContainer
    }, void 0, false, {
        fileName: "[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx",
        lineNumber: 20,
        columnNumber: 9
    }, this);
}
}),
"[project]/app/admin/menus/[id]/_components/MenuDetailClient.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "MenuDetailClient-module__RAiuYW__container",
  "content": "MenuDetailClient-module__RAiuYW__content",
  "errorMessage": "MenuDetailClient-module__RAiuYW__errorMessage",
  "errorWrapper": "MenuDetailClient-module__RAiuYW__errorWrapper",
  "loadingWrapper": "MenuDetailClient-module__RAiuYW__loadingWrapper",
  "rightSection": "MenuDetailClient-module__RAiuYW__rightSection",
  "spin": "MenuDetailClient-module__RAiuYW__spin",
  "spinner": "MenuDetailClient-module__RAiuYW__spinner",
});
}),
"[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenuDetailClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$DetailHeader$2f$DetailHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/DetailHeader/DetailHeader.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/ImageGallery/ImageGallery.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/BasicInfo/BasicInfo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/MenuActions/MenuActions.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/[id]/_components/MenuDetailClient.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function MenuDetailClient(params) {
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(params);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$DetailHeader$2f$DetailHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: "메뉴 상세"
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$ImageGallery$2f$ImageGallery$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 23,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuDetailClient$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].rightSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$BasicInfo$2f$BasicInfo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                id: id
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 28,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f5b$id$5d2f$_components$2f$MenuActions$2f$MenuActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                                lineNumber: 33,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
                lineNumber: 21,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/[id]/_components/MenuDetailClient.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=app_admin_menus_%5Bid%5D__components_246eb8b8._.js.map