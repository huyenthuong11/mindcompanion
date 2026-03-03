"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography, TextField, Alert } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import Image from "next/image";
import styles from "./page.module.css";
import api from "../../lib/axios.js";
import { Avatar } from "@mui/material";


export default function NotePage() {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();


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
                        <div className={styles.user}>
                            <Avatar></Avatar> 
                            <span>{user?.username || "Username"}</span> 
                            <div className={styles.sign}> 
                                <a onClick={handleLogout}>Đăng xuất</a>
                            </div>
                        </div>
                    </div>

                    <aside className={styles.sidebar}>
                        <nav>
                            <p onClick={() => router.push("/")}>Home</p>
                            <a onClick={() => router.push("/note")}>Note</a>
                            <p>Library</p>
                            <p>Goal</p>
                            <p>Chatbot</p>
                            <p>Setting</p>
                        </nav>
                    </aside>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.cardGrid}>
                                <div className={styles.cardHeaderStr}>
                                        Tất Cả Ghi Chú
                                    </div>
                                <div className={styles.cardAddButton}>
                                    + Ghi Chú Mới
                                </div>
                                <input
                                    className={styles.search}
                                    placeholder="Tìm kiếm ghi chú..."
                                />
                                <div className={styles.oldNote}>
                                    
                                </div>
                            </div>
                        </div>
                        <div className={styles.cardWide}>
                            Ghi chú và nhật ký
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};
