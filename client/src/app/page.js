"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Avatar } from "@mui/material";
import Suggestion from "./suggestion/page.js";
import MoodChart from "./chart/page.js";

export default function Page() {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    const time = new Date();
    
    console.log( user?.username, time);
    
    const morningGreetings = [
        {
            "en": `Good morning ${user?.username || "my friend"}.\nDid you have a nice dream last night?`,
            "vi": `Chào buổi sáng ${user?.username || 'bạn của tớ'}.\nTối qua cậu mơ đẹp chứ?`
        },
        {
            "en": `Hi ${user?.username || "there"}!\nReady to conquer the day?`,
            "vi": `Chào ${user?.username || "cậu"}!\nSẵn sàng chinh phục ngày mới chưa?`
        },
        {
            "en": 'Already awake?\nWishing you a day full of peace and joy.',
            "vi": 'Dậy rồi à?\nChúc cậu một ngày ít muộn phiền và thật nhiều bình yên nhé.'
        },
        {
            "en": `Hey ${user?.username || "my friend"}!\nIf you feel tired today, just take a break. I will be here waiting for you.`,
            "vi": `Này ${user?.username || "cậu ơi"}.\nNếu hôm nay thấy mệt quá thì cứ nghỉ một chút, tớ vẫn đợi ở đây.`
        },
        {
            "en": "Let's make today a memorable one together,\neven if it's just small moments of joy.",
            "vi": "Cùng tớ tạo nên một ngày thật đáng nhớ nhé,\ndù chỉ là những niềm vui nhỏ nhặt nhất thôi."
        },
        {
            "en": `It's morning already, ${user?.username || "my friend"}.\nI just brewed a virtual cup of tea, would you like to have a sip for a fragrant day ahead?`,
            "vi": `Sáng rồi này ${user?.username || "bạn ơi"}.\nTớ vừa pha một tách trà ảo đây, mời cậu một ngụm cho ngày mới thật thơm nhé!`
        },
        {
            "en": `Have a good day, ${user?.username || "my friend"}.\nLet's start a new day with a light heart together.`,
            "vi": `Ngày mới an lành, ${user?.username || "bạn của tớ"}.\nMình cùng bắt đầu lại một trang mới thật nhẹ nhàng nhé.`
        }
    ];

    const afternoonGreetings = [
        {
            "en": `Good afternoon ${user?.username || "my friend"}.\nHow's your day going so far?`,
            "vi": `Chào buổi chiều ${user?.username || 'bạn của tớ'}.\nHôm nay của cậu thế nào rồi?`
        },
        {
            "en": "Good afternoon!\nHope this cup of tea or coffee helps you feel more alert and relaxed.",
            "vi": 'Chào buổi chiều!\nHy vọng tách trà hoặc cà phê lúc này sẽ giúp tâm trí cậu thêm tỉnh táo và thư thái.'
        },
        {
            "en": `Hey ${user?.username || "my friend"}!\nIf you're feeling a bit tired this afternoon, how about taking a short break? Maybe a quick walk or some stretching could help refresh your mind.`,
            "vi": `${user?.username || "Cậu"} ơi!\nNếu chiều nay thấy hơi mệt, sao không thử nghỉ ngơi một chút nhỉ? Đi bộ nhanh hoặc vài động tác giãn cơ có thể giúp đầu óc cậu tỉnh táo hơn đấy.`
        },
        {
            "en": `${user?.username || "my friend"}!\nIt's already afternoon. Take a moment to appreciate the beauty of this day.`,
            "vi": `Này ${user?.username || "bạn"}!\nBuổi chiều đã đến rồi. Hãy dành một chút thời gian để ngắm nhìn vẻ đẹp của ngày hôm nay nhé.`
        }
    ]

    const eveningGreetings = [
        {
            "en": `Good evening ${user?.username || "my friend"}!\nLet me help you turn off the noise in your head. Let's enjoy this peaceful moment together.`,
            "vi": `Chào buổi tối ${user?.username || "bạn tớ"}!\nĐể tớ tắt bớt những suy nghĩ ồn ào trong đầu cậu nhé, mình cùng tận hưởng sự yên tĩnh này thôi.`
        },
        {
            "en": `Hi ${user?.username || "my friend"}!\nI just lit a virtual candle here, hoping its gentle light will warm your heart after a long day.`,
            "vi": `Chào ${user?.username || "bạn"}!\nTớ vừa thắp một ngọn nến ảo ở đây, hy vọng ánh sáng dịu dàng này sẽ sưởi ấm tâm hồn cậu sau một ngày dài.`,
        },
        {
            "en": 'Hey, if today has been a tough one, just tell me about it.\nI will keep secret for you.',
            "vi": 'Này, nếu hôm nay có chuyện gì không vui, cứ kể cho tớ nghe rồi hãy đi ngủ nhé.\nTớ sẽ giữ kín chúng cho cậu.'
        },
        {
            "en": `It's evening already, ${user?.username || "my friend"}.\nLet's take a deep breath together and let go of all the stress from the day.`,
            "vi": `Buổi tối đã đến rồi, ${user?.username || "bạn"}.\nHãy cùng nhau hít thở sâu và buông bỏ hết những căng thẳng của ngày hôm nay nhé.`
        },
        {
            "en": "Thank you for being so patient and persistent until this moment.\nYou've done a great job. Now, close your eyes and rest.",
            "vi": 'Cảm ơn cậu vì đã kiên trì đến tận giờ phút này.\nCậu làm tốt lắm, giờ thì nhắm mắt lại và nghỉ ngơi thôi nào'
        }
    ]
    const randomMorningGreeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
    const randomAfternoonGreeting = afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
    const randomEveningGreeting = eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];

    const getGreeting = () => {
        if (time.getHours() < 12) {
            return randomMorningGreeting
        } else if (time.getHours() < 18) {
            return randomAfternoonGreeting
        } else {
            return randomEveningGreeting
        }
    }

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    
    return (
        <>
            <div className="container">
                <main className="main">
                    <div className="header">
                        <div className="webicon">
                            <div className="logo"></div>
                            <div className="websiteName">Mind Companion</div>
                        </div>

                        {user ? (
                            <div className="user">
                                <Avatar></Avatar> 
                                <span>{user?.username || "Username"}</span> 
                                <div className="sign"> 
                                    <a onClick={handleLogout}>Đăng xuất</a>
                                </div>
                            </div>
                        ) : (
                            <div className="sign">
                                <a onClick={() => router.push("/login")}>Đăng Nhập</a>  
                                <a onClick={() => router.push("/register")}>Đăng Ký</a>    
                            </div>
                        )}
                    </div>

                    <aside className="sidebar">
                        { user ? (
                            <nav>
                                <a onClick={() => router.push("/")}>Trang chủ</a>
                                <p onClick={() => router.push("/note")}>Ghi chú</p>
                                <p onClick={() => router.push("/library")}>Thư viện</p>
                                <p onClick={() => router.push("/chatbot")}>Chatbot</p>
                                <p onClick={() => router.push("/setting")}>Cài đặt</p>
                            </nav>
                        ) : (
                            <nav>
                                <p>Trang chủ</p>
                                <p>Ghi chú</p>
                                <p>Thư viện</p>
                                <p>Chatbot</p>
                                <p>Cài đặt</p>
                            </nav>
                        )}
                    </aside>

                    <div className={styles.grid}>
                        <div className={styles.cardWide}>{getGreeting()?.vi}</div>
                        <div className={styles.cardSuggest}><Suggestion/></div>
                        <div className={styles.cardChart}><MoodChart/></div>
                        <div className={styles.card}>Phân tích</div>
                        <div className={styles.card}>Goal</div>
                    </div>
                </main>
            </div>
        </>
    )
}