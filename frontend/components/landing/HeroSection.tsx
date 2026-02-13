import Image from 'next/image';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
        <section className={styles.hero}>
            <div className={styles.patternBg} />
            <div className={styles.container}>
                <div className={styles.textContent}>
                    <span className={styles.badge}>🦆 포켓몬 테마 카페</span>
                    <h1 className={styles.title}>
                        고라파덕이<br />
                        <span className={styles.highlight}>서빙</span>해주는<br />
                        카페 ☕
                    </h1>
                    <p className={styles.subtitle}>
                        세상에서 가장 귀여운 바리스타 고라파덕이 만들어주는
                        스페셜티 커피와 수제 디저트를 만나보세요!
                    </p>
                    <div className={styles.cta}>
                        <a href="#about" className={styles.ctaButton}>카페 소개 보기 🦆</a>
                        <a href="#menu" className={styles.ctaOutline}>메뉴 구경하기 →</a>
                    </div>
                </div>
                <div className={styles.imageContent}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/landing/psyduck-barista.png"
                            alt="바리스타 고라파덕"
                            width={500}
                            height={500}
                            className={styles.heroImage}
                            priority
                        />
                    </div>
                    <div className={styles.floatingEmoji} style={{ top: '10%', left: '-5%' }}>☕</div>
                    <div className={styles.floatingEmoji} style={{ bottom: '15%', right: '-8%', animationDelay: '1s' }}>🍰</div>
                    <div className={styles.floatingEmoji} style={{ top: '5%', right: '10%', animationDelay: '2s' }}>⭐</div>
                </div>
            </div>
        </section>
    );
}
