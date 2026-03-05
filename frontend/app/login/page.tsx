'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import LoginForm from './_components/LoginForm/LoginForm';
import SignupForm from './_components/SignupForm/SignupForm';
import styles from './page.module.css';

type Tab = 'login' | 'signup';

export default function LoginPage() {
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
            const redirect = searchParams.get('redirect') || '/';
            router.push(redirect);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (nickname: string, password: string) => {
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

            setActiveTab('login');
            setError('');
            alert('회원가입이 완료되었습니다! 로그인해주세요.');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
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
                        onClick={() => { setActiveTab('login'); setError(''); }}
                    >
                        로그인
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'signup' ? styles.tabActive : ''}`}
                        onClick={() => { setActiveTab('signup'); setError(''); }}
                    >
                        회원가입
                    </button>
                </div>

                {activeTab === 'login' ? (
                    <LoginForm onLogin={handleLogin} error={error} isLoading={isLoading} />
                ) : (
                    <SignupForm onSignup={handleSignup} error={error} isLoading={isLoading} />
                )}
            </div>
        </main>
    );
}
