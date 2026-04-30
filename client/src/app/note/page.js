"use client";

import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box, Typography, TextField, Alert } from "@mui/material";
import Button from "@mui/material/Button";
import styles from "./page.module.css";
import api from "../../lib/axios.js";
import DeleteIcon from '@mui/icons-material/Delete';
import  Avatar  from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Chatbot from "../chatbotPopup/page.js";


export default function NotePage() {
    const { user, logout } = useContext(AuthContext);
    const [moods, setMoods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [form, setForm] = useState({
        userId: "",
        mood: 3,
        energy: 3,
        note: "",
        tags: [],
    });
    
    const [errors, setErrors] = useState({});
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
            const response = await api.get("/moods/get", {
                params: {
                    userId: user?.id,
                }
            });
            const data = response.data;
            setMoods(data);
        } catch (err) {
            console.error("Failed to fetch moods: - page.js:52", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        } 
        
        getMood();
    }, [user?.id]);


    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    
    const moodList = [
        { icon: '😩', value: 1, label: 'Rất tệ' },
        { icon: '☹️', value: 2, label: 'Không vui' },
        { icon: '😐', value: 3, label: 'Bình thường' },
        { icon: '🙂', value: 4, label: 'Ổn' },
        { icon: '😁', value: 5, label: 'Rất vui' },
    ];

    const energyList = [
        {value: 1, label: 'Kiệt quệ' },
        {value: 2, label: 'Hơi mệt' },
        {value: 3, label: 'Bình thường' },
        {value: 4, label: 'Khỏe khoắn' },
        {value: 5, label: 'Tràn đầy'}
    ];

    const tagsList = [
        { label: '#giađình', value: 'family', bg: '#E3F2FD', color: '#1E88E5' },       // Xanh dương nhạt
        { label: '#côngviệc', value: 'work', bg: '#F3E5F5', color: '#8E24AA' },     // Tím nhạt
        { label: '#mốiquanhệxungquanh', value: 'relationship', bg: '#E8F5E9', color: '#43A047' }, // Xanh lá nhạt
        { label: '#tiềnbạc', value: 'money', bg: '#FFFDE7', color: '#FBC02D' },       // Vàng nhạt
        { label: '#sứckhỏe', value: 'health', bg: '#FFEBEE', color: '#E53935' },       // Đỏ hồng nhạt
        { label: '#tìnhcảm', value: 'love', bg: '#FCE4EC', color: '#D81B60' },       // Hồng phấn
        { label: '#tươnglai', value: 'future', bg: '#E0F7FA', color: '#00ACC1' }      // Xanh lơ (Cyan)
    ];

    const handleTagClick = (tagValue) => {
        setForm((prev) => {
            const currentTags = prev.tags || []
            const isSelected = currentTags.includes(tagValue);
            if (isSelected) {
                return {...prev, tags: currentTags.filter((t) => t !== tagValue)};
            } else {
                return { ...prev, tags: [...currentTags, tagValue] };
            }
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("USER: - page.js:111", user);
        if (!user || !user.id) {
            console.error("User chưa load xong - page.js:113");
            return;
        }

        try {
            const response = await api.post("/moods/create", {
                userId: user?.id,
                mood: form.mood,
                energy: form.energy,
                note: form.note,
                tags: form.tags,
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage("Ghi chú thành công")
                setForm({
                    userId: "",
                    mood: 3,
                    energy: 3,
                    note: "",
                    tags: [],
                })
                getMood();
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                server: err.response?.data?.message || "Ghi chú thất bại"
            }));
        } 
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/moods/delete/${id}`, {
                data: {
                    userId: user?.id
                }
            })
            console.log(id);
            if (response.status === 200 || response.status === 201) {
                getMood();
            }
            
        } catch (error) {
            console.error("fail deleted - page.js:159", error);
        }
    }


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
                            <a onClick={() => router.push("/note")}>Ghi chú</a>
                            <p onClick={() => router.push("/library")}>Thư viện</p>
                            <p onClick={() => router.push("/chatbot")}>Chatbot</p>
                            <p onClick={() => router.push("/setting")}>Cài đặt</p>
                        </nav>
                    </aside>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                Tất Cả Ghi Chú
                            </div>
                            <div className={styles.historyBox}>
                                { moods.length > 0 ? (
                                    moods.map((mood) => (
                                        <div className={`${styles['historyCard']} ${styles[`energy-${mood.energy}`]}`} key={mood._id}> 
                                            <div className={styles.historyDay}>
                                                {new Date(mood.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className={styles.deleteButton}>
                                                <IconButton
                                                    onClick={() => handleDelete(mood._id)}
                                                    size="small"
                                                    sx={{ width: 10, height: 10, color: "error.main" }}
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </div>
                                            <div className={styles.historyEmotionIcon}>
                                                {moodList.find(m => m.value === mood.mood)?.icon || '😐'}
                                            </div>
                                            <div className={styles.historyNote}>
                                                {mood.note}
                                            </div>
                                            <div className={styles.tags}>
                                                { mood.tags?.slice(0, 2).map((tag, i) => {
                                                    const tagConfig = tagsList.find(t => t.value === tag);
                                                    return (
                                                        <span 
                                                            key={i} 
                                                            className={styles.tag} 
                                                            style={{
                                                                '--bg-color': tagConfig?.bg,
                                                                '--text-color': tagConfig?.color
                                                            }}
                                                        >
                                                            {tagConfig?.label || `#${tag}`}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noHistory}>
                                        Chưa có ghi chú nào
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.cardWide}>
                            <div className={styles.cardWideHeader}>
                                Ghi Chú Nhỏ Cho Hôm Nay
                                <div className={`${styles['leaf-wrapper1']} ${styles['top-right']}`}></div>
                            </div>
                            <div className={styles.cardWideMainFrame}>
                                <Box sx={{ position: 'relative', zIndex: 5, mt: 2, px: 3}}>
                                    <Box marginTop="20px">
                                        <Typography
                                            component="label"
                                            sx={{
                                            fontWeight: "700",
                                            fontSize: "clamp(17px, 1.3vw, 30px)",
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
                                            fontSize: "clamp(17px, 1.3vw, 30px)",
                                            mb: "10px",
                                            display: "block",
                                            }}
                                            marginTop="25px"
                                        >
                                            Mức Năng Lượng
                                        </Typography>
                                        <div className={styles.energySlider}>
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                step="1"
                                                value={form.energy}
                                                onChange={(e) => {
                                                    handleChange('energy', Number(e.target.value))
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
                                        <Typography
                                            component="label"
                                            sx={{
                                            fontWeight: "700",
                                            fontSize: "clamp(17px, 1.5vw, 30px)",
                                            mb: "10px",
                                            display: "block",
                                            }}
                                            marginTop="20px"
                                        >
                                            Tags
                                        </Typography>
                                        <div className={styles.tags}>
                                            {
                                                tagsList.map((item)=> {
                                                    const isActive = form.tags.includes(item.value);
                                                        return (
                                                            <div
                                                                key={item.value}
                                                                className={`${styles.tag} ${isActive ? styles.tagActive : ""}`}
                                                                onClick={() => handleTagClick(item.value)}
                                                                style={{ 
                                                                    cursor: 'pointer',
                                                                    opacity: isActive ? 0.4 : 1,
                                                                    '--bg-color': item.bg,
                                                                    '--text-color': item.color
                                                                }}
                                                            >
                                                                {item.label}
                                                            </div>
                                                        )
                                                })
                                            }
                                        </div>
                                        <div className={styles.noteBox}>
                                            <TextField
                                                required
                                                fullWidth multiline rows={5}
                                                placeholder="Ghi lại hôm nay của bạn..."
                                                variant="standard"
                                                color="#0e0e0ef3"
                                                sx={{
                                                    borderRadius:"20px",
                                                    width: "100%",
                                                    margin: 0,
                                                    "& .MuiInputBase-root": {
                                                        padding: "clamp(8px, 1.2vw, 16px)",
                                                        fontSize: "clamp(12px, 1.2vw, 15px)"
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        fontSize: "clamp(12px, 1.2vw, 15px)"
                                                    },
                                                     "& .MuiInput-underline:before": {
                                                        borderBottom: "none"
                                                        },

                                                        "& .MuiInput-underline:after": {
                                                        borderBottom: "none"
                                                        },

                                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                                                        borderBottom: "none"
                                                    }
                                                }}
                                                value={form.note}
                                                onChange={(e) => {
                                                    handleChange('note', e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div className={styles.saveNoteButton}>
                                            <Box mt={3} display="flex" alignItems="center" gap={2} marginBottom="15px">
                                                <Button 
                                                    variant="contained" 
                                                    onClick={handleSubmit}
                                                    sx={{ 
                                                        bgcolor: '#093149', 
                                                        borderRadius: '20px', 
                                                        px: 4, 
                                                        py: 1,
                                                        '&:hover': { bgcolor: '#496679' } 
                                                    }}
                                                >
                                                    Lưu Nhật Ký
                                                </Button>
                                                {successMessage && <Alert severity="success" sx={{ py: 0, borderRadius: '15px' }}>{successMessage}</Alert>}
                                            </Box>
                                        </div>
                                        
                                    </Box>
                                </Box>
                                
                                <div className={`${styles['leaf-wrapper2']} ${styles['bottom-left']}`}></div>
                                <div className={`${styles['leaf-wrapper3']} ${styles['bottom-right1']}`}></div>
                                <div className={`${styles['leaf-wrapper4']} ${styles['bottom-right2']}`}></div>
                            </div>
                        </div>
                        <Chatbot/>
                    </div>
                </main>
            </div>
        </>
    );
};
