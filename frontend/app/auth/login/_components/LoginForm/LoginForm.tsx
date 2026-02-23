'use client';

import { useState } from 'react';
import styles from './LoginForm.module.css';

interface LoginFormProps {
    onLogin: (email: string, password: string) => void;
    error?: string;
    isLoading?: boolean;
}

export default function LoginForm({ onLogin, error, isLoading }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="login-email" className={styles.label}>이메일</label>
                <input
                    id="login-email"
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    required
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="login-password" className={styles.label}>비밀번호</label>
                <input
                    id="login-password"
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    required
                />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
            </button>
        </form>
    );
}
