'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store, KeyRound, Home, ShoppingBag, LogOut, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import styles from './ProfileDropdown.module.css';

interface ProfileDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            // 약간의 딜레이를 줘서 버튼 클릭 이벤트와 충돌 방지
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleNavigate = (path: string) => {
        router.push(path);
        onClose();
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
        onClose();
    };

    const handleOpenCustomerPage = () => {
        window.open('/', '_blank');
        onClose();
    };

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            {/* 프로필 영역 */}
            <div className={styles.profileSection}>
                <div className={styles.avatar}>
                    {user?.nickname?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className={styles.profileInfo}>
                    <span className={styles.nickname}>{user?.nickname || '관리자'}님</span>
                    <span className={styles.roleBadge}>{user?.role || 'ADMIN'}</span>
                </div>
            </div>

            <div className={styles.divider} />

            {/* 관리 메뉴 */}
            <div className={styles.menuGroup}>
                <button className={styles.menuItem} onClick={() => handleNavigate('/admin/settings')}>
                    <Store size={16} />
                    <span>매장 정보</span>
                </button>
                <button className={styles.menuItem} onClick={() => handleNavigate('/mypage?tab=settings&section=password')}>
                    <KeyRound size={16} />
                    <span>비밀번호 변경</span>
                </button>
            </div>

            <div className={styles.divider} />

            {/* 이동 메뉴 */}
            <div className={styles.menuGroup}>
                <button className={styles.menuItem} onClick={handleOpenCustomerPage}>
                    <Home size={16} />
                    <span>고객 페이지</span>
                    <ExternalLink size={12} className={styles.externalIcon} />
                </button>
                <button className={styles.menuItem} onClick={() => handleNavigate('/mypage')}>
                    <ShoppingBag size={16} />
                    <span>내 주문내역</span>
                </button>
            </div>

            <div className={styles.divider} />

            {/* 로그아웃 */}
            <div className={styles.menuGroup}>
                <button className={`${styles.menuItem} ${styles.logoutItem}`} onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>로그아웃</span>
                </button>
            </div>
        </div>
    );
}
