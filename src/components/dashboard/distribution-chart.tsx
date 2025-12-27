"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts";

interface DistributionChartProps {
    hotelsCount: number;
    busesCount: number;
    flightsCount: number;
}

export function DistributionChart({ hotelsCount, busesCount, flightsCount }: DistributionChartProps) {
    const data = [
        { name: "Hotels", value: hotelsCount, fill: "#0f766e" },
        { name: "Flights", value: flightsCount, fill: "#f43f5e" },
        { name: "Bus", value: busesCount, fill: "#f59e0b" },
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        <Cell key="cell-0" fill="#0f766e" />
                        <Cell key="cell-1" fill="#f43f5e" />
                        <Cell key="cell-2" fill="#f59e0b" />
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
