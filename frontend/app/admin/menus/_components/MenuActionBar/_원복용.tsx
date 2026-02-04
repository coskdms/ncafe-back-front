import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import styles from './MenuActionBar.module.css';

interface MenuActionBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    totalCount: number;
}

export default function MenuActionBar({ searchQuery, onSearchChange, totalCount }: MenuActionBarProps) {
    return (
        <section className={styles.container} aria-label="메뉴 관리 도구">
            {/* 제목 추가해주기 컴포넌트 분리할때는 제목 꼭 넣어주기 룰로 추가*/}
            <div className={styles.leftGroup}>
                <div className={styles.searchWrapper} role="search">
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="search"
                        placeholder="메뉴 검색..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.menuCount}>
                    총 <strong>{totalCount}</strong>개의 메뉴
                </div>
            </div>

            <Link href="/admin/menus/new">
                <Button>
                    <Plus size={20} />
                    새 메뉴 추가
                </Button>
            </Link>
        </section>
    );
}
