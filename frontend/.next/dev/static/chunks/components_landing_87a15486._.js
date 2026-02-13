(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/landing/Navbar.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "desktopLinks": "Navbar-module__ALGTZa__desktopLinks",
  "hamburger": "Navbar-module__ALGTZa__hamburger",
  "inner": "Navbar-module__ALGTZa__inner",
  "logo": "Navbar-module__ALGTZa__logo",
  "mobileMenu": "Navbar-module__ALGTZa__mobileMenu",
  "nav": "Navbar-module__ALGTZa__nav",
  "scrolled": "Navbar-module__ALGTZa__scrolled",
});
}),
"[project]/components/landing/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/landing/Navbar.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Navbar() {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const handleScroll = {
                "Navbar.useEffect.handleScroll": ()=>setScrolled(window.scrollY > 50)
            }["Navbar.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll);
            return ({
                "Navbar.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            document.body.style.overflow = isOpen ? 'hidden' : '';
            return ({
                "Navbar.useEffect": ()=>{
                    document.body.style.overflow = '';
                }
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], [
        isOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].nav} ${scrolled ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].scrolled : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].inner,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logo,
                        children: "🦆 고라파덕 카페"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 25,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].desktopLinks,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "#about",
                                children: "카페 소개"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/Navbar.tsx",
                                lineNumber: 27,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "#menu",
                                children: "특별 메뉴"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/Navbar.tsx",
                                lineNumber: 28,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "#",
                                children: "매장 안내"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/Navbar.tsx",
                                lineNumber: 29,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 26,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hamburger,
                        onClick: ()=>setIsOpen(!isOpen),
                        "aria-label": "메뉴",
                        children: isOpen ? '✕' : '☰'
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 31,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/Navbar.tsx",
                lineNumber: 24,
                columnNumber: 13
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileMenu,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "#about",
                        onClick: ()=>setIsOpen(false),
                        children: "카페 소개"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 37,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "#menu",
                        onClick: ()=>setIsOpen(false),
                        children: "특별 메뉴"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 38,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "#",
                        onClick: ()=>setIsOpen(false),
                        children: "매장 안내"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 39,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/Navbar.tsx",
                lineNumber: 36,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/Navbar.tsx",
        lineNumber: 23,
        columnNumber: 9
    }, this);
}
_s(Navbar, "QvXge5InenJxnKBGF8yFZH0QPpw=");
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/landing/FallingBeans.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "canvas": "FallingBeans-module__QDH_zW__canvas",
});
}),
"[project]/components/landing/FallingBeans.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FallingBeans
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$FallingBeans$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/landing/FallingBeans.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const EMOJIS = [
    '⭐',
    '💛',
    '☕',
    '🦆',
    '⭐',
    '💛'
];
function createSprites() {
    return EMOJIS.map((emoji)=>{
        const c = document.createElement('canvas');
        c.width = 36;
        c.height = 36;
        const cx = c.getContext('2d');
        cx.font = '26px serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText(emoji, 18, 20);
        return c;
    });
}
function FallingBeans() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const itemsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const spritesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const animationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FallingBeans.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            spritesRef.current = createSprites();
            const resize = {
                "FallingBeans.useEffect.resize": ()=>{
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }["FallingBeans.useEffect.resize"];
            resize();
            window.addEventListener('resize', resize);
            const createItem = {
                "FallingBeans.useEffect.createItem": (randomY = false)=>({
                        x: Math.random() * canvas.width,
                        y: randomY ? Math.random() * canvas.height : -50 - Math.random() * 100,
                        spriteIdx: Math.floor(Math.random() * spritesRef.current.length),
                        rotation: (Math.random() - 0.5) * 0.6,
                        rotationSpeed: (Math.random() - 0.5) * 0.008,
                        speed: Math.random() * 0.5 + 0.15,
                        wobbleOffset: Math.random() * Math.PI * 2,
                        wobbleSpeed: Math.random() * 0.01 + 0.003,
                        opacity: Math.random() * 0.3 + 0.12
                    })
            }["FallingBeans.useEffect.createItem"];
            for(let i = 0; i < 12; i++){
                itemsRef.current.push(createItem(true));
            }
            const animate = {
                "FallingBeans.useEffect.animate": ()=>{
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    itemsRef.current.forEach({
                        "FallingBeans.useEffect.animate": (item)=>{
                            item.y += item.speed;
                            item.rotation += item.rotationSpeed;
                            item.wobbleOffset += item.wobbleSpeed;
                            item.x += Math.sin(item.wobbleOffset) * 0.3;
                            if (item.y > canvas.height + 50) {
                                item.y = -50;
                                item.x = Math.random() * canvas.width;
                            }
                            const sprite = spritesRef.current[item.spriteIdx];
                            ctx.save();
                            ctx.translate(item.x, item.y);
                            ctx.rotate(item.rotation);
                            ctx.globalAlpha = item.opacity;
                            ctx.drawImage(sprite, -18, -18);
                            ctx.restore();
                        }
                    }["FallingBeans.useEffect.animate"]);
                    animationRef.current = requestAnimationFrame(animate);
                }
            }["FallingBeans.useEffect.animate"];
            animate();
            return ({
                "FallingBeans.useEffect": ()=>{
                    window.removeEventListener('resize', resize);
                    cancelAnimationFrame(animationRef.current);
                }
            })["FallingBeans.useEffect"];
        }
    }["FallingBeans.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$FallingBeans$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].canvas
    }, void 0, false, {
        fileName: "[project]/components/landing/FallingBeans.tsx",
        lineNumber: 105,
        columnNumber: 12
    }, this);
}
_s(FallingBeans, "WYTdtIDl03t+Kf2/9uM0tP77Tvw=");
_c = FallingBeans;
var _c;
__turbopack_context__.k.register(_c, "FallingBeans");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/landing/CursorBeans.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "canvas": "CursorBeans-module__nJmsGW__canvas",
});
}),
"[project]/components/landing/CursorBeans.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CursorBeans
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$CursorBeans$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/landing/CursorBeans.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const EMOJIS = [
    '🍰',
    '☕',
    '🍰',
    '☕'
];
function createSprites() {
    return EMOJIS.map((emoji)=>{
        const c = document.createElement('canvas');
        c.width = 32;
        c.height = 32;
        const cx = c.getContext('2d');
        cx.font = '22px serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText(emoji, 16, 18);
        return c;
    });
}
function CursorBeans() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const beansRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const spritesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const mouseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: -100,
        y: -100
    });
    const lastSpawnRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const animationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CursorBeans.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            spritesRef.current = createSprites();
            const resize = {
                "CursorBeans.useEffect.resize": ()=>{
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }["CursorBeans.useEffect.resize"];
            resize();
            window.addEventListener('resize', resize);
            const handleMove = {
                "CursorBeans.useEffect.handleMove": (e)=>{
                    mouseRef.current = {
                        x: e.clientX,
                        y: e.clientY
                    };
                }
            }["CursorBeans.useEffect.handleMove"];
            window.addEventListener('mousemove', handleMove);
            const spawnBean = {
                "CursorBeans.useEffect.spawnBean": ()=>{
                    const { x, y } = mouseRef.current;
                    if (x < 0) return;
                    if (beansRef.current.length > 6) return;
                    beansRef.current.push({
                        x,
                        y,
                        spriteIdx: Math.floor(Math.random() * spritesRef.current.length),
                        rotation: (Math.random() - 0.5) * 0.8,
                        rotationSpeed: (Math.random() - 0.5) * 0.05,
                        opacity: 0.85,
                        velocityX: (Math.random() - 0.5) * 1.5,
                        velocityY: Math.random() * 1.2 + 0.4,
                        life: 1
                    });
                }
            }["CursorBeans.useEffect.spawnBean"];
            const animate = {
                "CursorBeans.useEffect.animate": ()=>{
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const now = Date.now();
                    if (now - lastSpawnRef.current > 400) {
                        spawnBean();
                        lastSpawnRef.current = now;
                    }
                    beansRef.current.forEach({
                        "CursorBeans.useEffect.animate": (bean)=>{
                            bean.x += bean.velocityX;
                            bean.y += bean.velocityY;
                            bean.rotation += bean.rotationSpeed;
                            bean.life -= 0.018;
                            bean.opacity = Math.max(0, bean.life * 0.85);
                        }
                    }["CursorBeans.useEffect.animate"]);
                    beansRef.current = beansRef.current.filter({
                        "CursorBeans.useEffect.animate": (b)=>b.life > 0
                    }["CursorBeans.useEffect.animate"]);
                    beansRef.current.forEach({
                        "CursorBeans.useEffect.animate": (bean)=>{
                            const sprite = spritesRef.current[bean.spriteIdx];
                            ctx.save();
                            ctx.translate(bean.x, bean.y);
                            ctx.rotate(bean.rotation);
                            ctx.globalAlpha = bean.opacity;
                            ctx.drawImage(sprite, -16, -16);
                            ctx.restore();
                        }
                    }["CursorBeans.useEffect.animate"]);
                    animationRef.current = requestAnimationFrame(animate);
                }
            }["CursorBeans.useEffect.animate"];
            animate();
            return ({
                "CursorBeans.useEffect": ()=>{
                    window.removeEventListener('resize', resize);
                    window.removeEventListener('mousemove', handleMove);
                    cancelAnimationFrame(animationRef.current);
                }
            })["CursorBeans.useEffect"];
        }
    }["CursorBeans.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$CursorBeans$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].canvas
    }, void 0, false, {
        fileName: "[project]/components/landing/CursorBeans.tsx",
        lineNumber: 122,
        columnNumber: 12
    }, this);
}
_s(CursorBeans, "0q6LMc4Trg3yrDX1AtoQqgeDcaU=");
_c = CursorBeans;
var _c;
__turbopack_context__.k.register(_c, "CursorBeans");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_landing_87a15486._.js.map