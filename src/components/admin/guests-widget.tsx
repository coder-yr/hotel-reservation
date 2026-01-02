"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GuestsWidgetProps {
    totalGuests: number;
}

export function GuestsWidget({ totalGuests }: GuestsWidgetProps) {
    const adultsCount = Math.floor(totalGuests * 0.7);
    const childrenCount = totalGuests - adultsCount;

    return (
        <Card className="border-none shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Number of current guests</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex text-xs h-8 gap-1">
                        <Filter className="h-3 w-3" /> Filters
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                        <p className="text-xl font-bold">{totalGuests.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total guests</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <p className="text-xl font-bold">{adultsCount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Of Adults</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                        <p className="text-xl font-bold">{childrenCount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Of Children</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2 font-medium">
                                <span>United States</span>
                                <span className="text-lg">🇺🇸</span>
                            </div>
                            <span className="text-muted-foreground text-xs">100 Adults, 20 Children's</span>
                            <span className="font-bold">72%</span>
                        </div>
                        <Progress value={72} className="h-2 bg-muted [&>div]:bg-green-500" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2 font-medium">
                                <span>Australia</span>
                                <span className="text-lg">🇦🇺</span>
                            </div>
                            <span className="text-muted-foreground text-xs">100 Adults, 20 Children's</span>
                            <span className="font-bold">64%</span>
                        </div>
                        <Progress value={64} className="h-2 bg-muted [&>div]:bg-blue-500" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2 font-medium">
                                <span>India</span>
                                <span className="text-lg">🇮🇳</span>
                            </div>
                            <span className="text-muted-foreground text-xs">100 Adults, 20 Children's</span>
                            <span className="font-bold">48%</span>
                        </div>
                        <Progress value={48} className="h-2 bg-muted [&>div]:bg-orange-400" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
