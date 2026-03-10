"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import  useChatHistory  from "../../hook/useChatHistory";
import useChatbot from "../../hook/useChatbot";
import styles from "./page.module.css";
import { useState } from "react";

export default function ChatPage() {
    const { user } = useContext(AuthContext);
    const { chatHistory, loading, refreshHistory } = useChatHistory(user?.id, 10);
    const [userMessage, setUserMessage] = useState("");
    const [ newestMessage, setNewestMessage] = useState("");
    const { chatMessage } = useChatbot(user?.id, newestMessage);
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!userMessage.trim()) return;
            setNewestMessage(userMessage);
            setUserMessage("");
            refreshHistory();
        }
    };

    useEffect(() => {
        if(!user?.id) return;
    }, [user?.id, chatMessage]);

    return (
        <>
            <div className={styles.cardHeader}>
                Trò chuyện cùng Yên
            </div>

            <div className={styles.cardMainFrame}>
                <div className={styles.cardMessageFrame}>
                    {   loading
                        ? "Đang tải nội dung cuộc hội thoại..."
                        : chatHistory.map((message) => (
                            <span
                                key={message.id}
                                className={`
                                    ${message.role === "user" 
                                    ? styles.cardUserMessage
                                    : ""
                                } 
                                    ${message.role === "bot" 
                                    ? styles.cardChatbotMessage 
                                    : ""
                                }`}
                            >
                                {message.message}
                            </span>
                        ))    
                    }
                </div>
                <textarea
                    className={styles.userMessageBox}
                    placeholder="Gõ tin nhắn của bạn..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            
        </>
    )
}