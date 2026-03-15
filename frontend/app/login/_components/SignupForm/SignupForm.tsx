'use client';

import { useRef, useState } from 'react';
import styles from './SignupForm.module.css';
import { validateNickname, validatePassword, getPasswordStrength } from '@/utils/validators';
import { highlightAndScroll } from '@/utils/formScroll';

const SECURITY_QUESTIONS = [
    '처음 키운 반려동물의 이름은?',
    '졸업한 초등학교 이름은?',
    '어릴 때 별명은?',
    '가장 좋아하는 음식은?',
    '태어난 도시는?',
];

interface SignupFormProps {
    onSignup: (nickname: string, password: string, phone: string, securityQuestion: string, securityAnswer: string) => void;
    error?: string;
    isLoading?: boolean;
}

export default function SignupForm({ onSignup, error, isLoading }: SignupFormProps) {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [phone, setPhone] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const nicknameValidation = nickname.length > 0 ? validateNickname(nickname) : null;
    const passwordValidation = password.length > 0 ? validatePassword(password) : null;
    const passwordStrength = getPasswordStrength(password);
    const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

    const phoneValid = /^01[016789]\d{7,8}$/.test(phone.replace(/-/g, ''));

    const isFormValid = 
        nicknameValidation?.isValid && 
        passwordValidation?.isValid && 
        !passwordMismatch && 
        passwordConfirm.length > 0 &&
        phoneValid &&
        securityQuestion.length > 0 &&
        securityAnswer.trim().length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 비어있는 필드로 스크롤 이동
        if (!isFormValid) {
            const checks: [boolean, string][] = [
                [!nickname, 'signup-nickname'],
                [nickname.length > 0 && !nicknameValidation?.isValid, 'signup-nickname'],
                [!password, 'signup-password'],
                [password.length > 0 && !passwordValidation?.isValid, 'signup-password'],
                [!passwordConfirm || passwordMismatch, 'signup-password-confirm'],
                [!phone || !phoneValid, 'signup-phone'],
                [!securityQuestion, 'signup-security-q'],
                [securityQuestion.length > 0 && !securityAnswer.trim(), 'signup-security-a'],
            ];
            for (const [invalid, id] of checks) {
                if (invalid) {
                    const el = document.getElementById(id);
                    if (el) highlightAndScroll(el);
                    return;
                }
            }
            return;
        }
        
        const cleanPhone = phone.replace(/-/g, '');
        onSignup(nickname, password, cleanPhone, securityQuestion, securityAnswer.trim());
    };

    // 전화번호 자동 하이픈
    const handlePhoneChange = (value: string) => {
        const nums = value.replace(/[^\d]/g, '').slice(0, 11);
        if (nums.length <= 3) setPhone(nums);
        else if (nums.length <= 7) setPhone(`${nums.slice(0, 3)}-${nums.slice(3)}`);
        else setPhone(`${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`);
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
                    maxLength={20}
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
                    maxLength={100}
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
                    maxLength={100}
                />
                {passwordMismatch && (
                    <span className={styles.fieldError}>비밀번호가 일치하지 않습니다</span>
                )}
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="signup-phone" className={styles.label}>전화번호</label>
                <input
                    id="signup-phone"
                    type="tel"
                    className={`${styles.input} ${phone.length > 0 && !phoneValid ? styles.inputError : ''}`}
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="010-1234-5678"
                    required
                />
                {phone.length > 0 && !phoneValid && (
                    <span className={styles.fieldError}>올바른 전화번호를 입력해주세요</span>
                )}
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="signup-security-q" className={styles.label}>보안 질문</label>
                <select
                    id="signup-security-q"
                    className={styles.input}
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    required
                    style={{ color: securityQuestion ? '#4a3728' : '#c4a882' }}
                >
                    <option value="" disabled>보안 질문을 선택하세요</option>
                    {SECURITY_QUESTIONS.map(q => (
                        <option key={q} value={q} style={{ color: '#4a3728' }}>{q}</option>
                    ))}
                </select>
            </div>
            {securityQuestion && (
                <div className={styles.inputGroup}>
                    <label htmlFor="signup-security-a" className={styles.label}>보안 질문 답변</label>
                    <input
                        id="signup-security-a"
                        type="text"
                        className={styles.input}
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        placeholder="답변을 입력하세요"
                        required
                        maxLength={100}
                    />
                </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button} disabled={isLoading || !isFormValid}>
                {isLoading ? '가입 중...' : '회원가입'}
            </button>
        </form>
    );
}
