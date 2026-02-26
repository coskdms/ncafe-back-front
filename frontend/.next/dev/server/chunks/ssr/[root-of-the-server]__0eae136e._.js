module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/stores/authStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set)=>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
        // ============================
        // 로그인: Spring Security의 POST /login 으로 폼 데이터 전송
        // ============================
        login: async (nickname, password)=>{
            const formData = new URLSearchParams();
            formData.append('username', nickname);
            formData.append('password', password);
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            });
            if (!res.ok) {
                throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
            }
            // 로그인 성공 후 사용자 정보를 서버에서 가져옴
            const meRes = await fetch('/api/auth/me');
            if (meRes.ok) {
                const userData = await meRes.json();
                set({
                    user: userData,
                    isAuthenticated: true,
                    isLoading: false
                });
            }
        },
        // ============================
        // 로그아웃: Spring Security의 POST /logout 으로 요청
        // ============================
        logout: async ()=>{
            await fetch('/api/logout', {
                method: 'POST'
            });
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        },
        // ============================
        // 세션 확인: 페이지 새로고침 시 서버에 현재 세션이 유효한지 확인
        // ============================
        checkAuth: async ()=>{
            set({
                isLoading: true
            });
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const userData = await res.json();
                    set({
                        user: userData,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } else {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false
                    });
                }
            } catch  {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        }
    }));
}),
"[project]/components/landing/Navbar.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "desktopLinks": "Navbar-module__ALGTZa__desktopLinks",
  "hamburger": "Navbar-module__ALGTZa__hamburger",
  "inner": "Navbar-module__ALGTZa__inner",
  "loginBtn": "Navbar-module__ALGTZa__loginBtn",
  "logo": "Navbar-module__ALGTZa__logo",
  "logoutBtn": "Navbar-module__ALGTZa__logoutBtn",
  "mobileLoginBtn": "Navbar-module__ALGTZa__mobileLoginBtn",
  "mobileMenu": "Navbar-module__ALGTZa__mobileMenu",
  "mobileUserName": "Navbar-module__ALGTZa__mobileUserName",
  "nav": "Navbar-module__ALGTZa__nav",
  "scrolled": "Navbar-module__ALGTZa__scrolled",
  "userName": "Navbar-module__ALGTZa__userName",
});
}),
"[project]/components/landing/Navbar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stores/authStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/landing/Navbar.module.css [app-ssr] (css module)");
'use client';
;
;
;
;
;
;
function Navbar() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Zustand 스토어에서 인증 상태를 가져옵니다.
    const { user, isAuthenticated, isLoading, checkAuth, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    // 컴포넌트가 처음 로드될 때 서버에 세션 유효 여부를 확인합니다.
    // (페이지 새로고침 후에도 로그인 상태를 복구하기 위함)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        checkAuth();
    }, [
        checkAuth
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleScroll = ()=>setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return ()=>window.removeEventListener('scroll', handleScroll);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return ()=>{
            document.body.style.overflow = '';
        };
    }, [
        isOpen
    ]);
    const handleLogout = async ()=>{
        await logout();
        setIsOpen(false);
        window.location.href = '/';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].nav} ${scrolled ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].scrolled : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].inner,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].logo,
                        children: "🐤 고라파덕 카페"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].desktopLinks,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/#about",
                                children: "카페 소개"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/Navbar.tsx",
                                lineNumber: 45,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/menus",
                                children: "특별 메뉴"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/Navbar.tsx",
                                lineNumber: 46,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/#location",
                                children: "매장 안내"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/Navbar.tsx",
                                lineNumber: 47,
                                columnNumber: 21
                            }, this),
                            !isLoading && (isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].userName,
                                        children: [
                                            "👋 ",
                                            user?.username,
                                            "님"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/landing/Navbar.tsx",
                                        lineNumber: 51,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].logoutBtn,
                                        children: "로그아웃"
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/Navbar.tsx",
                                        lineNumber: 52,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].loginBtn,
                                children: "로그인"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/Navbar.tsx",
                                lineNumber: 55,
                                columnNumber: 29
                            }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 44,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].hamburger,
                        onClick: ()=>setIsOpen(!isOpen),
                        "aria-label": "메뉴",
                        children: isOpen ? '✕' : '☰'
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 59,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/Navbar.tsx",
                lineNumber: 42,
                columnNumber: 13
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mobileMenu,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/#about",
                        onClick: ()=>setIsOpen(false),
                        children: "카페 소개"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 65,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/menus",
                        onClick: ()=>setIsOpen(false),
                        children: "특별 메뉴"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 66,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/#location",
                        onClick: ()=>setIsOpen(false),
                        children: "매장 안내"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 67,
                        columnNumber: 21
                    }, this),
                    !isLoading && (isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mobileUserName,
                                children: [
                                    "👋 ",
                                    user?.username,
                                    "님"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/landing/Navbar.tsx",
                                lineNumber: 71,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mobileLoginBtn,
                                children: "로그아웃"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/Navbar.tsx",
                                lineNumber: 72,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/login",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mobileLoginBtn,
                        onClick: ()=>setIsOpen(false),
                        children: "로그인"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/Navbar.tsx",
                        lineNumber: 75,
                        columnNumber: 29
                    }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/Navbar.tsx",
                lineNumber: 64,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/Navbar.tsx",
        lineNumber: 41,
        columnNumber: 9
    }, this);
}
}),
"[project]/components/landing/FallingBeans.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "canvas": "FallingBeans-module__QDH_zW__canvas",
});
}),
"[project]/components/landing/FallingBeans.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FallingBeans
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$FallingBeans$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/landing/FallingBeans.module.css [app-ssr] (css module)");
'use client';
;
;
;
const EMOJIS = [
    '⭐',
    '💛',
    '☕',
    '🐤',
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
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const itemsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const spritesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const animationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        spritesRef.current = createSprites();
        const resize = ()=>{
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        const createItem = (randomY = false)=>({
                x: Math.random() * canvas.width,
                y: randomY ? Math.random() * canvas.height : -50 - Math.random() * 100,
                spriteIdx: Math.floor(Math.random() * spritesRef.current.length),
                rotation: (Math.random() - 0.5) * 0.6,
                rotationSpeed: (Math.random() - 0.5) * 0.008,
                speed: Math.random() * 0.5 + 0.15,
                wobbleOffset: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.01 + 0.003,
                opacity: Math.random() * 0.3 + 0.12
            });
        for(let i = 0; i < 12; i++){
            itemsRef.current.push(createItem(true));
        }
        const animate = ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            itemsRef.current.forEach((item)=>{
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
            });
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
        return ()=>{
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$FallingBeans$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].canvas
    }, void 0, false, {
        fileName: "[project]/components/landing/FallingBeans.tsx",
        lineNumber: 105,
        columnNumber: 12
    }, this);
}
}),
"[project]/components/landing/CursorBeans.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "canvas": "CursorBeans-module__nJmsGW__canvas",
});
}),
"[project]/components/landing/CursorBeans.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CursorBeans
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$CursorBeans$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/landing/CursorBeans.module.css [app-ssr] (css module)");
'use client';
;
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
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const beansRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const spritesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const mouseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: -100,
        y: -100
    });
    const lastSpawnRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const animationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        spritesRef.current = createSprites();
        const resize = ()=>{
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        const handleMove = (e)=>{
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };
        window.addEventListener('mousemove', handleMove);
        const spawnBean = ()=>{
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
        };
        const animate = ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const now = Date.now();
            if (now - lastSpawnRef.current > 400) {
                spawnBean();
                lastSpawnRef.current = now;
            }
            beansRef.current.forEach((bean)=>{
                bean.x += bean.velocityX;
                bean.y += bean.velocityY;
                bean.rotation += bean.rotationSpeed;
                bean.life -= 0.018;
                bean.opacity = Math.max(0, bean.life * 0.85);
            });
            beansRef.current = beansRef.current.filter((b)=>b.life > 0);
            beansRef.current.forEach((bean)=>{
                const sprite = spritesRef.current[bean.spriteIdx];
                ctx.save();
                ctx.translate(bean.x, bean.y);
                ctx.rotate(bean.rotation);
                ctx.globalAlpha = bean.opacity;
                ctx.drawImage(sprite, -16, -16);
                ctx.restore();
            });
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
        return ()=>{
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$CursorBeans$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].canvas
    }, void 0, false, {
        fileName: "[project]/components/landing/CursorBeans.tsx",
        lineNumber: 122,
        columnNumber: 12
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0eae136e._.js.map