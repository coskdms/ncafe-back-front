'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore'; // 장바구니 비우기용
import { CheckCircle } from 'lucide-react';
import styles from '../Checkout.module.css';
import Navbar from '@/components/landing/Navbar';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('paymentId');

    const { clearCart, setCheckoutItems, syncWithServer } = useCartStore();

    useEffect(() => {
        // 결제 성공 시 장바구니와 체크아웃 아이템 비우기 + 서버 동기화
        const cleanUp = async () => {
            await clearCart();
            setCheckoutItems([]);
            await syncWithServer(); // Navbar 등 타 컴포넌트 즉시 반영
        };
        cleanUp();
    }, [clearCart, setCheckoutItems, syncWithServer]);

    return (
        <div className={styles.resultContainer}>
            <div className={styles.successIconWrapper}>
                <CheckCircle size={80} color="#16a34a" strokeWidth={3} />
            </div>
            <h1 className={styles.resultTitle}>결제가 완료되었습니다! 🐤</h1>
            <p className={styles.resultDesc}>
                주문이 정상적으로 접수되었습니다. <br />
                맛있는 고라파덕 메뉴를 곧 준비해 드릴게요!
            </p>
            
            <div className={styles.resultInfo}>
                <div className={styles.resultRow}>
                    <span>주문 일시</span>
                    <span>{new Date().toLocaleString()}</span>
                </div>
                <div className={styles.resultRow}>
                    <span>결제 ID</span>
                    <span>{paymentId}</span>
                </div>
            </div>

            <button className={styles.homeBtn} onClick={() => router.push('/')}>
                홈으로 돌아가기
            </button>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <main className={styles.main}>
            <Navbar />
            <Suspense fallback={<div>로딩 중...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
