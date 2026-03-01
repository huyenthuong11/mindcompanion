"use client";

import {useRouter} from "next/nevigation";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography, TextField, Alert } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import Image from "next/image";




export default function LoginPage() {
    const router = useRouter();
    const {login} = useContext(AuthContext);
    const t = useTranslations('auth');

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
    };

    //Validate form
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            username: '',
            password: '',
            server: ''
        };

        //Validate password
        if(!form.password) {
            newErrors.password = t("Vui lòng nhập mật khẩu");
            isValid = false;
        } else if (form.password.length < 6) {
            newErrors.password = t("Mật khẩu phải có ít nhất 6 ký tự");
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
            const response = await api.post("/api/auth/login", {
                username: form.username,
                password: form.password
            });

            //Lưu token
            login(res.data.token);

            //redirect profile
            router.push(`/${params.lang}`);
        } catch (err) {
            setErrors(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="authenticationBox">
                <Box
                    component = "main"
                    sx={{
                        maxWidth: "510px",
                        ml: "auto",
                        mr: "auto",
                        padding: "50px 0 100px",
                    }}
                >
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                        <Box>
                            <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
                                {t("Sign In")}
                                <Image
                                    src="./src/images/mcicon.jpg"
                                    alt="mcion"
                                    width={30}
                                    height={30}
                                />
                            </Typography>
                        </Box>
                    </Grid>
                </Box>
            </div>
        </>
    );
};


