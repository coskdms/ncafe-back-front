import Image from 'next/image';
import styles from './LocationSection.module.css';

export default function LocationSection() {
    return (
        <section id="location" className={styles.location}>
            <div className={styles.container}>
                <div className={styles.textArea}>
                    <span className={styles.label}>📍 오시는 길</span>
                    <h2 className={styles.heading}>
                        원효대교 위에서 만나는<br />특별한 커피 한 잔
                    </h2>
                    <p className={styles.desc}>
                        탁 트인 한강 뷰와 함께 여유로운 시간을 보내세요.<br />
                        <strong>주소:</strong> 서울특별시 영등포구 여의동 원효대교 중간
                    </p>
                    <div className={styles.infoBox}>
                        <div className={styles.infoItem}>
                            <strong>🕒 영업시간</strong>
                            <p>매일 08:00 - 22:00</p>
                        </div>
                        <div className={styles.infoItem}>
                            <strong>🚗 주차안내</strong>
                            <p>여의도 한강공원 제1주차장 이용 (도보 5분)</p>
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
