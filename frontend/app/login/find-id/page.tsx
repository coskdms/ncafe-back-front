'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

export default function FindIdPage() {
    const [phone, setPhone] = useState('');
    const [result, setResult] = useState<{ found: boolean; nickname?: string; message?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneChange = (value: string) => {
        const nums = value.replace(/[^\d]/g, '').slice(0, 11);
        if (nums.length <= 3) setPhone(nums);
        else if (nums.length <= 7) setPhone(`${nums.slice(0, 3)}-${nums.slice(3)}`);
        else setPhone(`${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        try {
            const cleanPhone = phone.replace(/-/g, '');
            const res = await fetch(`/api/auth/find-id?phone=${cleanPhone}`);
            const data = await res.json();
            setResult(data);
        } catch {
            setResult({ found: false, message: '서버와 통신할 수 없습니다.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logo}>🔍</div>
                <h1 className={styles.title}>아이디 찾기</h1>
                <p className={styles.subtitle}>가입 시 등록한 전화번호로 아이디를 찾아보세요</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4a3728', marginBottom: '6px' }}>전화번호</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="010-1234-5678"
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '2px solid #e5e0d5',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || phone.replace(/-/g, '').length < 10}
                        style={{
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
                        }}
                    >
                        {isLoading ? '찾는 중...' : '아이디 찾기'}
                    </button>
                </form>

                {result && (
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        borderRadius: '12px',
                        background: result.found ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${result.found ? '#bbf7d0' : '#fecaca'}`,
                        textAlign: 'center',
                    }}>
                        {result.found ? (
                            <>
                                <p style={{ fontWeight: 600, color: '#166534', marginBottom: '4px' }}>아이디를 찾았습니다!</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#166534' }}>{result.nickname}</p>
                            </>
                        ) : (
                            <p style={{ fontWeight: 600, color: '#991b1b' }}>{result.message}</p>
                        )}
                    </div>
                )}

                <div className={styles.findLinks} style={{ marginTop: '24px' }}>
                    <Link href="/login">로그인으로 돌아가기</Link>
                    <span>|</span>
                    <Link href="/login/find-password">비밀번호 찾기</Link>
                </div>
            </div>
        </main>
    );
}
