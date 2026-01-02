"use client";

import { Building2, Plane, BusFront, Map, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const categories = [
    {
        icon: Building2,
        label: "Hotels",
        desc: "Find cozy stays",
        href: "/hotels",
        color: "bg-rose-500",
        gradient: "from-rose-500 to-pink-600",
        delay: "0"
    },
    {
        icon: Plane,
        label: "Flights",
        desc: "Book your flight",
        href: "/flights",
        color: "bg-blue-500",
        gradient: "from-blue-500 to-cyan-500",
        delay: "100"
    },
    {
        icon: BusFront,
        label: "Buses",
        desc: "Travel by road",
        href: "/bus",
        color: "bg-orange-500",
        gradient: "from-orange-500 to-amber-500",
        delay: "200"
    }
];

export function ExplorationSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
                <Link
                    key={idx}
                    href={cat.href}
                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-lg bg-gradient-to-br ${cat.gradient}`}>
                            <cat.icon className="w-6 h-6" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{cat.label}</h3>
                        <p className="text-slate-500 text-sm">{cat.desc}</p>
                    </div>

                    {/* Hover Effect Background */}
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${cat.gradient}`} />
                </Link>
            ))}
        </div>
    );
}
