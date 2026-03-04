"use client";

import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography, TextField, Alert } from "@mui/material";
import { Box, display, flex, margin } from "@mui/system";
import Button from "@mui/material/Button";
import Image from "next/image";
import styles from "./page.module.css";
import api from "../../lib/axios.js";
import { Avatar } from "@mui/material";
import LeafIcon from "../../components//LeafIcon"


export default function NotePage() {
    const { user, logout } = useContext(AuthContext);
    const [moods, setMoods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [form, setForm] = useState({
        mood: 3,
        energy: 3,
        note: "",
        tags: [],
    });
    const [index, setIndex] = useState(3);
    
    const [errors, setErrors] = useState({});
    const [mounted, setMounted] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    
    const handleChange = (name, value) => {
        setForm((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };
    
    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const getMood = async () => {
        try {
            const response = await api.get("/moods/get");
            const data = response.data;
            setMoods(data);
        } catch (err) {
            console.error("Failed to fetch moods: - page.js:54", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        getMood();
    }, []);

    if (!mounted) return null;

    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    
    const moodList = [
        { id: 5, icon: '😩', value: 1, label: 'Rất tệ' },
        { id: 4, icon: '☹️', value: 2, label: 'Không vui' },
        { id: 3, icon: '😐', value: 3, label: 'Bình thường' },
        { id: 2, icon: '🙂', value: 4, label: 'Ổn' },
        { id: 1, icon: '😁', value: 5, label: 'Rất vui' },
    ];

    const energyList = [
        {value: 1, label: 'Kiệt quệ' },
        {value: 2, label: 'Hơi mệt' },
        {value: 3, label: 'Bình thường' },
        {value: 4, label: 'Khỏe khoắn' },
        {value: 5, label: 'Tràn đầy'}
    ];

    const currentEnergy = energyList.find(m => m.value === parseInt(index));
    

    const handleSubmit = async (event) => {
        try {
            const response = await api.post("/moods/create", {
                mood: form.mood,
                energy: form.energy,
                note: form.note,
                tags: form.tags,
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage("Ghi chú thành công")
                setForm({
                    mood: 3,
                    energy: 3,
                    note: "",
                    tags: [],
                })
                getMood();
            }
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                server: err.response?.data?.message || "Ghi chú thất bại"
            }));
        } 
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
                            <p onClick={() => router.push("/")}>Trang chủ</p>
                            <a onClick={() => router.push("/note")}>Ghi chú</a>
                            <p onClick={() => router.push("/library")}>Thư viện</p>
                            <p onClick={() => router.push("/chatbot")}>Chatbot</p>
                            <p onClick={() => router.push("/setting")}>Cài đặt</p>
                        </nav>
                    </aside>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                                <Grid item xs={12} md={12} lg={12} xl={12}>
                                    <Box>
                                        <Box
                                            display="flex" 
                                            alignItems="center" 
                                            justifyContent="space-between" 
                                            mb="10px"
                                            marginBottom="20px"
                                            marginTop="20px"
                                        >
                                            <Typography 
                                                as="h1" 
                                                fontSize="30px" 
                                                fontWeight="800" 
                                                mb="5px"
                                                display="flex" 
                                                alignItems="center" 
                                                justifyContent="center"
                                                sx={{
                                                    margin: 0,
                                                    lineHeight: 1
                                                }}
                                                fontFamily= "'Be Vietnam Pro', sans-serif"
                                            >
                                                Tất Cả Ghi Chú
                            
                                            </Typography>
                                            
                                        </Box>

                                        <input
                                            className={styles.search}
                                            placeholder="Tìm kiếm ghi chú..."
                                        />
                                        
                                        <div className={styles.historyBox}> 
                                            { moods.length > 0 ? (
                                                moods.map((mood) => (
                                                    <div className={`${styles['historyCard']} ${styles[`energy-${mood.energy}`]}`} key={mood._id}>
                                                        <div className={styles.historyDay}>{mood.createdAt} </div>
                                                        <div className={styles.historyEmotionIcon}>{mood.mood}</div>
                                                        <div className={styles.historyNote}>{mood.note}</div>
                                                        <div className={styles.tags}>
                                                            {mood.tags?.map((tag, i) =>(
                                                                <span key={i} className={styles.tag}>
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={styles.noHistory}>
                                                    Chưa có ghi chú nào
                                                </div>
                                            )}
                                        </div>
                                    </Box>
                                </Grid>
                            </Grid>
                        </div>
                        <div className={styles.cardWide}>
                            <div className={styles.cardWideHeader}>
                                Ghi Chú Nhỏ Cho Hôm Nay
                                <div className={`${styles['leaf-wrapper1']} ${styles['top-right']}`}></div>
                            </div>
                            <div className={styles.cardWideMainFrame}>
                                <Box marginTop="20px" marginLeft="20px">
                                    <Typography
                                        component="label"
                                        sx={{
                                        fontWeight: "700",
                                        fontSize: "20px",
                                        mb: "10px",
                                        display: "block",
                                        }}
                                    >
                                        Chọn Tâm Trạng
                                    </Typography>
                                    <div className={styles.moodList}>
                                        {
                                            moodList.map((item)=> (
                                                <div
                                                    key={item.value}
                                                    className={form.mood == item.value ? `${styles.iconItem} ${styles.active}` : styles.iconItem}
                                                    onClick={() => handleChange('mood', item.value)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {item.icon}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <Typography
                                        component="label"
                                        sx={{
                                        fontWeight: "700",
                                        fontSize: "20px",
                                        mb: "10px",
                                        display: "block",
                                        }}
                                        marginTop="20px"
                                    >
                                        Mức Năng Lượng
                                    </Typography>
                                    <div style={{ width: '860px', textAlign: 'center', padding: '20px' }}>
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            step="1"
                                            value={form.energy}
                                            onChange={(e) => {
                                                setIndex(e.target.value);
                                                handleChange('energy', parseInt(e.target.value))
                                            }}
                                            style={{ width: '100%', cursor: 'pointer' }}
                                        />
                                        <div className={styles.energyList}>
                                            {
                                                energyList.map((item)=> (
                                                    <div
                                                        key={item.value}
                                                        className={form.energy == item.value ? `${styles.energyItem} ${styles.active}` : styles.energyItem}
                                                    >
                                                        {item.label}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </Box>
                                <div className={`${styles['leaf-wrapper2']} ${styles['bottom-left']}`}></div>
                                <div className={`${styles['leaf-wrapper3']} ${styles['bottom-right1']}`}></div>
                                <div className={`${styles['leaf-wrapper4']} ${styles['bottom-right2']}`}></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};
