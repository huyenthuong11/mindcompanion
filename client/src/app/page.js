"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Avatar } from "@mui/material";

export default function Page({ params: { lang } }) {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    const time = new Date();
    console.log( user?.username, time);
    
    const morningGreetings = [
        {
            "en": `Good morning ${user?.username || "my friend"}. Did you have a nice dream last night?`,
            "vi": `Chào buổi sáng ${user?.username || 'bạn của tớ'}. Tối qua cậu mơ đẹp chứ?`
        },
        {
            "en": 'Hi there! Ready to conquer the day?',
            "vi": 'Chào cậu! Sẵn sàng chinh phục ngày mới chưa?'
        },
        {
            "en": 'Already awake? Wishing you a day full of peace and joy.',
            "vi": 'Dậy rồi à? Chúc cậu một ngày ít muộn phiền và thật nhiều bình yên nhé.'
        },
        {
            "en": 'Này ! If you feel tired today, just take a break. I will be here waiting for you.',
            "vi": 'Này ${user?.name || "cậu ơi"}, hôm nay nếu thấy mệt quá thì cứ nghỉ một chút, tớ vẫn đợi ở đây.'
        },
        {
            "en": "Let's make today a memorable one together, even if it's just small moments of joy.",
            "vi": "Cùng tớ tạo nên một ngày thật đáng nhớ nhé, dù chỉ là những niềm vui nhỏ nhặt nhất thôi."
        },
        {
            "en": `It's morning already, ${user?.name || "my friend"}. I just brewed a virtual cup of tea, would you like to have a sip for a fragrant day ahead?`,
            "vi": `Sáng rồi này ${user?.name || "bạn ơi"}, Tớ vừa pha một tách trà ảo đây, mời cậu một ngụm cho ngày mới thật thơm nhé!`
        },
        {
            "en": `Have a good day, ${user?.name || "my friend"}. Let's start a new day with a light heart together.`,
            "vi": 'Ngày mới an lành, ${user?.name || "bạn của tớ"}. Mình cùng bắt đầu lại một trang mới thật nhẹ nhàng nhé.'
        }
    ];

    const afternoonGreetings = [
        {
            "en": `Good afternoon ${user?.username || "my friend"}. How's your day going so far?`,
            "vi": `Chào buổi chiều ${user?.username || 'bạn của tớ'}. Hôm nay của cậu thế nào rồi?`
        },
        {
            "en": "Good afternoon! Hope this cup of tea or coffee helps you feel more alert and relaxed.",
            "vi": 'Chào buổi chiều! Hy vọng tách trà hoặc cà phê lúc này sẽ giúp tâm trí cậu thêm tỉnh táo và thư thái.'
        },
        {
            "en": `Hey ${user?.username || "my friend"}! If you're feeling a bit tired this afternoon, how about taking a short break? Maybe a quick walk or some stretching could help refresh your mind.`,
            "vi": `${user?.username || "bạn"} ơi! Nếu chiều nay thấy hơi mệt, sao không thử nghỉ ngơi một chút nhỉ? Đi bộ nhanh hoặc vài động tác giãn cơ có thể giúp đầu óc cậu tỉnh táo hơn đấy.`
        },
        {
            "en": `${user?.username || "my friend"}, It's already afternoon. Take a moment to appreciate the beauty of this day.`,
            "vi": `Này ${user?.username || "bạn"}! Buổi chiều đã đến rồi. Hãy dành một chút thời gian để ngắm nhìn vẻ đẹp của ngày hôm nay nhé.`
        }
    ]

    const eveningGreetings = [
        {
            "en": `Good evening ${user?.username || "my friend"}! Let me help you turn off the noise in your head. Let's enjoy this peaceful moment together.`,
            "vi": `Chào buổi tối ${user?.username || "bạn tớ"}! Để tớ tắt bớt những suy nghĩ ồn ào trong đầu cậu nhé, mình cùng tận hưởng sự yên tĩnh này thôi.`
        },
        {
            "en": `Hi ${user?.username || "my friend"}! I just lit a virtual candle here, hoping its gentle light will warm your heart after a long day.`,
            "vi": 'Chào ${user?.username || "bạn"}! Tớ vừa thắp một ngọn nến ảo ở đây, hy vọng ánh sáng dịu dàng này sẽ sưởi ấm tâm hồn cậu sau một ngày dài.',
        },
        {
            "en": 'Hey, if today has been a tough one, just tell me about it. I will keep secret for you.',
            "vi": 'Này, nếu hôm nay có chuyện gì không vui, cứ kể cho tớ nghe rồi hãy đi ngủ nhé. Tớ sẽ giữ kín chúng cho cậu.'
        },
        {
            "en": `It's evening already, ${user?.username || "my friend"}. Let's take a deep breath together and let go of all the stress from the day.`,
            "vi": `Buổi tối đã đến rồi, ${user?.username || "bạn"}. Hãy cùng nhau hít thở sâu và buông bỏ hết những căng thẳng của ngày hôm nay nhé.`
        },
        {
            "en": "Thank you for being so patient and persistent until this moment. You've done a great job. Now, close your eyes and rest.",
            "vi": 'Cảm ơn cậu vì đã kiên trì đến tận giờ phút này. Cậu làm tốt lắm, giờ thì nhắm mắt lại và nghỉ ngơi thôi nào'
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
                            <p onClick={() => router.push("/")}>Home</p>
                            <p onClick={() => router.push("/note")}>Note</p>
                            <p>Library</p>
                            <p>Goal</p>
                            <p>Chatbot</p>
                            <p>Setting</p>
                        </nav>
                    </aside>

                    <div className={styles.grid}>
                        <div className={styles.cardWide}>{getGreeting()?.vi}</div>
                        <div className={styles.card}>Goal</div>
                        <div className={styles.cardWide}>Chart</div>
                        <div className={styles.card}>Phân tích</div>
                    </div>
                </main>
            </div>
        </>
    )
}