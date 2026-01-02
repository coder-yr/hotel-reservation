"use client"

import { SearchForm } from "@/components/search-form";
import { Badge } from "@/components/ui/badge";
import { Wifi, Dog, Key } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden rounded-b-[3rem] shadow-2xl mx-auto">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop"
                    alt="Harmont Luxury Cabin"
                    fill
                    className="object-cover brightness-[0.85]"
                    priority
                />
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            </div>

            {/* Floating Badges (Visual Polish) */}
            <div className="absolute top-[35%] left-[20%] animate-float-slow hidden lg:flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-white text-xs font-medium">
                <Wifi className="w-3 h-3" /> Wi-Fi 100 Mbps
            </div>
            <div className="absolute top-[45%] right-[25%] animate-float-slower hidden lg:flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-white text-xs font-medium">
                <Dog className="w-3 h-3" /> Pet Friendly
            </div>
            <div className="absolute bottom-[35%] left-[30%] animate-float hidden lg:flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-white text-xs font-medium">
                <Key className="w-3 h-3" /> Self Check-in
            </div>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pt-20">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-4 drop-shadow-xl">
                    Find Your <br />
                    Perfect <span className="text-yellow-200">Space</span>
                </h1>
                <p className="text-base md:text-xl text-white/90 max-w-2xl font-light mb-12 drop-shadow-md leading-relaxed">
                    Discover handpicked luxury cabins, hotels, and retreats in breathtaking locations.
                    Unplug, unwind, and reconnect with what matters most.
                </p>

                {/* Integrated Search Form */}
                <div className="w-full max-w-5xl transform scale-90 md:scale-100 origin-top transition-transform">
                    <SearchForm defaultTab="hotel" />
                </div>

                {/* Rating Badge (Reference image detail) */}
                <div className="absolute bottom-12 right-8 md:right-16 text-white text-right hidden md:block">
                    <div className="flex items-center gap-2 justify-end">
                        <span className="text-4xl font-bold">4.9</span>
                        <span className="text-yellow-400 text-2xl">★</span>
                    </div>
                    <p className="text-sm opacity-80">from 2,400+ stays</p>
                </div>
            </div>
        </section>
    );
}
