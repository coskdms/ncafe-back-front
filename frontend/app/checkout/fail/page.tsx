'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import styles from '../Checkout.module.css';
import Navbar from '@/components/landing/Navbar';

function FailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorMsg = searchParams.get('error_msg') || '알 수 없는 오류가 발생했습니다.';

    return (
        <div className={styles.resultContainer}>
            <div className={styles.failIconWrapper}>
                <XCircle size={80} color="#dc2626" strokeWidth={3} />
            </div>
            <h1 className={styles.resultTitle}>결제에 실패했습니다 🐣</h1>
            <p className={styles.resultDesc}>
                결제 과정 중 문제가 발생했어요. <br />
                걱정 마세요! 잠시 후 다시 시도하실 수 있습니다.
            </p>
            
            <div className={styles.resultInfo}>
                <div className={styles.resultRow} style={{ justifyContent: 'center', color: '#dc2626', fontWeight: 700 }}>
                    {errorMsg}
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <button className={styles.homeBtn} onClick={() => router.push('/checkout')}>
                    다시 결제하기
                </button>
                <button className={`${styles.homeBtn} ${styles.secondary}`} onClick={() => router.push('/')}>
                    홈으로 이동
                </button>
            </div>
        </div>
    );
}

export default function FailPage() {
    return (
        <main className={styles.main}>
            <Navbar />
            <Suspense fallback={<div>로딩 중...</div>}>
                <FailContent />
            </Suspense>
        </main>
    );
}
