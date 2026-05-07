"use client";
import api from "../lib/axios";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
export default function useReaderProfile() {
    const { user } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState(null);
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
    };
    useEffect(() => {    
        if(!user?.id) return;   
        getUserProfile();
    }, [user?.id]);
    return userProfile;
}