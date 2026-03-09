"use client";

import styles from "./page.module.css";

export default function AnalyzationPage({avgMood, emotion, avgEnergy, energy, analysis}) {

    return (
        <>
            <div className={styles.analyzeCard}>
                <div className={styles.cardHeader}>
                    Phân tích trạng thái của bạn
                </div>
                <div className={styles.avgMain}>
                    <div className={styles.avgMoodBoard}>
                        <div>
                            Cảm xúc trung bình
                        </div>
                        <div className={styles.moodSc}>
                            <div className = {styles.avgMoodSc}>{avgMood}</div>
                            <div className={styles.finalMoodSc}>/5</div>
                        </div>
                        <div className={styles.emotion}>{emotion}</div>
                        <div className={`${styles['avgMoodIcon']} ${styles['bottom-right1']}`}></div>
                    </div>
                    <div className={styles.avgEnergyBoard}>
                        <div>
                            Năng lượng trung bình
                        </div>
                        <div className={styles.energySc}>
                            <div className = {styles.avgEnergySc}>{avgEnergy}</div>
                            <div className={styles.finalEnergySc}>/5</div>
                        </div>
                        <div className={styles.emotion}>{energy}</div>
                        <div className={`${styles['avgEnergyIcon']} ${styles['bottom-right2']}`}></div>
                    </div>
                </div>
                <div className={styles.analyzeBoardMain}>{analysis}</div>
            </div>
        </>
    )
}