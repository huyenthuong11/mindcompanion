import { useState } from 'react';
import styles from './SelectedMoodModal.module.css';
import api from "../../lib/axios.js";
import { useEffect } from "react";


export default function SelectedMoodModal({ id, onClose, userId }) {
    const [moodEntry, setMoodEntry] = useState(null);

    const fetchMoodEntryById = async (id) => {
        try {
            const response = await api.get(`/moods/getById/${id}`, {
                params: { userId }
            });
            setMoodEntry(response.data);
        } catch (error) {
            console.error("Error fetching mood entry:", error);
        }
    };

    useEffect(() => {
        fetchMoodEntryById(id);
    }, [id]);

    const moodList = [
        { icon: '😩', value: 1, label: 'Rất tệ' },
        { icon: '☹️', value: 2, label: 'Không vui' },
        { icon: '😐', value: 3, label: 'Bình thường' },
        { icon: '🙂', value: 4, label: 'Ổn' },
        { icon: '😁', value: 5, label: 'Rất vui' },
    ];
    const energyList = [
        {value: 1, label: 'Kiệt quệ' },
        {value: 2, label: 'Hơi mệt' },
        {value: 3, label: 'Bình thường' },
        {value: 4, label: 'Khỏe khoắn' },
        {value: 5, label: 'Tràn đầy'}
    ];
    const tagsList = [
        { label: '#giađình', value: 'family', bg: '#E3F2FD', color: '#1E88E5' },       // Xanh dương nhạt
        { label: '#côngviệc', value: 'work', bg: '#F3E5F5', color: '#8E24AA' },     // Tím nhạt
        { label: '#mốiquanhệxungquanh', value: 'relationship', bg: '#E8F5E9', color: '#43A047' }, // Xanh lá nhạt
        { label: '#tiềnbạc', value: 'money', bg: '#FFFDE7', color: '#FBC02D' },       // Vàng nhạt
        { label: '#sứckhỏe', value: 'health', bg: '#FFEBEE', color: '#E53935' },       // Đỏ hồng nhạt
        { label: '#tìnhcảm', value: 'love', bg: '#FCE4EC', color: '#D81B60' },       // Hồng phấn
        { label: '#tươnglai', value: 'future', bg: '#E0F7FA', color: '#00ACC1' }      // Xanh lơ (Cyan)
    ];
    console.log(moodEntry);
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <span className={styles.date}>
                        {new Date(moodEntry?.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.moodSection}>
                    <span className={styles.emoji}>{moodList.find(m => m.value === moodEntry?.mood)?.icon}</span>
                    <div className={styles.energyBarContainer}>
                        <p>Mức năng lượng: <strong>{energyList.find(e => e.value === moodEntry?.energy)?.label}</strong></p>
                        <div className={styles.energyBar}>
                            <div 
                                className={styles.energyFill} 
                                style={{ width: `${(moodEntry?.energy / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div className={styles.body}>
                    <p className={styles.content}>{moodEntry?.note}</p>
                </div>
                <div className={styles.footer}>
                    <div className={styles.tags}>
                        {moodEntry?.tags.map(tagValue => {
                            const tag = tagsList.find(t => t.value === tagValue);
                            return (
                                <span key={tagValue.value} className={styles.tag} style={{ backgroundColor: tag.color }}>
                                    {tag.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}