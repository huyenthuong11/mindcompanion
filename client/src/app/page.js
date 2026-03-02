"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Avatar } from "@mui/material";

export default function Page({ params: { lang } }) {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    console.log( user?.username);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };
    return (
        <>
            <div className={styles.wrapper}>

                <main className={styles.main}>
                    <div className={styles.header}>
                        <div className={styles.webicon}>
                            <div className={styles.logo}></div>
                            <div className={styles.websiteName}>Mind Companion</div>
                        </div>
                        <input
                            className={styles.search}
                            placeholder="Search..."
                        />

                        {user ? (
                            <div className={styles.user}>
                                <Avatar></Avatar> 
                                <span>{user?.username || "Username"}</span> 
                                <div className={styles.sign}> 
                                    <a onClick={handleLogout}>Đăng xuất</a>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.sign}>
                                <a onClick={() => router.push("/login")}>Đăng Nhập</a>  
                                <a onClick={() => router.push("/register")}>Đăng Ký</a>    
                            </div>
                        )}
                    </div>

                    <aside className={styles.sidebar}>
                        <nav>
                            <p>Home</p>
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