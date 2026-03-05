'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminAccessAlert() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get('error') === 'admin-only') {
            toast.error('관리자만 접근할 수 있는 페이지입니다.', {
                duration: 4000,
                style: {
                    background: '#1a1a2e',
                    color: '#fff',
                    border: '1px solid #e94560',
                    padding: '16px 24px',
                    fontSize: '15px',
                    borderRadius: '12px',
                },
                iconTheme: {
                    primary: '#e94560',
                    secondary: '#fff',
                },
            });

            // 쿼리 파라미터 제거 (URL 깔끔하게)
            router.replace('/', { scroll: false });
        }
    }, [searchParams, router]);

    return <Toaster position="top-center" />;
}
