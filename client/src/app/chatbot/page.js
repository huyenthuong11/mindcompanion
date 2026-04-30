"use client";
import { useState, useRef, useEffect, useContext } from 'react';
import styles from './page.module.css';
import useChatHistory from '../../hook/useChatHistory';
import useChatbot from '../../hook/useChatbot';
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Avatar } from "@mui/material"; 
import useSuggestion from "../../hook/useSuggestion.js";
import api from "../../lib/axios.js";
import MiniMoodRadar from './MiniMoodRadar.js';

export default function Chatbot() {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    const { chatHistory, loading, refreshHistory } = useChatHistory(user?.id, 100);
    const [userMessage, setUserMessage] = useState("");
    const [ newestMessage, setNewestMessage] = useState("");
    const { chatMessage, isBotTyping } = useChatbot(user?.id, newestMessage);
    const [displayMessages, setDisplayMessages] = useState([]);
    const scrollRef = useRef(null);
    const { avgMood, avgEnergy, energy, emotion, 
        analysis, suggestions} = useSuggestion(user?.id);    
    const [scores, setScores] = useState(null);
    const [resourcesSuggestion, setResourcesSuggestion] = useState(null);
    const userId = user?.id;

    useEffect(() => {
        setDisplayMessages(chatHistory);
    }, [chatHistory]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [displayMessages, isBotTyping]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const getMood = async () => {
        try {
            const response = await api.get("/moods/getTodayEntries", {
                params: {userId}
            });
            const scores = response.data.scores;
            setScores(scores);
        } catch (err) {
            console.error("Failed to fetch moods: - page.js:52", err);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!userMessage.trim()) return;

        const optimisticMsg = { 
            id: Date.now(), 
            message: userMessage, 
            role: "user" 
        };
        setDisplayMessages(prev => [...prev, optimisticMsg]);

        setNewestMessage(userMessage);
        setUserMessage("");
    };

    const getResourcesSuggestion = async () => {
        try {
            const res = await api.get("/ai/resourcesSuggestion", {
                params: {userId}
            });
            const data = res.data;
            setResourcesSuggestion(data);  
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(!user?.id) return;
        if (chatMessage) {
            refreshHistory();
        }
    }, [user?.id, chatMessage]);

    useEffect(() => {    
        if(!user?.id) return;   
        getMood();
        getResourcesSuggestion();
    }, [user?.id])

    console.log("tài nguyên: ", resourcesSuggestion);

    return (
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
                        <p onClick={() => router.push("/library")}>Thư viện</p>
                        <a onClick={() => router.push("/chatbot")}>Chatbot</a>
                        <p onClick={() => router.push("/setting")}>Cài đặt</p>
                    </nav>
                </aside>

                <div className={styles.fullPageWrapper}>
                    <aside className={styles.sidePanel}>
                        <div className={styles.miniCard}>
                            <h3>Tâm trạng hiện tại</h3>
                            <MiniMoodRadar avgMood={avgMood} avgEnergy={avgEnergy} scores={scores}/>
                            <p style={{fontSize: '14px', color: '#666'}}>
                                {analysis}
                            </p>
                        </div>
                        <div className={styles.miniCard}>
                            <h3 style={{marginBottom: "10px"}}>Gợi ý cho bạn</h3>
                            <ul style={{listStyle: 'none', padding: 0, fontSize: '14px'}}>
                                <li style={{marginBottom: '10px'}}>{suggestions[0]}</li>
                                <li style={{marginBottom: '10px'}}>{suggestions[1]}</li>
                                <li>{suggestions[2]}</li>
                            </ul>
                        </div>
                    </aside>
                    <div className={styles.chatbotContainer}>
                        <div className={styles.chatWindow}>
                        <div className={styles.chatHeader}>
                            <div className={styles.botInfo}>
                            <div className={styles.botAvatar}></div>
                            <span style={{ fontWeight: 600 }}>Người bạn ảo của bạn - Yên</span>
                            </div>
                        </div>

                        <div className={styles.chatBody} ref={scrollRef}>
                            {displayMessages.map((msg) => (
                            <div key={msg.id|| msg._id} className={`${styles.message} ${msg.role === "bot" ? styles.botMessage : styles.userMessage}`}>
                                {msg.message}
                            </div>
                            ))}
                            {isBotTyping && (
                                <div className={`${styles.message} ${styles.botMessage}`}>
                                    <span className={styles.typingDots}>Yên đang soạn tin nhắn...</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.chatInputArea}>
                            <input 
                            className={styles.inputField}
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Hỏi Mộc..."
                            />
                            <button className={styles.sendBtn} onClick={handleSend}>Gửi</button>
                        </div>
                        </div>
                    </div>
                    <aside className={styles.sidePanel}>
                        <div className={styles.miniCard}>
                            <h3 style={{marginBottom: "10px"}}>Gợi ý cho bạn</h3>
                            {resourcesSuggestion?.length > 0 ? (
                                resourcesSuggestion.map((re) => (
                                    <div className={styles.videoCard} key={re._id}>
                                        <iframe
                                            className={styles.video}
                                            src={`https://www.youtube.com/embed/${re.videoId}`}
                                            title={re.title}
                                            allowFullScreen
                                        />
                                        <div className={styles.cardTitle}>
                                            {re.title}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Đang tìm tài nguyên phù hợp...</p>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}