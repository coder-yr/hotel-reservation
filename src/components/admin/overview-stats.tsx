"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { FileText, X, Ticket, Archive } from "lucide-react";

interface OverviewStatsProps {
    bookingsCount: number;
    cancelledCount: number;
    totalRevenue: number;
    checkInCount: number;
}

export function OverviewStats({ bookingsCount, cancelledCount, totalRevenue, checkInCount }: OverviewStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Booked Rooms */}
            <Card className="hover:shadow-md transition-shadow border-none shadow-sm h-full">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+18.5%</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold">{formatINR(totalRevenue)}</h3>
                        <p className="text-sm text-muted-foreground">Booked Rooms</p>
                    </div>
                </CardContent>
            </Card>

            {/* Cancelled Rooms */}
            <Card className="hover:shadow-md transition-shadow border-none shadow-sm h-full">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                            <X className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">-24.8%</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold">{cancelledCount}</h3>
                        <p className="text-sm text-muted-foreground">Cancelled Rooms</p>
                    </div>
                </CardContent>
            </Card>

            {/* Check In */}
            <Card className="hover:shadow-md transition-shadow border-none shadow-sm h-full">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <Ticket className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">-14.6%</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold">{checkInCount}</h3>
                        <p className="text-sm text-muted-foreground">Check In</p>
                    </div>
                </CardContent>
            </Card>

            {/* Check Out  (Using Bookings count for now as placeholder or maybe a different metric) */}
            <Card className="hover:shadow-md transition-shadow border-none shadow-sm h-full">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <Archive className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.8%</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold">{bookingsCount}</h3>
                        <p className="text-sm text-muted-foreground">Check out</p>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
