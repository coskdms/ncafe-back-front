import Image from 'next/image';
import styles from './AboutSection.module.css';

export default function AboutSection() {
    return (
        <section id="about" className={styles.about}>
            <div className={styles.container}>
                <div className={styles.imageArea}>
                    <Image
                        src="/landing/psyduck-cafe.png"
                        alt="카페에서 커피 마시는 고라파덕"
                        width={450}
                        height={450}
                        className={styles.aboutImage}
                    />
                </div>
                <div className={styles.textArea}>
                    <span className={styles.label}>🐤 우리 카페 이야기</span>
                    <h2 className={styles.heading}>
                        고라파덕과 함께하는<br />특별한 카페 시간
                    </h2>
                    <p className={styles.desc}>
                        머리가 아파도 커피 한 잔이면 괜찮아지는 고라파덕!
                        최고급 스페셜티 원두와 정성 가득한 수제 디저트로
                        여러분의 하루를 더 달콤하게 만들어 드려요.
                    </p>
                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>☕</span>
                            <div>
                                <strong>스페셜티 원두</strong>
                                <p>고라파덕이 엄선한 최상급 원두만 사용해요</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>🍰</span>
                            <div>
                                <strong>수제 디저트</strong>
                                <p>매일 아침 직접 만드는 신선한 디저트!</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>🐤</span>
                            <div>
                                <strong>고라파덕 서빙</strong>
                                <p>세상에서 가장 귀여운 바리스타가 서빙해줘요</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
