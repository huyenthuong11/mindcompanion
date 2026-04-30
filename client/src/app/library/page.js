"use client";
import { useRouter } from "next/navigation";
import resources from "../../components/resources.json";
import { Avatar } from "@mui/material"; 
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import styles from "./page.module.css";
import Chatbot from "../chatbotPopup/page";

export default function Library() {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    const [activeFilter, setActiveFilter] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!user?.id) {
            return;
        }         
    }, [user?.id]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const filterList = [
        {value: null, label: "Tất cả" },
        {value: "healing_music", label: 'Video âm nhạc' },
        {value: "healing_video", label: 'Video chữa lành' },
        {value: "funny_video", label: 'Video hài' },
        {value: "exercise", label: 'Video bài luyện tập' },
    ];

    const filteredResources = resources
    .filter((item) => !activeFilter || item.type === activeFilter)
    .filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <div className="container">
                <main className="main">
                    <div className="header">
                        <div className="webicon">
                            <div className="logo"></div>
                            <div className="websiteName">Mind Companion</div>
                        </div>
                        <div className="user">
                            <Avatar></Avatar> 
                            <span>{user?.username || "Username"}</span> 
                            <div className="sign"> 
                                <a onClick={handleLogout}>Đăng xuất</a>
                            </div>
                        </div>
                    </div>
        
                    <aside className="sidebar">
                        <nav>
                            <p onClick={() => router.push("/")}>Trang chủ</p>
                            <p onClick={() => router.push("/note")}>Ghi chú</p>
                            <a onClick={() => router.push("/library")}>Thư viện</a>
                            <p onClick={() => router.push("/chatbot")}>Chatbot</p>
                            <p onClick={() => router.push("/setting")}>Cài đặt</p>
                        </nav>
                    </aside>

                    <div className={styles.main}>
                        <div className={styles.header}>
                            THƯ VIỆN VIDEO 
                        </div>
                        <div className={styles.subHeader}>
                            <div>
                                Tìm kiếm:    
                            </div>
                            <input 
                                className={styles.search}
                                placeholder="Tìm kiếm video..."
                                value={search}
                                onChange={(e)=>setSearch(e.target.value)}
                            />
                            <div>Bộ lọc:</div>
                            <div className={styles.filters}>
                                {
                                    filterList.map((filter) =>  (
                                        <span 
                                            key={filter.value} 
                                            className={`${styles.filter} ${activeFilter === filter.value ? styles.filterActive : ""}`}
                                            onClick={() => setActiveFilter(filter.value)}
                                        >
                                            {filter.label}
                                        </span>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className={styles.mainBoard}>
                            {
                                filteredResources.map((item)=>(
                                        <div key={item.id} className={styles.videoCard}>
                                            <iframe
                                                className={styles.video}
                                                src={`https://www.youtube.com/embed/${item.videoId}`}
                                                title={item.title}
                                                allowFullScreen
                                            />
                                            <div className={styles.cardTitle}>
                                                {item.title}
                                            </div>
                                        </div>
                                    )
                                )
                            }
                            <Chatbot/>
                        </div>
                    </div>
                </main>
            </div>        
        </>
    )
}