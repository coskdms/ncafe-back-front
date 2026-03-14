'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../page.module.css';
import { validatePassword, getPasswordStrength } from '@/utils/validators';

type Step = 'verify' | 'answer' | 'reset' | 'done';

export default function FindPasswordPage() {
    const [step, setStep] = useState<Step>('verify');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneChange = (value: string) => {
        const nums = value.replace(/[^\d]/g, '').slice(0, 11);
        if (nums.length <= 3) setPhone(nums);
        else if (nums.length <= 7) setPhone(`${nums.slice(0, 3)}-${nums.slice(3)}`);
        else setPhone(`${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`);
    };

    // 1단계: 닉네임 + 전화번호 검증
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/find-password/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname, phone: phone.replace(/-/g, '') }),
            });
            const data = await res.json();
            if (data.verified) {
                setQuestion(data.question);
                setStep('answer');
            } else {
                setError(data.message || '정보가 일치하지 않습니다.');
            }
        } catch {
            setError('서버와 통신할 수 없습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 2단계: 보안질문 답변 + 비밀번호 재설정
    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/find-password/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nickname,
                    phone: phone.replace(/-/g, ''),
                    securityAnswer: answer.trim(),
                    newPassword,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setStep('done');
            } else {
                setError(data.message || '비밀번호 변경에 실패했습니다.');
            }
        } catch {
            setError('서버와 통신할 수 없습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordValidation = newPassword.length > 0 ? validatePassword(newPassword) : null;
    const passwordStrength = getPasswordStrength(newPassword);
    const passwordMismatch = newPasswordConfirm.length > 0 && newPassword !== newPasswordConfirm;

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '2px solid #e5e0d5',
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box' as const,
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#4a3728',
        marginBottom: '6px',
    };

    const btnStyle = {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: 'none',
        background: '#ca8a04',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 700,
        cursor: 'pointer',
        opacity: isLoading ? 0.6 : 1,
    };

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logo}>🔐</div>
                <h1 className={styles.title}>비밀번호 찾기</h1>
                <p className={styles.subtitle}>
                    {step === 'verify' && '아이디와 전화번호를 입력해주세요'}
                    {step === 'answer' && '보안 질문에 답변해주세요'}
                    {step === 'reset' && '새 비밀번호를 설정해주세요'}
                    {step === 'done' && '비밀번호가 변경되었습니다!'}
                </p>

                {/* 단계 표시 */}
                {step !== 'done' && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                        {['verify', 'answer'].map((s, i) => (
                            <div key={s} style={{
                                flex: 1,
                                height: '4px',
                                borderRadius: '2px',
                                background: ['verify', 'answer'].indexOf(step) >= i ? '#ca8a04' : '#e5e0d5',
                                transition: 'background 0.3s',
                            }} />
                        ))}
                    </div>
                )}

                {/* 1단계: 닉네임 + 전화번호 */}
                {step === 'verify' && (
                    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>아이디</label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="아이디를 입력하세요"
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>전화번호</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                placeholder="010-1234-5678"
                                style={inputStyle}
                                required
                            />
                        </div>
                        {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>{error}</p>}
                        <button type="submit" disabled={isLoading || !nickname || phone.replace(/-/g, '').length < 10} style={btnStyle}>
                            {isLoading ? '확인 중...' : '다음'}
                        </button>
                    </form>
                )}

                {/* 2단계: 보안질문 답변 + 새 비밀번호 */}
                {step === 'answer' && (
                    <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ padding: '12px 16px', background: '#fefce8', borderRadius: '12px', border: '1px solid #fde68a' }}>
                            <p style={{ fontSize: '0.8rem', color: '#78350f', fontWeight: 600, marginBottom: '4px' }}>보안 질문</p>
                            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#451a03' }}>{question}</p>
                        </div>
                        <div>
                            <label style={labelStyle}>답변</label>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="보안 질문의 답변을 입력하세요"
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>새 비밀번호</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="8자 이상, 영문+숫자+특수문자"
                                style={{
                                    ...inputStyle,
                                    borderColor: passwordValidation && !passwordValidation.isValid ? '#ef4444' : '#e5e0d5',
                                }}
                                required
                            />
                            {newPassword.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                    <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#e5e7eb', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${passwordStrength.level * 25}%`,
                                            height: '100%',
                                            background: passwordStrength.color,
                                            borderRadius: '2px',
                                            transition: 'width 0.3s',
                                        }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: passwordStrength.color, fontWeight: 600 }}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <label style={labelStyle}>새 비밀번호 확인</label>
                            <input
                                type="password"
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                placeholder="새 비밀번호를 다시 입력하세요"
                                style={{
                                    ...inputStyle,
                                    borderColor: passwordMismatch ? '#ef4444' : '#e5e0d5',
                                }}
                                required
                            />
                            {passwordMismatch && (
                                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>비밀번호가 일치하지 않습니다</span>
                            )}
                        </div>
                        {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading || !answer.trim() || !passwordValidation?.isValid || passwordMismatch || !newPasswordConfirm}
                            style={btnStyle}
                        >
                            {isLoading ? '변경 중...' : '비밀번호 변경'}
                        </button>
                    </form>
                )}

                {/* 완료 */}
                {step === 'done' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            margin: '20px auto',
                            width: '60px',
                            height: '60px',
                            background: '#dcfce7',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                        }}>
                            ✅
                        </div>
                        <p style={{ fontWeight: 700, color: '#166534', fontSize: '1.1rem' }}>비밀번호가 변경되었습니다!</p>
                        <p style={{ color: '#78716c', marginTop: '8px', fontSize: '0.9rem' }}>새 비밀번호로 로그인해주세요.</p>
                        <Link
                            href="/login"
                            style={{
                                display: 'inline-block',
                                marginTop: '20px',
                                padding: '12px 32px',
                                background: '#ca8a04',
                                color: 'white',
                                borderRadius: '12px',
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            로그인하기
                        </Link>
                    </div>
                )}

                {step !== 'done' && (
                    <div className={styles.findLinks} style={{ marginTop: '24px' }}>
                        <Link href="/login">로그인으로 돌아가기</Link>
                        <span>|</span>
                        <Link href="/login/find-id">아이디 찾기</Link>
                    </div>
                )}
            </div>
        </main>
    );
}
