"use client";

import styles from "./page.module.css";

export default function SuggestionPage({suggestions, isLoading}) {

    return (
        <>
            <div className={styles.cardHeader}>
                Gợi ý hoạt động
            </div>

            <div className={styles.cardMainFrame}>
                <div className={styles.cardAvatar}>
                    <div className={styles.cardAvatarImg}></div>
                </div>
                <div className={styles.cardMainContext}>

                    {isLoading
                    ? "Đang phân tích tâm trạng..."
                    : suggestions?.map((s, index) => (
                        <div key={index}>• {s}</div>
                    ))}
                </div>
            </div>
        </>
    )
}