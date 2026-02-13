import React from 'react';
import { Coffee, Award, Users } from 'lucide-react';
import styles from './FeaturesSection.module.css';

export default function FeaturesSection() {
    const features = [
        {
            icon: <Coffee size={32} />,
            title: "프리미엄 원두",
            description: "지속 가능한 농장에서 수확한 최상급 원두만을 사용합니다."
        },
        {
            icon: <Users size={32} />,
            title: "전문 바리스타",
            description: "숙련된 바리스타가 섬세한 기술로 완벽한 맛을 추출합니다."
        },
        {
            icon: <Award size={32} />,
            title: "검증된 맛",
            description: "2024년부터 커피 맛과 서비스의 우수성을 인정받고 있습니다."
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>NCafe를 선택해야 하는 이유</h2>
                    <p className={styles.subtitle}>
                        정성을 다해 내린 한 잔의 커피로 최고의 경험을 선사합니다.
                    </p>
                </div>
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                {feature.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
