"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography, TextField, Alert } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import Image from "next/image";
import styles from "./page.module.css";
import api from "../../lib/axios.js";


export default function LoginPage() {
    const router = useRouter();
    const {login} = useContext(AuthContext);
    const { t } = useTranslation();
    const [successMessage, setSuccessMessage] = useState("");

    //State để quản lý lỗi
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        server: ''
    });


    //State để quản lý giá trị input
    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    //Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        //Xóa lỗi khi user bắt đầu nhập
        setErrors(prev => ({
            ...prev,
            [name]: '',
            server: ''
        }));
        setSuccessMessage('');
    };

    //Validate form
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            username: '',
            password: '',
            server: ''
        };

        //Validate username
        if(!form.username.trim()) {
            newErrors.username = t('auth.usernameRequired');
            isValid = false;
        } 

        //Validate password
        if(!form.password) {
            newErrors.password = t('auth.passwordRequired');
            isValid = false;
        } else if (form.password.length < 6) {
            newErrors.password = t("auth.passwordMinLength");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        //Validate form trước khi gửi request
        if (!validateForm()) return;

        try {
            //call API Login
            const response = await api.post("/auth/login", {
                username: form.username,
                password: form.password
            });
            
            if (response.status === 200 || response.status === 201) {
                console.log("Login success  login:101 - page.js:96", response.data);
                setSuccessMessage(t('auth.login.loginSuccess'));
                setForm({
                    username: "",
                    password: "",
                });
                
                login(response.data.user, response.data.token);
                console.log("/ - page.js:104");
                router.push("/");
            }

            

        } catch (err) {
            setErrors(prev => ({
                ...prev,
                server: err.response?.data?.message || "Login failed"
            }));
        } 
    };

    return (
        <>
            <div className={styles.wrapper}>
                
                <div className={styles.loginScreen}>
                    <Grid container justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                            <Box>
                                <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
                                    <Image
                                        src="/images/mcicon.jpg"
                                        alt="mcicon"
                                        width={100}
                                        height={100}
                                    />
                                </Typography>

                                <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
                                    {t("auth.login.title")}
                                </Typography>

                                <Typography as="h2" fontSize="15px" mb="30px">    
                                    {t("auth.login.noAccount")} 
                                    <Link href="/register">
                                        {t("auth.register.title")}
                                    </Link>
                                </Typography>

                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 1 }}>
                                    {errors.server && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {errors.server}
                                        </Alert>
                                    )}
                                        
                                    {successMessage && (
                                        <Alert severity="success" sx={{ mb: 2 }}>
                                            {successMessage}
                                        </Alert>
                                    )}
                                    <Box>
                                        <TextField
                                            required
                                            margin="normal"
                                            fullWidth
                                            name="username"
                                            label={t('auth.username')}
                                            type="username"
                                            id="username"
                                            autoComplete="username"
                                            InputProps={{
                                                style: { borderRadius: 8 },
                                            }}
                                            value={form.username}
                                            onChange={handleChange}
                                            error={!!errors.username}
                                            helperText={errors.username}
                                        />
                                    </Box>

                                    <Box>  
                                        <TextField
                                            required
                                            margin="normal"
                                            fullWidth
                                            name="password"
                                            label={t('auth.password')}
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                            InputProps={{
                                                style: { borderRadius: 8 },
                                            }}
                                            value={form.password}
                                            onChange={handleChange}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                        />
                                    </Box>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            mt: 2,
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            fontWeight: "500",
                                            fontSize: "16px",
                                            padding: "12px 10px",
                                            color: "#fff !important",
                                        }}
                                        >
                                        {t('auth.login.loginButton')}
                                    </Button>
                                </Box>
                                <Grid item xs={6} sm={6} textAlign="end">
                                    <Link
                                    href="/authentication/forgot-password"
                                    className="primaryColor text-decoration-none"
                                    >
                                    {t('auth.login.forgotPassword')}
                                    </Link>
                                </Grid>
                            </Box>

                            
                        </Grid>
                    </Grid>
                </div>    
            </div>
        </>
    );
};


