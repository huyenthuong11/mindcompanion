"use client";

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function MiniMoodRadar({avgMood, avgEnergy, scores}) {
    console.log(scores);
    const transformData = (avgMood, avgEnergy, scores) => {
        const axisMood = avgMood * 2 || 3;
        const axisEnergy = avgEnergy * 2 || 3;
        const hasWorkLife = scores?.work || 3;
        const hasConnection = scores?.relationship || 3;
        const hasPersonal = scores?.personal || 3;
        return [axisMood, axisEnergy, hasWorkLife, hasConnection, hasPersonal];
    };

    const chartData = {
        labels: ['Tâm trạng', 'Năng lượng', 'Công việc', 'Kết nối', 'Cá nhân'],
        datasets: [
            {
                data: transformData(avgMood, avgEnergy, scores),
                backgroundColor: 'rgba(113, 118, 171, 0.2)', 
                borderColor: 'rgb(113, 118, 171)',
                borderWidth: 2,
                pointRadius: 2,
                pointBackgroundColor: 'rgb(113, 118, 171)',
                fill: true,
            },
        ],
    };

    const options = {
        scales: {
            r: {
                min: 0,
                max: 10,
                beginAtZero: true,
                angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: { display: false, stepSize: 2 },
                pointLabels: {
                font: { size: 10, family: 'Inter' },
                color: '#666',
                },
            },
        },
        plugins: {
            legend: { display: false },
        },
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '100%', height: '180px' }}>
            <Radar data={chartData} options={options} />
        </div>
    );
}