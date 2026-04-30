"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { Avatar } from "@mui/material";
import api from "../../lib/axios.js";

export default function Page() {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    const [userProfile, setUserProfile] = useState(null);
    const [editData, setEditData] = useState(null);


    const getUserProfile = async () => {
        try {
            const res = await api.get('/users/profile', {
                params: {
                    userId: user?.id,
                }
            });
            const data = res.data.user;
            setUserProfile(data);
        } catch (error) {
            console.log(error);
        }
    }
    const updateUserProfile = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData();
            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }
            formData.append("fullName", editData.fullName);
            formData.append("dateOfBirth", editData.dateOfBirth);
            formData.append("phoneNumber", editData.phoneNumber);
            formData.append("gender", editData.gender);
            formData.append("username", editData.username);
            await api.patch('/users/updateProfile', {
                userId: user?.id, formData
            });
            getUserProfile();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Đã có lỗi xảy ra khi tải ảnh lên!");
        }
    }
    const handleLogout = () => {
        logout();
        router.push("/login");
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    useEffect(() => {    
        if(!user?.id) return;   
        getUserProfile();
    }, [user?.id]);

    useEffect(() => {
        if (userProfile) {
            setEditData({ ...userProfile });
        }
    }, [userProfile]);
    return(
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
                        <p onClick={() => router.push("/chatbot")}>Chatbot</p>
                        <a onClick={() => router.push("/setting")}>Cài đặt</a>
                    </nav>
                </aside>

                <div className={styles.settingsContainer}>
                    <h2 style={{ marginBottom: '10px' }}>Cài đặt hệ thống</h2>
                    <div className={styles.settingCards}>
                        <section className={styles.settingsCard}>
                            <h3 className={styles.sectionTitle}>Thông tin cá nhân</h3>
                            <div className={styles.settingItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        hidden
                                        onChange={(e) => {
                                            handleFileChange(e);
                                        }}
                                    />
                                    <label htmlFor="avatar-upload">
                                        <Avatar
                                            src={previewUrl || `http://localhost:5000/${user?.avatar}`}
                                            alt= "User Avatar"
                                            sx={{ width: 56, height: 56 }} 
                                        />
                                    </label>
                                </div>
                            </div>
                        </section>
                        <section className={styles.settingsCard}>
                            <h3 className={styles.sectionTitle}>Bảo mật</h3>
                        </section>
                        <section className={styles.settingsCard}>
                            <h3 className={styles.sectionTitle}>Ứng dụng</h3>
                        </section>
                    </div>
                </div>
            </main>    
        </div>
        </>
    )
}