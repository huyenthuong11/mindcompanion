"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography, Alert, FormControl, 
    InputLabel, Select, MenuItem, TextField,
    FormHelperText } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import Image from "next/image";
import styles from "./page.module.css";
import api from "../../lib/axios.js";


export default function RegisterPage({ params }) {
    const router = useRouter();
    const {register} = useContext(AuthContext);
    const [successMessage, setSuccessMessage] = useState("");
    const { t } = useTranslation();

    //State để quản lý lỗi
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        gender: '',
        server: ''
    });


    //State để quản lý giá trị input
    const [form, setForm] = useState({
        username: '',
        password: '',
        gender: ''
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
        if(!form.password.trim()) {
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
            //call API Register
            const response = await api.post("/auth/register", {
                username: form.username,
                password: form.password,
                gender: form.gender,
            });
            if (response.status === 200 || response.status === 201) {
                console.log("Create new account success  createnewaccount:101 - page.js:99", response.data);
                setSuccessMessage(t('auth.register.registrationSuccess'));
                setForm({
                    username: "",
                    password: "",
                    gender: "",
                });
                console.log("/ - page.js:106");
                router.push("/login");
            }

            console.log(response.data)
            
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                server: err.response?.data?.message || "Register failed"
            }));
        }
    };

    return (
        <>
            <div className={styles.wrapper}>
                
                <div className={styles.registerScreen}>
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
                                    {t("auth.register.title")}
                                </Typography>

                                <Typography as="h2" fontSize="15px" mb="30px">    
                                    {t("auth.register.haveAccount")} 
                                    <Link href="/login">
                                        {t("auth.login.title")}
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

                                    <FormControl fullWidth required error={!!errors.gender}>
                                        <InputLabel id="gender">{t('auth.register.gender')}</InputLabel>
                                            <Select
                                                value={form.gender}
                                                name="gender"
                                                labelId="gender"
                                                label={t('auth.register.gender')}
                                                InputProps={{
                                                    style: { borderRadius: 8 },
                                                }}
                                                onChange={(e) => {
                                                    setForm((prevData) => ({
                                                    ...prevData,
                                                    gender: e.target.value,
                                                    }));
                                                    setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    gender: "",
                                                    }));
                                                }}
                                            >
                                            <MenuItem value="male">{t('auth.register.male')}</MenuItem>
                                            <MenuItem value="female">{t('auth.register.female')}</MenuItem>
                                            <MenuItem value="other">{t('auth.register.other')}</MenuItem>
                                            <MenuItem value="Don't want to reveal">{t('auth.register.dontWantToReveal')}</MenuItem>
                                            
                                            </Select>
                                        {errors.gender && (
                                        <FormHelperText>{errors.gender}</FormHelperText>
                                        )}
                                    </FormControl>

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
                                        {t('auth.register.registerButton')}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </div>    
            </div>
        </>
    );
};


