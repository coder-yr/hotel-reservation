"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatINR } from "@/lib/utils";

interface RevenueGaugeProps {
    totalRevenue: number;
}

const data = [
    { name: 'Check In', value: 400 },
    { name: 'Check out', value: 300 },
    { name: 'Booked', value: 300 },
];
const COLORS = ['#22c55e', '#f59e0b', '#e5e7eb'];

export function RevenueGauge({ totalRevenue }: RevenueGaugeProps) {
    return (
        <Card className="border-none shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Revenue Stat</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center relative">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="80%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 text-center">
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatINR(totalRevenue)}</p>
                </div>

                <div className="flex gap-4 justify-center mt-2 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Check In</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span>Check out</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-200" />
                        <span>Booked</span>
                    </div>
                </div>

                <div className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded-lg mt-6 w-full text-center">
                    <span className="font-bold text-green-600">+16.2%</span> You Booked 3,455 items compared to last month
                </div>
            </CardContent>
        </Card>
    );
}
