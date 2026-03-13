'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import LoginForm from './_components/LoginForm/LoginForm';
import SignupForm from './_components/SignupForm/SignupForm';
import styles from './page.module.css';

type Tab = 'login' | 'signup';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const login = useAuthStore((state) => state.login);
    const [activeTab, setActiveTab] = useState<Tab>('login');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (nickname: string, password: string) => {
        setError('');
        setIsLoading(true);

        try {
            await login(nickname, password);

            // 리다이렉트 (middleware에서 보낸 redirect 파라미터 확인)
            // ★ 중요: router.push 대신 window.location.href를 사용하여 
            // 세션 쿠키가 브라우저에 완전히 반영된 후 페이지가 로드되도록 함 (race condition 방지)
            const redirect = searchParams.get('redirect') || '/';
            window.location.href = redirect;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (nickname: string, password: string) => {
        // ... 기존 코드
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || '회원가입에 실패했습니다.');
            }

            // 회원가입 성공 시 바로 로그인 실행
            await handleLogin(nickname, password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

    const handleKakaoLogin = () => {
        setIsLoading(true);
        window.location.href = kakaoAuthUrl;
    };


    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logo}>🐤☕</div>
                <h1 className={styles.title}>고라파덕 카페</h1>
                <p className={styles.subtitle}>커피 한 잔의 여유를 만나보세요</p>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
                        onClick={() => { setActiveTab('login'); setError(''); setIsLoading(false); }}
                    >
                        로그인
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'signup' ? styles.tabActive : ''}`}
                        onClick={() => { setActiveTab('signup'); setError(''); setIsLoading(false); }}
                    >
                        회원가입
                    </button>
                </div>

                {activeTab === 'login' ? (
                    <>
                        <LoginForm onLogin={handleLogin} error={error} isLoading={isLoading} />
                        <div className={styles.divider}>또는</div>
                        <button 
                            type="button" 
                            className={styles.kakaoButton} 
                            onClick={handleKakaoLogin}
                            disabled={isLoading}
                        >
                            <svg className={styles.kakaoIcon} viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3C6.477 3 2 6.48 2 10.791c0 2.758 1.817 5.176 4.545 6.474l-1.155 4.234c-.053.197.103.385.295.334l4.981-2.924c.433.052.876.082 1.334.082 5.523 0 10-3.48 10-7.791S17.523 3 12 3z"/>
                            </svg>
                            카카오 로그인
                        </button>
                    </>
                ) : (
                    <SignupForm onSignup={handleSignup} error={error} isLoading={isLoading} />
                )}

            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
