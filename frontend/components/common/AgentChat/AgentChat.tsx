'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './AgentChat.module.css';

// 고라파덕 아이콘 경로
const DUCK_ICON = '/images/gorapaduck-icon.png';

// ===== 2. 타입 정의 =====
interface ChatMessage {
    id: number;
    text: string;
    sender: 'bot' | 'user';
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
            // 지금까지의 대화 이력을 beomini-server 형식에 맞춰 변환
            // 첫 메시지는 인사말이므로 포함하거나, 직전 대화들만 포함
            // 여기서 messages 상태는 비동기적으로 아직 업데이트 되지 않았으므로
            // 함수 스코프 내에서 prevMessages 배열을 사용
            setMessages(currentMessages => {
                const apiMessages = currentMessages.map(m => ({
                    role: m.sender === 'bot' ? 'model' : 'user',
                    content: m.text
                }));

                // API 호출 (BFF 경유)
                fetch('/api/agent/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: apiMessages,
                        stream: false
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        setIsTyping(false);
                        const botId = ++msgIdCounter.current;
                        const replyText = data.content || "앗... 서버에서 응답을 가져올 수 없었다덕! 💦";

                        setMessages(prev => [...prev, { id: botId, text: replyText, sender: 'bot' }]);
                    })
                    .catch(err => {
                        console.error('Chat error:', err);
                        setIsTyping(false);
                        const botId = ++msgIdCounter.current;
                        setMessages(prev => [...prev, { id: botId, text: "앗... 무언가 문제가 생겼다덕! 다시 말해줄래덕? 💦", sender: 'bot' }]);
                    });

                return currentMessages;
            });

        } catch (error) {
            console.error(error);
            setIsTyping(false);
        }
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
        </div>
    );
}
