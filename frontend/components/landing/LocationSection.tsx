import Image from 'next/image';
import styles from './LocationSection.module.css';

export default function LocationSection() {
    return (
        <section id="location" className={styles.location}>
            <div className={styles.container}>
                <div className={styles.textArea}>
                    <span className={styles.label}>📍 오시는 길</span>
                    <h2 className={styles.heading}>
                        한강 한가운데서 만나는<br />고라파덕 카페
                    </h2>
                    <p className={styles.desc}>
                        머리가 아플 땐 시원한 강바람이 최고잖아요? 🌊<br />
                        <strong>주소:</strong> 서울 영등포구 여의동 원효대교 바로 밑 강물 위
                    </p>
                    <div className={styles.infoBox}>
                        <div className={styles.infoItem}>
                            <strong>🚣‍♀️ 오시는 길</strong>
                            <p>여의도 한강공원에서 오리배(10분) 또는 자유형(5분) 🏊‍♂️</p>
                        </div>
                        <div className={styles.infoItem}>
                            <strong>🚗 주차안내</strong>
                            <p>원효대교 밑둥에 튜브 주차 가능 (구명조끼 지참 필수)</p>
                        </div>
                    </div>
                </div>
                <div className={styles.imageArea}>
                    <div className={styles.mapWrapper}>
                        <Image
                            src="/landing/map.png"
                            alt="고라파덕 카페 매장 지도 - 원효대교"
                            fill
                            className={styles.mapImage}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
