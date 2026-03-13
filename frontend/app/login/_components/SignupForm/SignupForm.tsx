'use client';

import { useState } from 'react';
import styles from './SignupForm.module.css';
import { validateNickname, validatePassword, getPasswordStrength } from '@/utils/validators';

interface SignupFormProps {
    onSignup: (nickname: string, password: string) => void;
    error?: string;
    isLoading?: boolean;
}

export default function SignupForm({ onSignup, error, isLoading }: SignupFormProps) {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const nicknameValidation = nickname.length > 0 ? validateNickname(nickname) : null;
    const passwordValidation = password.length > 0 ? validatePassword(password) : null;
    const passwordStrength = getPasswordStrength(password);
    const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

    const isFormValid = 
        nicknameValidation?.isValid && 
        passwordValidation?.isValid && 
        !passwordMismatch && 
        passwordConfirm.length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        onSignup(nickname, password);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="signup-nickname" className={styles.label}>아이디</label>
                <input
                    id="signup-nickname"
                    type="text"
                    className={`${styles.input} ${nicknameValidation && !nicknameValidation.isValid ? styles.inputError : ''}`}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="2~20자 영문, 숫자, 한글"
                    required
                />
                {nicknameValidation && !nicknameValidation.isValid && (
                    <span className={styles.fieldError}>{nicknameValidation.message}</span>
                )}
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="signup-password" className={styles.label}>비밀번호</label>
                <input
                    id="signup-password"
                    type="password"
                    className={`${styles.input} ${passwordValidation && !passwordValidation.isValid ? styles.inputError : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8자 이상, 영문+숫자+특수문자"
                    required
                />
                {password.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#e5e7eb', overflow: 'hidden' }}>
                            <div style={{ 
                                width: `${passwordStrength.level * 25}%`, 
                                height: '100%', 
                                background: passwordStrength.color,
                                borderRadius: '2px',
                                transition: 'width 0.3s, background 0.3s'
                            }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: passwordStrength.color, fontWeight: 600, minWidth: '50px' }}>
                            {passwordStrength.label}
                        </span>
                    </div>
                )}
                {passwordValidation && !passwordValidation.isValid && (
                    <span className={styles.fieldError}>{passwordValidation.message}</span>
                )}
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
            <button type="submit" className={styles.button} disabled={isLoading || !isFormValid}>
                {isLoading ? '가입 중...' : '회원가입'}
            </button>
        </form>
    );
}
