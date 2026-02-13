import styles from './HighlightBar.module.css';

const stats = [
    { number: '1,200+', label: '행복한 트레이너', emoji: '🦆' },
    { number: '50+', label: '포켓몬 테마 메뉴', emoji: '☕' },
    { number: '4.9', label: '고객 만족도', emoji: '⭐' },
    { number: '365일', label: '매일 영업 중', emoji: '💛' },
];

export default function HighlightBar() {
    return (
        <section className={styles.bar}>
            <div className={styles.container}>
                {stats.map((s, i) => (
                    <div key={i} className={styles.stat}>
                        <span className={styles.emoji}>{s.emoji}</span>
                        <span className={styles.number}>{s.number}</span>
                        <span className={styles.label}>{s.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
