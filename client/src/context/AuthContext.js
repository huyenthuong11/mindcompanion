"use client";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };
    console.log("Giá trị của AuthContext là: - AuthContext.js:27", AuthContext);
    return(
        <AuthContext.Provider value ={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}