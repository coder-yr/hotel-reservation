
"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plane, Building2, Bus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const cards = [
    {
        id: "flights",
        title: "Flights",
        subtitle: "Take to the skies",
        image: "https://images.unsplash.com/photo-1542296332-2e44a99cfef9?q=80&w=2070&auto=format&fit=crop",
        icon: Plane,
        href: "/flights",
        color: "bg-orange-500"
    },
    {
        id: "hotels",
        title: "Hotels",
        subtitle: "Stay in luxury",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
        icon: Building2,
        href: "/hotels",
        color: "bg-blue-500"
    },
    {
        id: "bus",
        title: "Bus & Train",
        subtitle: "Scenic routes",
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop",
        icon: Bus,
        href: "/bus",
        color: "bg-emerald-500"
    }
];

export function BookingSuite() {
    const [activeId, setActiveId] = useState("flights");

    return (
        <section className="bg-[#111] py-32">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-16 text-center">
                    <p className="text-orange-500 uppercase tracking-widest font-medium mb-3">Your Journey Starts Here</p>
                    <h2 className="text-white font-serif text-5xl md:text-6xl">Plan Your Dream</h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 h-[600px] w-full max-w-6xl mx-auto">
                    {cards.map((card) => (
                        <Link
                            key={card.id}
                            href={card.href}
                            onMouseEnter={() => setActiveId(card.id)}
                            className={cn(
                                "relative overflow-hidden rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group",
                                activeId === card.id ? "lg:flex-[3]" : "lg:flex-1",
                                "flex-1 h-full" // Mobile fallback
                            )}
                        >
                            {/* Background Image */}
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className={cn("absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors", activeId === card.id ? "bg-black/20" : "")} />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/90 to-transparent">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center text-white mb-4 transition-transform duration-500",
                                    card.color,
                                    activeId === card.id ? "scale-100" : "scale-75"
                                )}>
                                    <card.icon className="w-6 h-6" />
                                </div>

                                <h3 className={cn(
                                    "text-white font-bold text-3xl font-serif mb-2 transition-all duration-500 origin-left",
                                    activeId !== card.id && "lg:scale-0 lg:opacity-0 lg:h-0" // Hide text on inactive cards on Desktop
                                )}>
                                    {card.title}
                                </h3>

                                <p className={cn(
                                    "text-slate-300 transition-all duration-500 delay-100",
                                    activeId !== card.id && "lg:opacity-0 lg:translate-y-4"
                                )}>
                                    {card.subtitle}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
