"use client";

import { useAuth } from "@/hooks/use-auth";
import { CloudSun, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHero() {
    const { user, loading } = useAuth();
    const today = new Date();

    if (loading) {
        return <Skeleton className="h-48 w-full rounded-2xl" />
    }

    const firstName = user?.name?.split(' ')[0] || 'Traveler';

    return (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 mb-8">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-orange-400 mb-2 font-medium">
                        <CalendarDays className="w-5 h-5" />
                        <span>{format(today, 'EEEE, MMMM do, yyyy')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Good Morning,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                            {firstName}
                        </span>
                    </h1>
                    <p className="text-slate-300 max-w-lg text-lg">
                        Ready for your next adventure? Check your upcoming trips or explore new destinations.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/10">
                    <div className="bg-orange-500/20 p-3 rounded-xl text-orange-400">
                        <CloudSun className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">24°C</p>
                        <p className="text-sm text-slate-300">Mumbai, India</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
