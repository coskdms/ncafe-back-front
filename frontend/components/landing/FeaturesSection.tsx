import styles from './FeaturesSection.module.css';

const features = [
    {
        emoji: '☕',
        title: '시그니처 음료',
        desc: '고라파덕 라떼, 피카츄 에이드 등 포켓몬 테마 음료를 즐겨보세요!',
    },
    {
        emoji: '🍰',
        title: '귀여운 디저트',
        desc: '몬스터볼 마카롱, 고라파덕 케이크 등 귀여운 수제 디저트!',
    },
    {
        emoji: '📸',
        title: '포토존',
        desc: '고라파덕과 함께 찍는 인생샷! SNS에 자랑해보세요 🐤',
    },
    {
        emoji: '🎁',
        title: '포켓몬 굿즈',
        desc: '한정판 포켓몬 굿즈와 콜라보 상품을 만나보세요!',
    },
    {
        emoji: '🛋️',
        title: '아늑한 공간',
        desc: '노란 쿠션이 가득한 편안한 카페에서 힐링 시간을 보내세요',
    },
    {
        emoji: '💛',
        title: '멤버십 혜택',
        desc: '단골 트레이너에게는 특별한 할인과 시즌 한정 메뉴를 제공!',
    },
];

export default function FeaturesSection() {
    return (
        <section id="menu" className={styles.features}>
            <div className={styles.container}>
                <span className={styles.label}>✨ 특별한 경험</span>
                <h2 className={styles.heading}>고라파덕 카페에서만<br />할 수 있는 것들</h2>
                <div className={styles.grid}>
                    {features.map((f, i) => (
                        <div key={i} className={styles.card}>
                            <span className={styles.cardEmoji}>{f.emoji}</span>
                            <h3 className={styles.cardTitle}>{f.title}</h3>
                            <p className={styles.cardDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
