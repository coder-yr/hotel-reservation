"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts";

interface RevenueChartProps {
    totalRevenue: number;
}

export function RevenueChart({ totalRevenue }: RevenueChartProps) {
    // Mock data for previous months, real data for Jan
    const data = [
        { name: "Jul", total: 1200 },
        { name: "Aug", total: 2100 },
        { name: "Sep", total: 1800 },
        { name: "Oct", total: 2400 },
        { name: "Nov", total: 3200 },
        { name: "Dec", total: 4800 },
        { name: "Jan", total: totalRevenue }
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <RechartsTooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#0f766e' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#0f766e" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
