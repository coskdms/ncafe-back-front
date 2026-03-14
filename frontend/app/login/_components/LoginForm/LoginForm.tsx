'use client';

import { useState } from 'react';
import styles from './LoginForm.module.css';
import { validateNickname } from '@/utils/validators';
import { highlightAndScroll } from '@/utils/formScroll';

interface LoginFormProps {
    onLogin: (nickname: string, password: string) => void;
    error?: string;
    isLoading?: boolean;
}

export default function LoginForm({ onLogin, error, isLoading }: LoginFormProps) {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');

    const nicknameValidation = nickname.length > 0 ? validateNickname(nickname) : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickname) {
            const el = document.getElementById('login-nickname');
            if (el) highlightAndScroll(el);
            return;
        }
        if (nicknameValidation && !nicknameValidation.isValid) {
            const el = document.getElementById('login-nickname');
            if (el) highlightAndScroll(el);
            return;
        }
        if (!password) {
            const el = document.getElementById('login-password');
            if (el) highlightAndScroll(el);
            return;
        }
        onLogin(nickname, password);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="login-nickname" className={styles.label}>아이디</label>
                <input
                    id="login-nickname"
                    type="text"
                    className={`${styles.input} ${nicknameValidation && !nicknameValidation.isValid ? styles.inputError : ''}`}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    required
                />
                {nicknameValidation && !nicknameValidation.isValid && (
                    <span className={styles.fieldError}>{nicknameValidation.message}</span>
                )}
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
