'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronLeft, ClipboardList } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { toast } from '@/stores/toastStore';
import styles from './page.module.css';

export default function OrderLookupPage() {
    const router = useRouter();
    const [paymentId, setPaymentId] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = paymentId.trim();
        if (!trimmed) {
            toast.warning('주문번호를 입력해주세요.');
            return;
        }

        setIsSearching(true);

        try {
            const res = await fetch(`/api/orders/${trimmed}`);
            if (res.ok) {
                router.push(`/orders/${trimmed}`);
            } else if (res.status === 404) {
                toast.error('해당 주문번호를 찾을 수 없습니다. 다시 확인해주세요.');
            } else {
                toast.error('주문 조회 중 오류가 발생했습니다.');
            }
        } catch {
            toast.error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <Link href="/" className={styles.backLink}>
                    <ChevronLeft size={18} />
                    홈으로 돌아가기
                </Link>

                <div className={styles.card}>
                    <div className={styles.iconWrapper}>
                        <ClipboardList size={48} className={styles.icon} />
                    </div>
                    <h1 className={styles.title}>주문 조회</h1>
                    <p className={styles.description}>
                        결제 시 받은 주문번호를 입력하면<br />
                        주문 상태를 확인할 수 있습니다.
                    </p>

                    <form onSubmit={handleSearch} className={styles.form}>
                        <div className={styles.inputWrapper}>
                            <Search size={20} className={styles.inputIcon} />
                            <input
                                type="text"
                                value={paymentId}
                                onChange={(e) => setPaymentId(e.target.value)}
                                placeholder="주문번호를 입력해주세요"
                                className={styles.input}
                                autoFocus
                                maxLength={100}
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.searchBtn}
                            disabled={isSearching}
                        >
                            {isSearching ? '조회 중...' : '주문 조회하기'}
                        </button>
                    </form>

                    <div className={styles.helpText}>
                        <p>💡 주문번호는 결제 완료 후 주문 현황 페이지에서 확인할 수 있습니다.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
