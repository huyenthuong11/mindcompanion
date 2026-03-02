"use client";

import AuthProvider from "../context/AuthContext";
import {I18nextProvider} from "react-i18next";
import i18n from "../lib/i18n";
import "../app/globals.css";
import { ThemeProvider } from '@mui/material/styles';
import theme from '../lib/theme';


export default function RootLayout({children}) {
    return (
        <html lang="vi">
            <body>
                <I18nextProvider i18n={i18n}>
                    <ThemeProvider theme={theme}>
                        <AuthProvider>{children}</AuthProvider>
                    </ThemeProvider>
                </I18nextProvider>
            </body>
        </html>
    );
}