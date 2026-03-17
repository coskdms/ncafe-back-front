'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultOptions } from '@/app/lib/menuOptions';
import styles from './AgentChat.module.css';

// 고라파덕 아이콘 경로
const DUCK_ICON = '/images/gorapaduck-icon.png';

// ===== 2. 타입 정의 =====
interface ChatMessage {
    id: number;
    text: string;
    sender: 'bot' | 'user';
}

interface OptionDetail {
    id?: number;
    name: string;
    additionalPrice: number;
    sortOrder: number;
}

interface OptionGroup {
    id?: number;
    name: string;
    isRequired: boolean;
    isMultiple: boolean;
    sortOrder: number;
    optionDetails: OptionDetail[];
}

interface OptionModalData {
    menuId: number;
    korName: string;
    price: number;
    imageSrc: string;
    optionGroups: OptionGroup[];
    mode: 'cart' | 'direct_order';
}

// ===== 3. 유틸리티 함수 =====
const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '';
    return price.toLocaleString('ko-KR') + '원';
};


// ===== 4. React 컴포넌트 =====
export default function AgentChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [quickReplies, setQuickReplies] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastAddedMenu, setLastAddedMenu] = useState<any>(null);

    // 옵션 선택 모달
    const [optionModal, setOptionModal] = useState<OptionModalData | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

    const addItem = useCartStore((state) => state.addItem);
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const bodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);
    let msgIdCounter = useRef(0);

    // 음성 인식 상태
    const [isListening, setIsListening] = useState(false);


    /**
     * 메시지 텍스트 내의 특수 마커(::menu{...}::)를 찾아 
     * 텍스트와 메뉴 카드를 분리하여 렌더링합니다.
     */
    const renderMessageContent = (text: string) => {
        // ::menu, ::action, ::growth 마커를 모두 찾아서 나눔
        const parts = text.split(/(::menu\{.*?\}::|::action\{.*?\}::|::growth\{.*?\}::)/g);

        return parts.map((part, index) => {
            // 메뉴 마커 처리
            if (part.startsWith('::menu{') && part.endsWith('}::')) {
                try {
                    const jsonStr = part.slice(6, -2);
                    const menu = JSON.parse(jsonStr);

                    // 이미지 노출 여부 확인
                    const showImage = !menu.noImage;
                    const firstImage = menu.imagesSrc
                        ? menu.imagesSrc.split(',')[0].trim()
                        : (menu.image || 'blank.png');

                    const handleCartClick = async (e: React.MouseEvent) => {
                        e.preventDefault();
                        // 옵션이 있는 메뉴인지 확인
                        try {
                            const res = await fetch(`/api/menus/${menu.id}`);
                            if (res.ok) {
                                const detail = await res.json();
                                if (detail.optionGroups && detail.optionGroups.length > 0) {
                                    setOptionModal({
                                        menuId: menu.id,
                                        korName: menu.korName || menu.name,
                                        price: menu.price,
                                        imageSrc: firstImage,
                                        optionGroups: detail.optionGroups,
                                        mode: 'cart'
                                    });
                                    setSelectedOptions({});
                                    return;
                                }
                            }
                        } catch (err) {
                            console.error('Menu detail fetch failed:', err);
                        }
                        // 옵션 없으면 바로 담기
                        await addItem({
                            menuId: menu.id,
                            korName: menu.korName || menu.name,
                            price: menu.price,
                            imageSrc: firstImage
                        });
                        setLastAddedMenu(menu);
                        setIsModalOpen(true);
                    };

                    return (
                        <div key={index} className={`${styles.menuCard} ${showImage ? '' : styles.menuCardNoImage}`}>
                            {showImage && (
                                <img
                                    src={`/images/${firstImage}`}
                                    alt={menu.korName || menu.name}
                                    className={styles.menuCardImage}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/blank.png';
                                    }}
                                />
                            )}
                            <div className={styles.menuCardContent}>
                                <div className={styles.menuInfoText}>
                                    <span className={styles.menuCardName}>{menu.korName || menu.name}</span>
                                    <span className={styles.menuCardPrice}>{formatPrice(menu.price)}</span>
                                </div>
                                <div className={styles.menuCardActions}>
                                    <Link href={`/menus/${menu.id}`} className={styles.menuCardBtn}>
                                        상세보기
                                    </Link>
                                    <button
                                        onClick={handleCartClick}
                                        className={styles.menuCardCartBtn}
                                        title="장바구니 담기"
                                    >
                                        🛒
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                } catch (e) {
                    console.error('Menu JSON parse error:', e);
                    return <span key={index}>{part}</span>;
                }
            }

            // 성장 정보(포인트) 마커 처리
            if (part.startsWith('::growth{') && part.endsWith('}::')) {
                try {
                    const jsonStr = part.slice(8, -2);
                    const growth = JSON.parse(jsonStr);

                    return (
                        <div key={index} className={styles.growthCard}>
                            <div className={styles.growthBadge}>{growth.level}</div>
                            <div className={styles.growthContent}>
                                <div className={styles.growthMain}>
                                    <span className={styles.growthLabel}>보유 포인트</span>
                                    <span className={styles.growthValue}>{growth.points.toLocaleString()}P</span>
                                </div>
                                {growth.nextLevel && (
                                    <div className={styles.growthSub}>
                                        <div className={styles.growthProgress}>
                                            <div className={styles.growthTarget}>다음 등급: {growth.nextLevel}</div>
                                            <div className={styles.growthRemaining}>{growth.remaining.toLocaleString()}P 남음</div>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                } catch (e) {
                    console.error('Growth JSON parse error:', e);
                    return <span key={index}>{part}</span>;
                }
            }

            // 액션 마커 처리 (텍스트 노출 안 함)
            if (part.startsWith('::action{') && part.endsWith('}::')) {
                return null;
            }

            return <span key={index}>{part}</span>;
        });
    };

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 스크롤 하단 고정
    const scrollToBottom = useCallback(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, quickReplies, scrollToBottom]);

    // 채팅창 열기/닫기
    const toggleChat = () => {
        const willOpen = !isOpen;
        setIsOpen(willOpen);

        if (willOpen && isFirstOpen) {
            setIsFirstOpen(false);
            const welcomeId = ++msgIdCounter.current;
            const role = user?.role;

            if (role === 'ADMIN') {
                setMessages([{ id: welcomeId, text: '관리자님 안녕하다덕! 🛡️\n무엇을 도와줄까덕?', sender: 'bot' }]);
                setTimeout(() => {
                    setQuickReplies(['오늘 매출 알려줘', '대기 중 주문 보여줘', '메뉴 목록']);
                }, 400);
            } else if (isAuthenticated) {
                setMessages([{ id: welcomeId, text: '쿠웨에엑! 반갑다덕! 🎉\n무엇을 도와줄까덕?', sender: 'bot' }]);
                setTimeout(() => {
                    setQuickReplies(['메뉴 보여줘', '내 포인트 확인', '주문 내역']);
                }, 400);
            } else {
                setMessages([{ id: welcomeId, text: '쿠웨에엑! 고라파덕 카페에 온 걸 환영한다덕! 🎉\n무엇을 도와줄까덕?', sender: 'bot' }]);
                setTimeout(() => {
                    setQuickReplies(['메뉴 보여줘', '추천해줘', '디저트 뭐 있어?']);
                }, 400);
            }
        }

        if (willOpen) {
            setTimeout(() => inputRef.current?.focus(), 350);
        }
    };

    // 사용자 입력 처리
    // 음성 인식 시작/중지
    const toggleVoice = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            alert('이 브라우저에서는 음성 인식을 지원하지 않습니다. Chrome 또는 Edge를 사용해주세요.');
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.lang = 'ko-KR';
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join('');
            setInputValue(transcript);

            if (event.results[0].isFinal) {
                handleSend(transcript);
                setIsListening(false);
            }
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    const handleSend = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        // 사용자 메시지 추가
        const userId = ++msgIdCounter.current;
        const newUserMsg: ChatMessage = { id: userId, text: trimmed, sender: 'user' };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setQuickReplies([]); // 기존 칩 제거

        // 타이핑 인디케이터 시작
        setIsTyping(true);

        try {
            const apiMessages = [...messages, newUserMsg].map(m => ({
                role: m.sender === 'bot' ? 'model' : 'user',
                content: m.text
            }));

            const res = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: apiMessages,
                    stream: true // 스트리밍 활성화
                })
            });
            
            if (!res.ok) throw new Error('Network response was not ok');
            if (!res.body) throw new Error('No response body');

            const botId = ++msgIdCounter.current;
            let botMessageCreated = false;

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8', { fatal: false });
            let buffer = '';
            let fullText = '';

            // 마커를 제거하고 보이는 텍스트만 추출
            const stripMarkers = (text: string) => text
                .replace(/::\w+\{.*?\}::/g, '')
                .replace(/\n{2,}/g, '\n')
                .trim();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('data: ')) {
                        const dataStr = trimmed.slice(6);
                        if (dataStr === '[DONE]') continue;
                        
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.action === 'navigate' && data.url) {
                                console.log('[AgentChat] ✅ Navigate action received:', data.url);
                                setTimeout(() => {
                                    console.log('[AgentChat] 🚀 Navigating to:', data.url);
                                    router.push(data.url);
                                }, 1500);
                            } else if (data.content) {
                                fullText += data.content;
                                const visibleText = stripMarkers(fullText);
                                
                                if (visibleText && !botMessageCreated) {
                                    // 첫 번째 보이는 텍스트 → 타이핑 끄고 메시지 추가
                                    botMessageCreated = true;
                                    setIsTyping(false);
                                    setMessages(prev => [...prev, { id: botId, text: visibleText, sender: 'bot' }]);
                                } else if (visibleText && botMessageCreated) {
                                    // 실시간 텍스트 업데이트 (마커 제외)
                                    setMessages(prev => 
                                        prev.map(m => m.id === botId ? { ...m, text: visibleText } : m)
                                    );
                                }
                            }
                        } catch (e) {
                            console.debug('Parsing error:', e);
                        }
                    }
                }
            }

            // 스트림 종료 → 전체 텍스트(마커 포함)로 교체하여 카드 렌더링
            setIsTyping(false);
            if (fullText) {
                if (botMessageCreated) {
                    setMessages(prev => 
                        prev.map(m => m.id === botId ? { ...m, text: fullText } : m)
                    );
                } else {
                    setMessages(prev => [...prev, { id: botId, text: fullText, sender: 'bot' }]);
                }
            }

            // --- [액션 실행 로직 - 모든 텍스트가 도착한 후 실행] ---
            // AI가 자체 생성하는 다양한 navigate 형식 대응을 위한 페이지 맵핑
            const PAGE_MAP: Record<string, string> = {
                home: '/', menu_list: '/menus', login: '/login',
                cart: '/cart', mypage: '/mypage', checkout: '/checkout',
            };

            const actionMatches = [...fullText.matchAll(/::action(\{.*?\})::/g)];
            let navigationHandled = false;
            
            for (const actionMatch of actionMatches) {
                try {
                    const action = JSON.parse(actionMatch[1]);
                    console.log('[AgentChat] Executing Action:', action);
                    
                    if (action.type === 'add_to_cart' || action.type === 'direct_order') {
                        // 옵션이 있는 메뉴인지 먼저 확인
                        let hasOptions = false;
                        try {
                            const detailRes = await fetch(`/api/menus/${action.menuId}`);
                            if (detailRes.ok) {
                                const detail = await detailRes.json();
                                if (detail.optionGroups && detail.optionGroups.length > 0) {
                                    hasOptions = true;
                                    setOptionModal({
                                        menuId: action.menuId,
                                        korName: action.korName,
                                        price: action.price,
                                        imageSrc: action.imageSrc || 'blank.png',
                                        optionGroups: detail.optionGroups,
                                        mode: action.type === 'direct_order' ? 'direct_order' : 'cart'
                                    });
                                    setSelectedOptions({});
                                }
                            }
                        } catch (err) {
                            console.error('Menu detail fetch for options failed:', err);
                        }
                        
                        if (!hasOptions && action.type === 'add_to_cart') {
                            await addItem({
                                menuId: action.menuId,
                                korName: action.korName,
                                price: action.price,
                                imageSrc: action.imageSrc || 'blank.png'
                            });
                            setLastAddedMenu(action);
                            setIsModalOpen(true);
                        } else if (!hasOptions && action.type === 'direct_order') {
                            const directItem = {
                                menuId: action.menuId,
                                korName: action.korName,
                                price: action.price,
                                imageSrc: action.imageSrc || 'blank.png',
                                options: {},
                                id: Date.now(),
                                quantity: 1
                            };
                            useCartStore.getState().setCheckoutItems([directItem]);
                            router.push('/checkout');
                        }
                    } else if (action.type === 'order_favorites' && action.items) {
                        // 찜 목록 바로 주문 - 디폴트 옵션 적용
                        const checkoutItems = [];
                        for (let idx = 0; idx < action.items.length; idx++) {
                            const item = action.items[idx];
                            const defaults = await getDefaultOptions(item.menuId);
                            checkoutItems.push({
                                menuId: item.menuId,
                                korName: item.korName,
                                price: item.price + (defaults?.additionalPrice || 0),
                                imageSrc: item.imageSrc || 'blank.png',
                                options: defaults?.options || {},
                                id: Date.now() + idx,
                                quantity: 1
                            });
                        }
                        useCartStore.getState().setCheckoutItems(checkoutItems);
                        setTimeout(() => router.push('/checkout'), 1500);
                        navigationHandled = true;
                    } else if (action.type === 'navigate' && action.url) {
                        // 정상 형식: {"type":"navigate","url":"/login"}
                        console.log('[AgentChat] 🚀 Navigating to:', action.url);
                        // checkout 이동 시 장바구니 아이템을 checkoutItems에 세팅
                        if (action.url === '/checkout') {
                            const cartItems = useCartStore.getState().items;
                            if (cartItems.length > 0) {
                                useCartStore.getState().setCheckoutItems(cartItems);
                            }
                        }
                        setTimeout(() => router.push(action.url), 1500);
                        navigationHandled = true;
                    } else if (action.type === 'navigate_to_page' || action.type === 'navigate' || action.page) {
                        // AI 자체 생성 형식: {"type":"navigate_to_page","page":"login"} 등
                        const pageKey = action.page || action.target || '';
                        const url = PAGE_MAP[pageKey] || action.url;
                        if (url) {
                            console.log('[AgentChat] 🚀 Navigating (AI format) to:', url);
                            // checkout 이동 시 장바구니 아이템을 checkoutItems에 세팅
                            if (url === '/checkout' || pageKey === 'checkout') {
                                const cartItems = useCartStore.getState().items;
                                if (cartItems.length > 0) {
                                    useCartStore.getState().setCheckoutItems(cartItems);
                                }
                            }
                            setTimeout(() => router.push(url), 1500);
                            navigationHandled = true;
                        }
                    } else if (action.type === 'view_menu_detail' && action.menu_id) {
                        // AI 자체 생성: {"type":"view_menu_detail","menu_id":19}
                        console.log('[AgentChat] 🚀 Navigating to menu:', action.menu_id);
                        setTimeout(() => router.push(`/menus/${action.menu_id}`), 1500);
                        navigationHandled = true;
                    }
                } catch (e) {
                    console.error('[AgentChat] Action parse error:', e);
                }
            }

            // ═══ 텍스트 패턴 기반 네비게이션 fallback ═══
            // ::action{...}:: 마커가 없어도, AI가 "~페이지로 이동" 텍스트를 생성했으면 직접 이동
            if (!navigationHandled) {
                const NAV_PATTERNS: { pattern: RegExp; url: string }[] = [
                    { pattern: /메뉴.{0,10}(페이지|목록|리스트).{0,10}이동/, url: '/menus' },
                    { pattern: /메뉴.{0,5}(보여|보러|구경)/, url: '/menus' },
                    { pattern: /홈.{0,10}(페이지)?.{0,10}이동/, url: '/' },
                    { pattern: /장바구니.{0,10}이동/, url: '/cart' },
                    { pattern: /마이페이지.{0,10}이동/, url: '/mypage' },
                    { pattern: /로그인.{0,10}(페이지)?.{0,10}이동/, url: '/login' },
                    { pattern: /결제.{0,10}(페이지)?.{0,10}이동/, url: '/checkout' },
                    { pattern: /관리자.{0,10}(대시보드|페이지).{0,10}이동/, url: '/admin' },
                    { pattern: /메뉴\s*관리.{0,10}이동/, url: '/admin/menus' },
                    { pattern: /주문\s*관리.{0,10}이동/, url: '/admin/orders' },
                ];

                for (const nav of NAV_PATTERNS) {
                    if (nav.pattern.test(fullText)) {
                        console.log('[AgentChat] 🚀 Pattern-based navigation to:', nav.url);
                        if (nav.url === '/checkout') {
                            const cartItems = useCartStore.getState().items;
                            if (cartItems.length > 0) {
                                useCartStore.getState().setCheckoutItems(cartItems);
                            }
                        }
                        setTimeout(() => router.push(nav.url), 1500);
                        break;
                    }
                }
            }

            // 봇 응답 내용에 따라 센스 있는 퀵 리플라이(버튼) 제시
            if (fullText.includes('개인정보') || fullText.includes('맛있는 메뉴를 소개해주는 건')) {
                setTimeout(() => setQuickReplies(['그래, 메뉴 추천해줘!', '아니 괜찮아']), 300);
            } else if (fullText.includes('추천')) {
                setTimeout(() => setQuickReplies(['다른 메뉴 추천해줘', '장바구니 볼래']), 300);
            }

        } catch (error) {
            console.error('Chat error:', error);
            setIsTyping(false);
            const botId = ++msgIdCounter.current;
            setMessages(prev => [...prev, { id: botId, text: "앗... 무언가 문제가 생겼다덕! 다시 말해줄래덕? 💦", sender: 'bot' }]);
        }
    };

    // 하이드레이션 전이면 렌더링하지 않음
    // 모든 Hook은 이 위에서 호출되어야 함
    if (!isMounted || !pathname) {
        return null;
    }

    return (
        <div className={styles.root}>
            {/* Background Overlay for closing when clicking outside */}
            {isOpen && (
                <div className={styles.bgOverlay} onClick={toggleChat} />
            )}

            {/* Chat Panel */}
            <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <div className={styles.headerAvatar}>
                            <Image src={DUCK_ICON} alt="고라파덕" width={36} height={36} className={styles.duckImg} />
                        </div>
                        <div>
                            <div className={styles.headerTitle}>파덕이</div>
                            <span className={styles.headerSub}>고라파덕 카페 AI 에이전트</span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={toggleChat}>✕</button>
                </div>

                {/* Body */}
                <div className={styles.body} ref={bodyRef}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.messageRow} ${msg.sender === 'bot' ? styles.botRow : styles.userRow}`}
                        >
                            <div className={`${styles.msgAvatar} ${msg.sender === 'bot' ? styles.botAvatar : styles.userAvatar}`}>
                                {msg.sender === 'bot'
                                    ? <Image src={DUCK_ICON} alt="파덕이" width={28} height={28} className={styles.duckImg} />
                                    : '🧑'}
                            </div>
                            <div className={`${styles.msgBubble} ${msg.sender === 'bot' ? styles.botBubble : styles.userBubble}`}>
                                {renderMessageContent(msg.text)}
                            </div>
                        </div>
                    ))}

                    {/* Quick Replies */}
                    {quickReplies.length > 0 && (
                        <div className={styles.quickReplies}>
                            {quickReplies.map((chip, idx) => (
                                <button
                                    key={idx}
                                    className={styles.quickChip}
                                    onClick={() => {
                                        setQuickReplies([]);
                                        if (chip === '장바구니 볼래') {
                                            router.push('/cart');
                                        } else {
                                            handleSend(chip);
                                        }
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className={styles.typingRow}>
                            <div className={`${styles.msgAvatar} ${styles.botAvatar}`}>
                                <Image src={DUCK_ICON} alt="파덕이" width={28} height={28} className={styles.duckImg} />
                            </div>
                            <div className={styles.typingDots}>
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className={styles.inputArea}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={isListening ? "듣고 있다덕... 🎙️" : "파덕이에게 물어보세요..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                handleSend(inputValue);
                            }
                        }}
                    />
                    <button
                        className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ''}`}
                        onClick={toggleVoice}
                        title="음성으로 말하기"
                    >
                        {isListening ? '⏹️' : '🎤'}
                    </button>
                    <button className={styles.sendBtn} onClick={() => handleSend(inputValue)}>전송</button>
                </div>
            </div>

            {/* FAB */}
            <div className={styles.fab} onClick={toggleChat}>
                <Image src={DUCK_ICON} alt="고라파덕 에이전트" width={42} height={42} className={styles.fabImg} />
            </div>

            {/* 장바구니 담기 성공 모달 (챗봇 전용) */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIcon}>🐤</div>
                        <h2 className={styles.modalTitle}>카트에 담겼다덕!</h2>
                        <p className={styles.modalMessage}>
                            {!isAuthenticated ? '[비회원]' : '[파덕이의 팬]'} <br />
                            <strong>{lastAddedMenu?.korName || lastAddedMenu?.name}</strong> 상품을 장바구니에 담았다덕!
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.modalBtnPrimary}
                                onClick={() => {
                                    setIsModalOpen(false);
                                    router.push('/cart');
                                }}
                            >
                                장바구니로 바로 이동
                            </button>
                            <button
                                className={styles.modalBtnSecondary}
                                onClick={() => {
                                    setIsModalOpen(false);
                                    router.push('/menus');
                                }}
                            >
                                쇼핑 계속하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 옵션 선택 모달 */}
            {optionModal && (
                <div className={styles.modalOverlay} onClick={() => setOptionModal(null)}>
                    <div className={styles.optionModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.optionModalHeader}>
                            <h3>🐤 옵션 선택</h3>
                            <button className={styles.closeBtn} onClick={() => setOptionModal(null)}>✕</button>
                        </div>
                        <div className={styles.optionModalMenuInfo}>
                            <span className={styles.optionMenuName}>{optionModal.korName}</span>
                            <span className={styles.optionMenuPrice}>{optionModal.price.toLocaleString()}원</span>
                        </div>
                        <div className={styles.optionModalBody}>
                            {optionModal.optionGroups.map((group) => (
                                <div key={group.name} className={styles.optionGroup}>
                                    <div className={styles.optionGroupHeader}>
                                        <span className={styles.optionGroupName}>{group.name}</span>
                                        <span className={`${styles.optionBadge} ${group.isRequired ? styles.requiredBadge : styles.optionalBadge}`}>
                                            {group.isRequired ? '필수' : '선택'}
                                        </span>
                                    </div>
                                    <div className={styles.optionList}>
                                        {group.optionDetails.map((opt) => {
                                            const isSelected = (selectedOptions[group.name] || []).includes(opt.name);
                                            return (
                                                <label key={opt.name} className={`${styles.optionItem} ${isSelected ? styles.optionItemSelected : ''}`}>
                                                    <input
                                                        type={group.isMultiple ? 'checkbox' : 'radio'}
                                                        name={`option-${group.name}`}
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            setSelectedOptions(prev => {
                                                                if (group.isMultiple) {
                                                                    const current = prev[group.name] || [];
                                                                    return {
                                                                        ...prev,
                                                                        [group.name]: isSelected
                                                                            ? current.filter(n => n !== opt.name)
                                                                            : [...current, opt.name]
                                                                    };
                                                                } else {
                                                                    return { ...prev, [group.name]: [opt.name] };
                                                                }
                                                            });
                                                        }}
                                                    />
                                                    <span className={styles.optionName}>{opt.name}</span>
                                                    {opt.additionalPrice > 0 && (
                                                        <span className={styles.optionPrice}>+{opt.additionalPrice.toLocaleString()}원</span>
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.optionModalFooter}>
                            <div className={styles.optionTotalPrice}>
                                합계: {(() => {
                                    let total = optionModal.price;
                                    optionModal.optionGroups.forEach(g => {
                                        (selectedOptions[g.name] || []).forEach(name => {
                                            const opt = g.optionDetails.find(d => d.name === name);
                                            if (opt) total += opt.additionalPrice || 0;
                                        });
                                    });
                                    return total.toLocaleString();
                                })()}원
                            </div>
                            <div className={styles.optionModalBtns}>
                                <button
                                    className={styles.modalBtnSecondary}
                                    onClick={() => setOptionModal(null)}
                                >
                                    취소
                                </button>
                                <button
                                    className={styles.modalBtnPrimary}
                                    onClick={async () => {
                                        // 필수 옵션 체크
                                        const missing = optionModal.optionGroups.filter(
                                            g => g.isRequired && (!selectedOptions[g.name] || selectedOptions[g.name].length === 0)
                                        );
                                        if (missing.length > 0) {
                                            alert(`필수 옵션을 선택해주세요: ${missing.map(g => g.name).join(', ')}`);
                                            return;
                                        }

                                        // 옵션 기반 가격 계산
                                        let totalPrice = optionModal.price;
                                        const optionsObj: Record<string, string> = {};
                                        optionModal.optionGroups.forEach(g => {
                                            (selectedOptions[g.name] || []).forEach(name => {
                                                const opt = g.optionDetails.find(d => d.name === name);
                                                if (opt) totalPrice += opt.additionalPrice || 0;
                                                optionsObj[g.name] = (selectedOptions[g.name] || []).join(', ');
                                            });
                                        });

                                        if (optionModal.mode === 'cart') {
                                            await addItem({
                                                menuId: optionModal.menuId,
                                                korName: optionModal.korName,
                                                price: totalPrice,
                                                imageSrc: optionModal.imageSrc,
                                                options: optionsObj
                                            });
                                            setOptionModal(null);
                                            setLastAddedMenu({ korName: optionModal.korName });
                                            setIsModalOpen(true);
                                        } else {
                                            // 바로결제
                                            const directItem = {
                                                menuId: optionModal.menuId,
                                                korName: optionModal.korName,
                                                price: totalPrice,
                                                imageSrc: optionModal.imageSrc,
                                                options: optionsObj,
                                                id: Date.now(),
                                                quantity: 1
                                            };
                                            useCartStore.getState().setCheckoutItems([directItem]);
                                            setOptionModal(null);
                                            router.push('/checkout');
                                        }
                                    }}
                                >
                                    {optionModal.mode === 'cart' ? '🛒 담기' : '💳 바로 결제'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
