"use client";
import { createContext, useState } from "react";

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (token) => {
        localStorage.setItem("token", token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };
    console.log("Giá trị của AuthContext là: - AuthContext.js:16", AuthContext);
    return(
        <AuthContext.Provider value ={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}