(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/app/admin/menus/_components/MenuCard/MenuCard.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionButton": "MenuCard-module__dATFjW__actionButton",
  "actions": "MenuCard-module__dATFjW__actions",
  "card": "MenuCard-module__dATFjW__card",
  "category": "MenuCard-module__dATFjW__category",
  "content": "MenuCard-module__dATFjW__content",
  "danger": "MenuCard-module__dATFjW__danger",
  "dragHandle": "MenuCard-module__dATFjW__dragHandle",
  "engName": "MenuCard-module__dATFjW__engName",
  "footer": "MenuCard-module__dATFjW__footer",
  "header": "MenuCard-module__dATFjW__header",
  "image": "MenuCard-module__dATFjW__image",
  "imageWrapper": "MenuCard-module__dATFjW__imageWrapper",
  "isDragging": "MenuCard-module__dATFjW__isDragging",
  "name": "MenuCard-module__dATFjW__name",
  "placeholder": "MenuCard-module__dATFjW__placeholder",
  "price": "MenuCard-module__dATFjW__price",
  "soldOutBadge": "MenuCard-module__dATFjW__soldOutBadge",
  "toggle": "MenuCard-module__dATFjW__toggle",
  "toggleLabel": "MenuCard-module__dATFjW__toggleLabel",
  "toggleSlider": "MenuCard-module__dATFjW__toggleSlider",
});
}),
"[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenuCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coffee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coffee$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/coffee.js [app-client] (ecmascript) <export default as Coffee>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/utilities/dist/utilities.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/MenuCard/MenuCard.module.css [app-client] (css module)");
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
function MenuCard({ menu, onToggleSoldOut, onDelete, dragEnabled = true }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"])({
        id: menu.id
    });
    const style = {
        transform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSS"].Transform.toString(transform),
        transition
    };
    // price 포맷팅
    const formatPrice = (price)=>{
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('ko-KR').format(numPrice);
    };
    const handleCardClick = ()=>{
        if (!isDragging) {
            router.push(`/admin/menus/${menu.id}`);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card} ${isDragging ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].isDragging : ''}`,
        ref: setNodeRef,
        style: style,
        onClick: handleCardClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageWrapper,
                children: [
                    dragEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dragHandle,
                        ...attributes,
                        ...listeners,
                        "aria-label": "Drag to reorder",
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                            lineNumber: 63,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                        lineNumber: 56,
                        columnNumber: 21
                    }, this),
                    menu.imagesSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: `http://localhost:8080/${menu.imagesSrc}`,
                        alt: menu.korName,
                        fill: true,
                        sizes: "(max-width: 768px) 100vw, 300px",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].image
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                        lineNumber: 69,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].placeholder,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coffee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coffee$3e$__["Coffee"], {
                            size: 48
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                            lineNumber: 78,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                        lineNumber: 77,
                        columnNumber: 21
                    }, this),
                    !menu.isAvailable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].soldOutBadge,
                        children: "품절"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                        lineNumber: 83,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                lineNumber: 54,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].name,
                                    children: menu.korName
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                    lineNumber: 90,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].engName,
                                    children: menu.engName
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                    lineNumber: 91,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                            lineNumber: 89,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                        lineNumber: 88,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                        children: [
                            "₩",
                            formatPrice(menu.price)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                        lineNumber: 96,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].footer,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toggle,
                                onClick: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: !menu.isAvailable,
                                        onChange: ()=>onToggleSoldOut(menu.id)
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                        lineNumber: 103,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toggleSlider
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                        lineNumber: 108,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toggleLabel,
                                        children: "품절"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                        lineNumber: 109,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                lineNumber: 99,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actions,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/admin/menus/${menu.id}/edit`,
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actionButton,
                                        onClick: (e)=>e.stopPropagation(),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                            lineNumber: 118,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                        lineNumber: 113,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actionButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].danger}`,
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onDelete(menu.id);
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                            lineNumber: 127,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                        lineNumber: 120,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                                lineNumber: 112,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                        lineNumber: 98,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
                lineNumber: 87,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx",
        lineNumber: 48,
        columnNumber: 9
    }, this);
}
_s(MenuCard, "8LaCgMbE+micCP4YWupAwk7OgCs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"]
    ];
});
_c = MenuCard;
var _c;
__turbopack_context__.k.register(_c, "MenuCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/_components/MenuCard/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/_components/MenuList/MenuList.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "MenuList-module__JmH2Ia__active",
  "ellipsis": "MenuList-module__JmH2Ia__ellipsis",
  "empty": "MenuList-module__JmH2Ia__empty",
  "menuGrid": "MenuList-module__JmH2Ia__menuGrid",
  "pageButton": "MenuList-module__JmH2Ia__pageButton",
  "pageInfo": "MenuList-module__JmH2Ia__pageInfo",
  "pagination": "MenuList-module__JmH2Ia__pagination",
});
}),
"[project]/app/admin/menus/_components/MenuList/useMenus.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMenus",
    ()=>useMenus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useMenus(params) {
    _s();
    const { categoryId, searchQuery } = params || {};
    const [menus, setMenus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [totalCount, setTotalCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchMenus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMenus.useCallback[fetchMenus]": async ()=>{
            try {
                setLoading(true);
                setError(null);
                const url = new URL("http://localhost:8080/admin/menus");
                if (categoryId) {
                    url.searchParams.append('categoryId', categoryId.toString());
                }
                if (searchQuery && searchQuery.trim()) {
                    url.searchParams.append('searchQuery', searchQuery.trim());
                }
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('메뉴 데이터를 불러오는데 실패했습니다.');
                }
                // 백엔드 응답: { menus: [], totalCount: 100 }
                const data = await response.json();
                setMenus(data.menus);
                setTotalCount(data.totalCount);
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            } finally{
                setLoading(false);
            }
        }
    }["useMenus.useCallback[fetchMenus]"], [
        categoryId,
        searchQuery
    ]);
    // categoryId, searchQuery가 변경될 때마다 fetch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMenus.useEffect": ()=>{
            fetchMenus();
        }
    }["useMenus.useEffect"], [
        fetchMenus
    ]);
    return {
        menus,
        setMenus,
        totalCount,
        loading,
        error,
        refetch: fetchMenus
    };
}
_s(useMenus, "XehWvdJw4psWfLQkRi2NdjMTXX4=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/_components/MenuList/MenuList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenuList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/common/Button/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/MenuCard/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/MenuCard/MenuCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/MenuList/MenuList.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$useMenus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/MenuList/useMenus.ts [app-client] (ecmascript)");
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
const ITEMS_PER_PAGE = 8; // 페이지당 메뉴 개수
function MenuList({ selectedCategory, searchQuery }) {
    _s();
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    // params 객체로 전달 (선택되지 않은 경우 null)
    const menuListParams = {
        categoryId: selectedCategory,
        searchQuery: searchQuery || null
    };
    // 커스텀 훅으로 메뉴 데이터 관리
    const { menus, setMenus, totalCount, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$useMenus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenus"])(menuListParams);
    // selectedCategory가 변경될 때 페이지 초기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuList.useEffect": ()=>{
            setCurrentPage(1);
        }
    }["MenuList.useEffect"], [
        selectedCategory
    ]);
    // 검색어 변경 시 페이지 초기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuList.useEffect": ()=>{
            setCurrentPage(1);
        }
    }["MenuList.useEffect"], [
        searchQuery
    ]);
    // 페이지네이션 계산
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const paginatedMenus = (()=>{
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return menus.slice(startIndex, endIndex);
    })();
    // 페이지 번호 배열 생성 (최대 5개 표시)
    const getPageNumbers = ()=>{
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for(let i = 1; i <= totalPages; i++){
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for(let i = 1; i <= 4; i++){
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for(let i = totalPages - 3; i <= totalPages; i++){
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for(let i = currentPage - 1; i <= currentPage + 1; i++){
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }
        return pages;
    };
    // 품절 토글 (isAvailable 사용)
    const handleToggleSoldOut = async (id)=>{
        const menu = menus.find((m)=>m.id === id);
        if (menu) {
            // TODO: 백엔드 API 호출하여 품절 상태 업데이트
            setMenus((prev)=>prev.map((m)=>m.id === id ? {
                        ...m,
                        isAvailable: !m.isAvailable
                    } : m));
        }
    };
    // 메뉴 삭제
    const handleDelete = async (id)=>{
        if (confirm('정말 이 메뉴를 삭제하시겠습니까?')) {
            // TODO: 백엔드 API 호출하여 메뉴 삭제
            setMenus((prev)=>prev.filter((m)=>m.id !== id));
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "메뉴를 불러오는 중..."
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                lineNumber: 105,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
            lineNumber: 104,
            columnNumber: 13
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                    lineNumber: 113,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    variant: "outline",
                    onClick: refetch,
                    children: "다시 시도"
                }, void 0, false, {
                    fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                    lineNumber: 114,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
            lineNumber: 112,
            columnNumber: 13
        }, this);
    }
    if (menus.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "등록된 메뉴가 없습니다."
                }, void 0, false, {
                    fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                    lineNumber: 122,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/admin/menus/new",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: "outline",
                        children: "첫 메뉴 추가하기"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                        lineNumber: 124,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                    lineNumber: 123,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
            lineNumber: 121,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].menuGrid,
                children: paginatedMenus.map((menu)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuCard$2f$MenuCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        menu: menu,
                        onToggleSoldOut: handleToggleSoldOut,
                        onDelete: handleDelete
                    }, menu.id, false, {
                        fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                        lineNumber: 136,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                lineNumber: 134,
                columnNumber: 13
            }, this),
            totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pagination,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pageButton,
                        onClick: ()=>setCurrentPage((prev)=>Math.max(prev - 1, 1)),
                        disabled: currentPage === 1,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                            lineNumber: 153,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                        lineNumber: 148,
                        columnNumber: 21
                    }, this),
                    getPageNumbers().map((page, index)=>page === 'ellipsis' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].ellipsis,
                            children: "..."
                        }, `ellipsis-${index}`, false, {
                            fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                            lineNumber: 158,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pageButton} ${currentPage === page ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ''}`,
                            onClick: ()=>setCurrentPage(page),
                            children: page
                        }, page, false, {
                            fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                            lineNumber: 160,
                            columnNumber: 29
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pageButton,
                        onClick: ()=>setCurrentPage((prev)=>Math.min(prev + 1, totalPages)),
                        disabled: currentPage === totalPages,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                            lineNumber: 175,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                        lineNumber: 170,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pageInfo,
                        children: [
                            totalCount,
                            "개 중 ",
                            (currentPage - 1) * ITEMS_PER_PAGE + 1,
                            "-",
                            Math.min(currentPage * ITEMS_PER_PAGE, totalCount)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                        lineNumber: 178,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/_components/MenuList/MenuList.tsx",
                lineNumber: 147,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true);
}
_s(MenuList, "wVtjvFZdw3DjQSln1U+sTPGVG8I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$useMenus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenus"]
    ];
});
_c = MenuList;
var _c;
__turbopack_context__.k.register(_c, "MenuList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "MenuActionBar-module__hjRjEG__container",
  "leftGroup": "MenuActionBar-module__hjRjEG__leftGroup",
  "menuCount": "MenuActionBar-module__hjRjEG__menuCount",
  "searchIcon": "MenuActionBar-module__hjRjEG__searchIcon",
  "searchInput": "MenuActionBar-module__hjRjEG__searchInput",
  "searchWrapper": "MenuActionBar-module__hjRjEG__searchWrapper",
});
}),
"[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenuActionBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/common/Button/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/Button/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuActionBar$2f$MenuActionBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function MenuActionBar({ searchQuery, setSearchQuery }) {
    _s();
    // const [searchQuery, setSearchQuery] = useState('');
    const [totalCount, setTotalCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuActionBar$2f$MenuActionBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
        "aria-label": "메뉴 관리 도구",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuActionBar$2f$MenuActionBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].leftGroup,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuActionBar$2f$MenuActionBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchWrapper,
                        role: "search",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                size: 20,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuActionBar$2f$MenuActionBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchIcon
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
                                lineNumber: 18,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "search",
                                placeholder: "메뉴 검색...",
                                value: searchQuery,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuActionBar$2f$MenuActionBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchInput,
                                onChange: (e)=>setSearchQuery(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
                                lineNumber: 19,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
                        lineNumber: 17,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuActionBar$2f$MenuActionBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].menuCount,
                        children: [
                            "총 ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: totalCount
                            }, void 0, false, {
                                fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
                                lineNumber: 28,
                                columnNumber: 23
                            }, this),
                            "개의 메뉴"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
                lineNumber: 16,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/admin/menus/new",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
                            lineNumber: 34,
                            columnNumber: 21
                        }, this),
                        "새 메뉴 추가"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
                    lineNumber: 33,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
                lineNumber: 32,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx",
        lineNumber: 14,
        columnNumber: 9
    }, this);
}
_s(MenuActionBar, "pKWEm/NZMzUwR6gPEi4wDTOoraM=");
_c = MenuActionBar;
var _c;
__turbopack_context__.k.register(_c, "MenuActionBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/MenuList/MenuList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuActionBar$2f$MenuActionBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/menus/_components/MenuActionBar/MenuActionBar.tsx [app-client] (ecmascript)");
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuActionBar$2f$MenuActionBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$menus$2f$_components$2f$MenuList$2f$MenuList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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

//# sourceMappingURL=_1f7c8d3f._.js.map