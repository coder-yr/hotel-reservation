"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const data = [
    { name: 'Dec', Visited: 4000, Booked: 2400 },
    { name: 'Jan', Visited: 3000, Booked: 1398 },
    { name: 'Feb', Visited: 2000, Booked: 9800 },
    { name: 'Mar', Visited: 2780, Booked: 3908 },
    { name: 'Apr', Visited: 1890, Booked: 4800 },
    { name: 'May', Visited: 2390, Booked: 3800 },
    { name: 'Jun', Visited: 3490, Booked: 4300 },
    { name: 'Jul', Visited: 3000, Booked: 2400 },
    { name: 'Aug', Visited: 3200, Booked: 1398 },
];

export function CampaignChart() {
    return (
        <Card className="border-none shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Campaign Overview</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex text-xs h-8">Weekly</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickFormatter={(value) => `${value / 1000}K`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line
                            type="monotone"
                            dataKey="Booked"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Visited"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={{ r: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
