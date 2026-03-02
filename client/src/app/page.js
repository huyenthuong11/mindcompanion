"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Page({ params: { lang } }) {
    const router = useRouter();
    return (
        <>
            <div className={styles.wrapper}>

                <main className={styles.main}>
                    <div className={styles.header}>
                        <div className={styles.logo}></div>
                        <input
                            className={styles.search}
                            placeholder="Search..."
                        />

                        <div className={styles.sign}>
                            <a onClick={() => router.push("/login")}>Đăng Nhập</a>  
                            <a onclick="goToRegister()">Đăng Ký</a>    
                        </div>
                    </div>

                    <aside className={styles.sidebar}>
                            <nav>
                                <p>Note</p>
                                <p>Library</p>
                                <p>Goal</p>
                                <p>Chatbot</p>
                                <p>Setting</p>
                            </nav>
                    </aside>

                    <div className={styles.grid}>

                        <div className={styles.cardWide}>Hello</div>
                        <div className={styles.card}>Goal</div>
                        <div className={styles.cardWide}>Chart</div>
                        <div className={styles.card}>Phân tích</div>
                    </div>
                </main>
            </div>
        </>
    )
}