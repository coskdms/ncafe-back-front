'use client';

import React from 'react';
import Image from 'next/image';
import styles from './AboutSection.module.css';
import Button from '@/components/common/Button/Button';
import Link from 'next/link';

export default function AboutSection() {
    return (
        <section className={styles.section}>
            {/* Block 1: Our Story (White Background, Image Left) */}
            <div className={styles.block}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="https://images.unsplash.com/photo-1442975631115-c4f7b05b8a2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Barista pouring coffee"
                        fill
                        className={styles.image}
                        sizes="(max-width: 992px) 100vw, 50vw"
                    />
                </div>
                <div className={styles.contentWrapper}>
                    <span className={styles.label}>브랜드 스토리</span>
                    <h2 className={styles.title}>
                        2024년부터 이어온 <br />
                        완벽한 한 잔의 여정
                    </h2>
                    <p className={styles.description}>
                        커피는 단순한 음료가 아니라 하나의 경험입니다.
                        지속 가능한 농장에서 엄선한 최상급 원두를 소량씩 정성껏 로스팅하여,
                        헌신과 열정이 담긴 이야기를 전합니다.
                        사랑으로 만든 커피의 특별함을 느껴보세요.
                    </p>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>12+</span>
                            <span className={styles.statLabel}>년의 경험</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>50+</span>
                            <span className={styles.statLabel}>종의 원두</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>4.9</span>
                            <span className={styles.statLabel}>평점</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Block 2: Signature Collection (Dark Background, Image Right) */}
            <div className={`${styles.block} ${styles.blockDark}`}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Signature coffee brewing"
                        fill
                        className={styles.image}
                        sizes="(max-width: 992px) 100vw, 50vw"
                    />
                </div>
                <div className={styles.contentWrapper}>
                    <span className={styles.label}>시그니처 컬렉션</span>
                    <h2 className={styles.title}>스페셜티 로스팅의 미학</h2>
                    <p className={styles.description}>
                        전 세계 상위 1%의 스페셜티 원두만을 엄선합니다.
                        에티오피아 예가체프의 화사한 산미부터 콜롬비아 수프레모의 깊고 진한
                        초콜릿 풍미까지, 마스터 로스터가 매일 직접 로스팅하여 각 원두 고유의
                        맛과 향을 최상으로 끌어올립니다.
                    </p>
                    <Link href="/menus">
                        <Button variant="outline" style={{ color: 'white', borderColor: 'white' }}>
                            메뉴 둘러보기
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Block 3: Space & Ambiance (White Background, Image Left) */}
            <div className={styles.block}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Premium cafe interior"
                        fill
                        className={styles.image}
                        sizes="(max-width: 992px) 100vw, 50vw"
                    />
                </div>
                <div className={styles.contentWrapper}>
                    <span className={styles.label}>공간과 분위기</span>
                    <h2 className={styles.title}>도심 속 온전한 휴식처</h2>
                    <p className={styles.description}>
                        몰입과 휴식 모두를 위해 설계된 공간입니다.
                        따뜻한 조명, 편안한 좌석, 그리고 기분 좋은 음악이 당신을 맞이합니다.
                        새로운 영감이 필요하거나 친구와 즐거운 대화를 나누고 싶을 때,
                        NCafe는 당신의 두 번째 집이 되어드립니다.
                    </p>
                    <div className={styles.quote}>
                        &quot;시간이 느리게 흐르고, 커피가 말을 건네는 완벽한 공간.&quot;
                    </div>
                </div>
            </div>
        </section>
    );
}
