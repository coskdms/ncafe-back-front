
import styles from './page.module.css';

export default function AdminDashboard() {
    return (
        <>
            <main className={styles.container}>
                <div className={styles.welcome}>
                    <h2>안녕하세요, 사장님! 👋</h2>
                    <p>오늘도 좋은 하루 되세요.</p>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>오늘 주문</span>
                        <span className={styles.statValue}>0건</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>총 메뉴</span>
                        <span className={styles.statValue}>7개</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>품절 메뉴</span>
                        <span className={styles.statValue}>1개</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>오늘 매출</span>
                        <span className={styles.statValue}>₩0</span>
                    </div>
                </div>
            </main>
        </>
    );
}
