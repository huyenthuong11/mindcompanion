"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { Avatar, TextField, Button, Alert } from "@mui/material";
import api from "../../lib/axios.js";
import { Box, Grid, Typography } from "@mui/material";
import Select from "react-select";
import { format } from "date-fns";
export default function Page() {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [editData, setEditData] = useState({
        fullName: "",
        gender: "Don't want to reveal",
        phoneNumber: "",
        dateOfBirth: "", 
        userId: user?.id
    });
    const [piErrors, setPiErrors] = useState({
        server: ""
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [pwErrors, setPwErrors] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        server: ""
    });
    

    const genderOptions = [
        { value: "male", label: "Nam" },
        { value: "female", label: "Nữ" }, 
        { value: "other", label: "Khác" },
        { value: "Don't want to reveal", label: "Không muốn tiết lộ" },  
    ];

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
        e.preventDefault();
        try {
            const formData = new FormData();
            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }
            formData.append("userId", user?.id);
            formData.append("fullName", editData.fullName);
            formData.append("dateOfBirth", editData.dateOfBirth);
            formData.append("phoneNumber", editData.phoneNumber);
            formData.append("gender", editData.gender);
            await api.patch('/users/updateProfile', formData);
            alert("Cập nhật thành công");
            getUserProfile();
        } catch (error) {
            setPiErrors({ server: error.response?.data?.message || "Đã có lỗi xảy ra khi tải ảnh lên!" });
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
    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setPasswordData(prev => ({
            ...prev, 
            [name]: value
        }));
    };
    const handleChangePassword = async (e) => {
        e.preventDefault();
        const newErrors = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            server: ""
        };
        if (!passwordData.oldPassword) {
            newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
            setPwErrors(newErrors);
            return;
        }
        if (!passwordData.newPassword) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
            setPwErrors(newErrors);
            return;
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu có nhiều hơn 6 ký tự";
            setPwErrors(newErrors);
            return;
        }        
        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng nhập mật khẩu xác nhận";
            setPwErrors(newErrors);
            return;
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
            setPwErrors(newErrors);
            return;
        }
        if (passwordData.oldPassword === passwordData.newPassword) {
            newErrors.newPassword = "Mật khẩu mới không được trùng với mật khẩu cũ";
            setPwErrors(newErrors);
            return;
        }
        try {
            await api.patch('/users/change-password', {
                userId: user?.id,
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            alert("Đổi mật khẩu thành công!");
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setPwErrors({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
                server: ""
            });
        } catch (error) {
            newErrors.oldPassword = error.response?.data?.message;
            setPwErrors(newErrors);
        }
    }
    useEffect(() => {    
        if(!user?.id) return;   
        getUserProfile();
    }, [user?.id]);

    useEffect(() => {
        if (userProfile) {
            setEditData({
                fullName: userProfile.fullName || "",
                gender: userProfile.gender || "Don't want to reveal",
                phoneNumber: userProfile.phoneNumber || "",
                dateOfBirth: userProfile.dateOfBirth || ""
            });
        }
    }, [userProfile]);
    
    useEffect(()=>{
        return ()=>{
            if(previewUrl){
                URL.revokeObjectURL(previewUrl)
            }
        }
    },[previewUrl])

    useEffect(() => {
        if (piErrors.server) {
            const timer = setTimeout(() => {
                setPiErrors({ server: "" });
            }, 3000);

            return () => clearTimeout(timer);
        }
        if (pwErrors.server || pwErrors.oldPassword || pwErrors.newPassword || pwErrors.confirmPassword) {
            const timer = setTimeout(() => {
                setPwErrors({ 
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                    server: ""
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [piErrors.server, pwErrors.server, 
        pwErrors.oldPassword, pwErrors.newPassword, 
        pwErrors.confirmPassword]);

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
                        {userProfile?.avatar ? (
                            <Avatar 
                                src={ `http://localhost:5000/${userProfile?.avatar}`}
                                alt="User Avatar"
                                sx={{ width: 40, height: 40, cursor: 'pointer', ml: 2, background: 'white',
                                            border: '0.1px solid #083d5e',
                                            padding: '3px'}}
                            />
                        ) : (
                            <Avatar sx={{ width: 40, height: 40, cursor: 'pointer', ml: 2, border: '0.5px solid #083d5e', padding: '3px' }} />
                        )}
                        <span>{userProfile?.fullName || userProfile?.username || "Username"}</span> 
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
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    hidden
                                    onChange={(e) => {
                                        handleFileChange(e);
                                    }}
                                />
                                <label htmlFor="avatar-upload">
                                    {previewUrl ? (
                                        <Avatar
                                            src={previewUrl}
                                            alt= "User Avatar"
                                            sx={{ width: 120, height: 120, cursor: 'pointer', mb: 2, border: '1px solid #083d5e', padding: '10px' }} 
                                        />
                                    ) : userProfile?.avatar ? (
                                        <Avatar
                                            src={ `http://localhost:5000/${userProfile?.avatar}` }
                                            alt="User Avatar"
                                            sx={{ width: 120, height: 120, cursor: 'pointer', mb: 2, border: '1px solid #083d5e', padding: '10px' }} 
                                        />
                                    ) : (
                                        <Avatar sx={{ width: 120, height: 120, cursor: 'pointer', mb: 2, border: '1px solid #083d5e', padding: '10px' }} />
                                    )}
                                </label>
                                <div className={styles.cardMainContext}>
                                    <Grid 
                                        container 
                                        justifyContent="center" 
                                        alignItems="center" 
                                        spacing={2}
                                        sx={{ width: '97%', m: 0 }}
                                    >
                                        <Grid item xs={12} md={12} lg={12} xl={12} sx={{ width: '97%', m: 0 }}>
                                            <Box component="form" onSubmit={updateUserProfile} noValidate sx={{ width: '100%', mt: 1 }}>
                                                {piErrors.server && (
                                                    <Alert severity="error" sx={{ mb: 2 }}>
                                                        {piErrors.server}
                                                    </Alert>
                                                )}
                                                <Box>
                                                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap: '20px', marginBottom: '15px' }}>
                                                        <Box mb={1} style={{ width: '60%' }}>
                                                            <Typography
                                                                component="label"
                                                                sx={{
                                                                    fontWeight: "500",
                                                                    fontSize: "14px",
                                                                    display: "block",
                                                                }}
                                                            >
                                                                Họ và tên
                                                            </Typography>
                                                            <TextField
                                                                required
                                                                fullWidth
                                                                size="small"
                                                                name="fullName"
                                                                type="fullName"
                                                                id="fullName"
                                                                autoComplete="fullName"
                                                                InputProps={{
                                                                    style: { borderRadius: 8 },
                                                                }}
                                                                value={editData.fullName || userProfile?.fullName || ""}
                                                                onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                                                            />
                                                        </Box>
                                                        <Box mb={1} style={{ flex: 1 }}>
                                                            <Typography
                                                                component="label"
                                                                sx={{
                                                                    fontWeight: "500",
                                                                    fontSize: "14px",
                                                                    display: "block",
                                                                }}
                                                            >
                                                                Giới tính
                                                            </Typography>
                                                            <Select
                                                                options={genderOptions}
                                                                placeholder="Chọn giới tính"
                                                                fullwidth
                                                                size="small"
                                                                name="gender"
                                                                type="gender"
                                                                id="gender"
                                                                InputProps={{
                                                                    style: { borderRadius: 8 },
                                                                }}
                                                                value={genderOptions.filter(opt => opt.value === (editData.gender || userProfile?.gender))}
                                                                onChange={(selected) => setEditData({ ...editData, gender: selected.value })}
                                                            />
                                                        </Box>
                                                    </div>
                                                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap: '20px', marginBottom: '15px' }}>
                                                        <Box mb={1} style={{ width: '50%' }}>
                                                            <Typography
                                                                component="label"
                                                                sx={{
                                                                    fontWeight: "500",
                                                                    fontSize: "14px",
                                                                    display: "block",
                                                                }}
                                                            >
                                                                Ngày sinh
                                                            </Typography>
                                                            <TextField
                                                                required
                                                                fullWidth
                                                                size="small"
                                                                name="dateOfBirth"
                                                                type="date"
                                                                id="dateOfBirth"
                                                                InputProps={{
                                                                    style: { borderRadius: 8 },
                                                                }}
                                                                value={
                                                                    editData.dateOfBirth
                                                                    ? format(new Date(editData.dateOfBirth), 'yyyy-MM-dd')
                                                                    : userProfile?.dateOfBirth
                                                                    ? format(new Date(userProfile?.dateOfBirth), 'yyyy-MM-dd') 
                                                                    : ""
                                                                }
                                                                onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                                                            />
                                                        </Box>
                                                        <Box mb={1} style={{ width: '45%' }}>
                                                            <Typography
                                                                component="label"
                                                                sx={{
                                                                    fontWeight: "500",
                                                                    fontSize: "14px",
                                                                    display: "block",
                                                                }}
                                                            >
                                                                Số điện thoại
                                                            </Typography>
                                                            <TextField
                                                                required
                                                                fullWidth
                                                                size="small"
                                                                name="phoneNumber"
                                                                type="phoneNumber"
                                                                id="phoneNumber"
                                                                autoComplete="phoneNumber"
                                                                inputProps={{
                                                                    maxLength: 10,
                                                                    style: { borderRadius: 8 },
                                                                }}
                                                                value={editData.phoneNumber || userProfile?.phoneNumber || ""}
                                                                onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                                                            />
                                                        </Box>
                                                    </div>
                                                </Box>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    sx={{ 
                                                        width: "40%",
                                                        mt: 3, 
                                                        mb: 2, 
                                                        borderRadius: 8, 
                                                        backgroundColor: "#083d5e",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Lưu thay đổi
                                                </Button>
                                                </div>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </section>
                        <section className={styles.settingsCard}>
                            <h3 className={styles.sectionTitle}>Tài khoản & Bảo mật</h3>
                            <div className={styles.settingItem}>
                                <div 
                                    className={styles.cardMainContext}
                                    style={{ 
                                        justifyContent: 'center',
                                        marginTop: '20px'
                                     }}>
                                <Grid 
                                    container 
                                    justifyContent="center" 
                                    alignItems="center" 
                                    spacing={2} 
                                    sx={{ width: '97%', m: 0 }}
                                >
                                    <Grid item xs={12} md={12} lg={12} xl={12} sx={{ width: '97%', marginTop: '10px' }}>
                                        <Box component="form" onSubmit={handleChangePassword} noValidate sx={{ width: '100%', mt: 2 }}>
                                            {pwErrors.server && (
                                                <Alert severity="error" sx={{ mb: 2 }}>
                                                    {pwErrors.server}
                                                </Alert>
                                            )}
                                            <Box mb={3}>
                                                <Typography
                                                    component="label"
                                                    sx={{
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        display: "block",
                                                    }}
                                                >
                                                    Mật khẩu hiện tại
                                                </Typography>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    size="small"
                                                    name="oldPassword"
                                                    type="password"
                                                    id="oldPassword"
                                                    autoComplete="oldPassword"
                                                    InputProps={{
                                                        style: { borderRadius: 8 },
                                                    }}
                                                    value={passwordData.oldPassword}
                                                    onChange={handlePasswordChange}
                                                    error={!!pwErrors.oldPassword}
                                                    helperText={pwErrors.oldPassword}
                                                />
                                            </Box>
                                            <Box mb={3}>
                                                <Typography
                                                    component="label"
                                                    sx={{
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        display: "block",
                                                    }}
                                                >
                                                    Mật khẩu mới
                                                </Typography>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    size="small"
                                                    name="newPassword"
                                                    type="password"
                                                    id="newPassword"
                                                    autoComplete="newPassword"
                                                    InputProps={{
                                                        style: { borderRadius: 8 },
                                                    }}
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    error={!!pwErrors.newPassword}
                                                    helperText={pwErrors.newPassword}
                                                />
                                            </Box>
                                            <Box mb={3}>
                                                <Typography
                                                    component="label"
                                                    sx={{
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        display: "block",
                                                    }}
                                                >
                                                    Xác nhận mật khẩu mới
                                                </Typography>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    size="small"
                                                    name="confirmPassword"
                                                    type="password"
                                                    id="confirmPassword"
                                                    autoComplete="confirmPassword"
                                                    InputProps={{
                                                        style: { borderRadius: 8 },
                                                    }}
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    error={!!pwErrors.confirmPassword}
                                                    helperText={pwErrors.confirmPassword}
                                                />
                                            </Box>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                sx={{ 
                                                    width: "40%",
                                                    mt: 3, 
                                                    mb: 2, 
                                                    borderRadius: 8, 
                                                    backgroundColor: "#083d5e",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Lưu thay đổi
                                            </Button>
                                            </div>
                                        </Box>
                                    </Grid>
                                </Grid>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>    
        </div>
        </>
    )
}