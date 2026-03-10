"use client";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import  useChatHistory  from "../../hook/useChatHistory";
import useChatbot from "../../hook/useChatbot";
import styles from "./page.module.css";
import { Avatar } from "@mui/material"; 
import { useRouter } from "next/navigation";

export default function ChatBot() {
    const { user, logout } = useContext(AuthContext);
    const { chatHistory, loading, refreshHistory } = useChatHistory(user?.id, 50);
    const [userMessage, setUserMessage] = useState("");
    const [ newestMessage, setNewestMessage] = useState("");
    const { chatMessage } = useChatbot(user?.id, newestMessage);
    const router = useRouter();

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!userMessage.trim()) return;
            setNewestMessage(userMessage);
            setUserMessage("");
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    

    useEffect(() => {
        if(!user?.id) return;
        if (chatMessage) {
            refreshHistory();
        }
    }, [user?.id, chatMessage]);

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
                            <p onClick={() => router.push("/library")}>Thư viện</p>
                            <a onClick={() => router.push("/chatbot")}>Chatbot</a>
                            <p onClick={() => router.push("/setting")}>Cài đặt</p>
                        </nav>
                    </aside>

                    <div className={styles.chatbotFrame}>
                        <div className={styles.chatHeader}>
                            <div className={styles.botInfo}>
                                <div className={styles.botAvatar}></div>
                                <div className={styles.botName}>Trò chuyện với Mind Companion AI- Yên</div>
                            </div>
                        </div>
                        <div className={styles.chatMessages}>
                            {   loading
                                ? "Đang tải nội dung cuộc hội thoại..."
                                : chatHistory.map((message) => (
                                    <span
                                        key={message.id}
                                        className={`
                                            ${message.role === "user" 
                                                ? styles.userMessage
                                                : ""
                                            } 
                                            ${message.role === "bot" 
                                                ? styles.aiMessage
                                                : ""
                                            }`}
                                    >
                                        {message.message}
                                    </span>
                                ))    
                            }
                        </div>
                        <textarea
                            className={styles.inputContainer}
                            placeholder="Gõ tin nhắn của bạn..."
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </main>
            </div>
        </>
    )
}