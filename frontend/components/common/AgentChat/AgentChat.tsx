'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './AgentChat.module.css';

// 고라파덕 아이콘 경로
const DUCK_ICON = '/images/gorapaduck-icon.png';

// ===== 1. 더미 데이터 (메뉴 리스트) =====
const DUMMY_MENUS = [
    // 시그니처
    { id: 1, name: '고라파덕 라떼', price: 5500, category: 'signature', desc: '달콤한 바나나 크림이 올라간 옐로우 시그니처 라떼' },
    { id: 2, name: '파덕 스무디', price: 6000, category: 'signature', desc: '망고와 바나나를 갈아 만든 옐로우 열대 스무디' },
    // 커피
    { id: 3, name: '아메리카노', price: 4000, category: 'coffee', desc: '깔끔한 산미가 매력적인 클래식 아메리카노' },
    { id: 4, name: '카페 라떼', price: 4500, category: 'coffee', desc: '고소한 우유와 에스프레소의 부드러운 만남' },
    { id: 5, name: '카페 모카', price: 5000, category: 'coffee', desc: '초코와 에스프레소의 달콤 쌉싸름 조합' },
    { id: 6, name: '바닐라 빈 라떼', price: 5500, category: 'coffee', desc: '진짜 바닐라 빈이 들어간 고급 라떼' },
    { id: 7, name: '콜드브루', price: 4500, category: 'coffee', desc: '16시간 저온 추출한 깊고 묵직한 맛' },
    // 에이드 & 주스
    { id: 8, name: '자몽 에이드', price: 6000, category: 'ade', desc: '과즙 팡팡! 상큼하고 톡 쏘는 생자몽 에이드' },
    { id: 9, name: '레몬 에이드', price: 5500, category: 'ade', desc: '새콤 달콤한 레몬이 톡! 여름에 딱인 에이드' },
    { id: 10, name: '청포도 에이드', price: 5500, category: 'ade', desc: '달콤한 청포도 과육이 톡톡 터지는 시원한 에이드' },
    { id: 11, name: '딸기 주스', price: 5500, category: 'ade', desc: '신선한 딸기를 통째로 갈아 만든 생과일 주스' },
    // 티 & 논커피
    { id: 12, name: '캐모마일 티', price: 4000, category: 'tea', desc: '마음이 편안해지는 은은한 허브티' },
    { id: 13, name: '얼그레이 밀크티', price: 5000, category: 'tea', desc: '베르가모트 향과 고소한 우유의 조화' },
    { id: 14, name: '녹차 라떼', price: 5000, category: 'tea', desc: '제주 유기농 말차로 만든 진한 녹차 라떼' },
    // 디저트
    { id: 15, name: '초코 케이크', price: 6500, category: 'dessert', desc: '스트레스를 날려줄 진하고 꾸덕한 초콜릿 케이크' },
    { id: 16, name: '크로플', price: 4500, category: 'dessert', desc: '바삭 쫀득한 크로플에 아이스크림을 한 스쿱!' },
    { id: 17, name: '티라미수', price: 6000, category: 'dessert', desc: '마스카포네 치즈와 에스프레소의 이탈리안 클래식' },
    { id: 18, name: '스콘 세트', price: 5000, category: 'dessert', desc: '갓 구운 스콘 2개 + 클로티드 크림 + 잼 세트' },
];

// ===== 2. 타입 정의 =====
interface ChatMessage {
    id: number;
    text: string;
    sender: 'bot' | 'user';
}

interface BotResponse {
    text: string;
    quickReplies?: string[];
}

// ===== 3. 키워드 매칭 응답 엔진 (MVP 더미) =====
function generateBotResponse(userText: string): BotResponse {
    const t = userText.toLowerCase().replace(/\s/g, '');

    // 인사
    if (/안녕|하이|반가|헬로|hello|hi/.test(t)) {
        return {
            text: '쿠웨에엑! 반갑다덕! 🎉 뭘 도와줄까덕?',
            quickReplies: ['메뉴 보여줘', '추천해줘', '주문할래']
        };
    }

    // 메뉴 목록
    if (/메뉴|목록|뭐있|뭐팔|리스트/.test(t)) {
        const menuList = DUMMY_MENUS.map(m => `• ${m.name} — ${m.price.toLocaleString()}원`).join('\n');
        return {
            text: `파덕! 우리 카페 메뉴 전부 보여줄게덕!\n\n${menuList}\n\n어떤 거 마셔볼래덕?`,
            quickReplies: ['추천해줘', '달달한 거', '상큼한 거']
        };
    }

    // 상큼/시원 추천
    if (/상큼|시원|에이드|청량|톡/.test(t)) {
        const ades = DUMMY_MENUS.filter(m => m.category === 'ade');
        const rec = ades[Math.floor(Math.random() * ades.length)];
        return {
            text: `쿠웨엑! 상큼한 거라면 「${rec.name}」(${rec.price.toLocaleString()}원)이 최고다덕! 🍋\n${rec.desc}덕!`,
            quickReplies: [`${rec.name} 주문할래`, '다른 추천해줘']
        };
    }

    // 달달/시그니처 추천
    if (/달콤|달달|따뜻|시그니처|라떼|추천/.test(t)) {
        const sig = DUMMY_MENUS.find(m => m.category === 'signature')!;
        return {
            text: `파덕! 달달한 거라면 우리 시그니처 「${sig.name}」(${sig.price.toLocaleString()}원)을 강력 추천한다덕! ☕\n${sig.desc}덕!`,
            quickReplies: [`${sig.name} 주문할래`, '다른 추천해줘', '메뉴 보여줘']
        };
    }

    // 디저트
    if (/디저트|케이크|빵|크로플|간식/.test(t)) {
        const desserts = DUMMY_MENUS.filter(m => m.category === 'dessert');
        const list = desserts.map(d => `• ${d.name} — ${d.price.toLocaleString()}원`).join('\n');
        return {
            text: `파덕! 우리 디저트 메뉴다덕! 🍰\n\n${list}\n\n뭘 먹어볼래덕?`,
            quickReplies: desserts.map(d => `${d.name} 줘`)
        };
    }

    // 커피
    if (/커피|아메|모카|카페|콜드브루/.test(t)) {
        const coffees = DUMMY_MENUS.filter(m => m.category === 'coffee');
        const list = coffees.map(c => `• ${c.name} — ${c.price.toLocaleString()}원`).join('\n');
        return {
            text: `파덕! 커피 메뉴다덕! ☕\n\n${list}\n\n어떤 걸로 골라볼래덕?`,
            quickReplies: ['아메리카노 한 잔', '콜드브루 한 잔', '다른 메뉴 보여줘']
        };
    }

    // 차/티/논커피/따뜻
    if (/차|티|허브|녹차|말차|밀크티|캐모마일|얼그레이|논커피/.test(t)) {
        const teas = DUMMY_MENUS.filter(m => m.category === 'tea');
        const list = teas.map(te => `• ${te.name} — ${te.price.toLocaleString()}원`).join('\n');
        return {
            text: `파덕! 티 & 논커피 메뉴다덕! 🍵\n\n${list}\n\n따뜻하게 한 잔 어떠냐덕?`,
            quickReplies: teas.map(te => `${te.name} 한 잔`)
        };
    }

    // 주문 확인
    if (/줘|주문|콜|담아|할래|한잔|하나/.test(t)) {
        const matchedMenu = DUMMY_MENUS.find(m => t.includes(m.name.replace(/\s/g, '').toLowerCase()));
        if (matchedMenu) {
            return {
                text: `「${matchedMenu.name}」 주문서에 담았다덕! 📝\n💰 ${matchedMenu.price.toLocaleString()}원이다덕!\n카운터에서 확인해달라덕!`,
                quickReplies: ['더 주문할래', '메뉴 보여줘']
            };
        }
        return {
            text: '주문서에 담았다덕! 📝 카운터에서 확인해달라덕!',
            quickReplies: ['더 주문할래', '메뉴 보여줘']
        };
    }

    // 가격 문의
    if (/가격|얼마/.test(t)) {
        const matchedMenu = DUMMY_MENUS.find(m => t.includes(m.name.replace(/\s/g, '').toLowerCase()));
        if (matchedMenu) {
            return {
                text: `「${matchedMenu.name}」은(는) ${matchedMenu.price.toLocaleString()}원이다덕! 💰`,
                quickReplies: [`${matchedMenu.name} 주문할래`, '메뉴 보여줘']
            };
        }
        return {
            text: '어떤 메뉴의 가격이 궁금하냐덕? 메뉴 이름을 말해달라덕!',
            quickReplies: ['메뉴 보여줘']
        };
    }

    // 9. 이스터에그: 개인정보 방어 (이름, 나은)
    if (/나은/.test(t) || (/이름/.test(t) && /뭐|알려|누구/.test(t))) {
        return {
            text: '쿠웨에엑! 🚨 삐빅!\n그건 치명적인 개인정보라 이 파덕이가 절대!!! 말해줄 수 없다덕!!! 🤐💦 (철통 보안!)',
            quickReplies: ['사장님이 그렇게 이뻐?', '알았어 메뉴나 줘']
        };
    }

    // 10. 이스터에그: 사장님 극찬
    if (/사장|주인/.test(t)) {
        return {
            text: '파덕! 우리 고라파덕 카페에는 엄청나게 예뻐서 눈이 부시는 사장님이 계신다덕! ✨😎\n(파덕이는 매일 심쿵한다덕...)',
            quickReplies: ['사장님 이름이 뭐야?', '나은이가 누구야?', '메뉴 추천해줘']
        };
    }

    // Fallback
    return {
        text: '파...덕? 🤔 무슨 말인지 잘 모르겠다덕!\n메뉴를 추천받거나 주문해보라덕!',
        quickReplies: ['메뉴 보여줘', '추천해줘', '주문할래']
    };
}

// ===== 4. React 컴포넌트 =====
export default function AgentChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [quickReplies, setQuickReplies] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isFirstOpen, setIsFirstOpen] = useState(true);

    const bodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    let msgIdCounter = useRef(0);

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
    const handleSend = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        // 사용자 메시지 추가
        const userId = ++msgIdCounter.current;
        setMessages(prev => [...prev, { id: userId, text: trimmed, sender: 'user' }]);
        setInputValue('');
        setQuickReplies([]); // 기존 칩 제거

        // 타이핑 인디케이터
        setIsTyping(true);

        const delay = 800 + Math.random() * 700;
        setTimeout(() => {
            setIsTyping(false);
            const response = generateBotResponse(trimmed);
            const botId = ++msgIdCounter.current;
            setMessages(prev => [...prev, { id: botId, text: response.text, sender: 'bot' }]);

            if (response.quickReplies && response.quickReplies.length > 0) {
                setTimeout(() => {
                    setQuickReplies(response.quickReplies!);
                }, 300);
            }
        }, delay);
    };

    return (
        <div className={styles.root}>
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
                                {msg.text}
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
                                        handleSend(chip);
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
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(inputValue); }}
                    />
                    <button className={styles.sendBtn} onClick={() => handleSend(inputValue)}>전송</button>
                </div>
            </div>

            {/* FAB */}
            <div className={styles.fab} onClick={toggleChat}>
                <Image src={DUCK_ICON} alt="고라파덕 에이전트" width={42} height={42} className={styles.fabImg} />
            </div>
        </div>
    );
}
