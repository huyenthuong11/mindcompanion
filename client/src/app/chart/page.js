"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../lib/axios.js";

export default function MoodChart() {
  
  const { user } = useContext(AuthContext);
  const [moods, setMoods] = useState([]);

  useEffect(() => {
      if (!user?.id) return;
      const getMood = async () => {
        try {
            const response = await api.get("/moods/get", {
                params: {
                    userId: user?.id,
                }
            });
            const data = response.data;
            setMoods(data);
        } catch (err) {
            console.error("Failed to fetch moods: - page.js:31", err);
        }
      };
      getMood();
  }, [user?.id]);

  const chartData = [...moods]
  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  .map((item) => ({
      date: new Date(item.createdAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "numeric"
      }),
      mood: Number(item.mood),
      energy: Number(item.energy)
  }));

  const limitedData = chartData.slice(-15);


  return (
    <div style={{ display: "flex", gap: "0.02vw", alignItems: "center", marginLeft:"5px" }}>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: 12,
              height: 12,
              background: "#d54e84",
              borderRadius: "50%",
            }}
          ></div>
          <span>Mood</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: 12,
              height: 12,
              background: "#4e8dd5",
              borderRadius: "50%",
            }}
          ></div>
          <span>Energy</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, height: 250, marginTop:10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={limitedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              textAnchor="end"
            />
            <YAxis domain={[1, 5]} />


            <Line
              type="monotone"
              dataKey="mood"
              stroke="#d54e84"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="energy"
              stroke="#4e8dd5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}