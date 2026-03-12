'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import styles from './AgentChat.module.css';

// 고라파덕 아이콘 경로
const DUCK_ICON = '/images/gorapaduck-icon.png';

// ===== 2. 타입 정의 =====
interface ChatMessage {
    id: number;
    text: string;
    sender: 'bot' | 'user';
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

    const addItem = useCartStore((state) => state.addItem);
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const bodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    let msgIdCounter = useRef(0);


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
            setMessages([{ id: welcomeId, text: '쿠웨에엑! 고라파덕 카페에 온 걸 환영한다덕! 🎉\n무엇을 도와줄까덕?', sender: 'bot' }]);
            setTimeout(() => {
                setQuickReplies(['메뉴 보여줘', '추천해줘', '디저트 뭐 있어?']);
            }, 400);
        }

        if (willOpen) {
            setTimeout(() => inputRef.current?.focus(), 350);
        }
    };

    // 사용자 입력 처리
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
            for (const actionMatch of actionMatches) {
                try {
                    const action = JSON.parse(actionMatch[1]);
                    console.log('[AgentChat] Executing Action:', action);
                    
                    if (action.type === 'add_to_cart') {
                        await addItem({
                            menuId: action.menuId,
                            korName: action.korName,
                            price: action.price,
                            imageSrc: action.imageSrc || 'blank.png'
                        });
                        setLastAddedMenu(action);
                        setIsModalOpen(true);
                    } else if (action.type === 'direct_order') {
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
                        }
                    } else if (action.type === 'view_menu_detail' && action.menu_id) {
                        // AI 자체 생성: {"type":"view_menu_detail","menu_id":19}
                        console.log('[AgentChat] 🚀 Navigating to menu:', action.menu_id);
                        setTimeout(() => router.push(`/menus/${action.menu_id}`), 1500);
                    }
                } catch (e) {
                    console.error('[AgentChat] Action parse error:', e);
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

    // 하이드레이션 전이거나 관리자 페이지면 렌더링하지 않음
    // 모든 Hook은 이 위에서 호출되어야 함
    if (!isMounted || !pathname || pathname.startsWith('/admin')) {
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
                        placeholder="파덕이에게 물어보세요..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                handleSend(inputValue);
                            }
                        }}
                    />
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
        </div>
    );
}
