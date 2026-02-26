'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import LoginForm from './_components/LoginForm/LoginForm';
import SignupForm from './_components/SignupForm/SignupForm';
import styles from './page.module.css';

type Tab = 'login' | 'signup';

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [activeTab, setActiveTab] = useState<Tab>('login');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (nickname: string, password: string) => {
        setError('');
        setIsLoading(true);

        try {
            // Zustand authStore의 login 액션을 호출합니다.
            // 내부적으로 Spring Security POST /login → GET /api/auth/me 순서로 처리됩니다.
            await login(nickname, password);
            console.log('로그인 성공!');
            router.push('/');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (email: string, password: string, nickname: string) => {
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/v1/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, nickname }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || '회원가입에 실패했습니다.');
            }

            // 가입 성공 → 로그인 탭으로 전환
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
