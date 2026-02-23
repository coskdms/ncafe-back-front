'use client';

import { useState } from 'react';
import styles from './SignupForm.module.css';

interface SignupFormProps {
    onSignup: (email: string, password: string, nickname: string) => void;
    error?: string;
    isLoading?: boolean;
}

export default function SignupForm({ onSignup, error, isLoading }: SignupFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickname, setNickname] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            return;
        }
        onSignup(email, password, nickname);
    };

    const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="signup-email" className={styles.label}>이메일</label>
                <input
                    id="signup-email"
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    required
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="signup-nickname" className={styles.label}>닉네임</label>
                <input
                    id="signup-nickname"
                    type="text"
                    className={styles.input}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    required
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="signup-password" className={styles.label}>비밀번호</label>
                <input
                    id="signup-password"
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    required
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="signup-password-confirm" className={styles.label}>비밀번호 확인</label>
                <input
                    id="signup-password-confirm"
                    type="password"
                    className={`${styles.input} ${passwordMismatch ? styles.inputError : ''}`}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                />
                {passwordMismatch && (
                    <span className={styles.fieldError}>비밀번호가 일치하지 않습니다</span>
                )}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button} disabled={isLoading || passwordMismatch}>
                {isLoading ? '가입 중...' : '회원가입'}
            </button>
        </form>
    );
}
