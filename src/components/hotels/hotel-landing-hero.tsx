"use client";

import { SearchForm } from "@/components/search-form";
import Image from "next/image";

interface HotelLandingHeroProps {
    initialDestination?: string;
}

export function HotelLandingHero({ initialDestination }: HotelLandingHeroProps) {
    return (
        <div className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop"
            >
                <source src="/videos/luxury-hotel.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center text-center space-y-8">
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                        Find Your Perfect Stay
                    </h1>
                    <p className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
                        From cozy country homes to funky city apartments, discover the best places to stay around the world.
                    </p>
                </div>

                <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <SearchForm
                        defaultTab="hotel"
                        initialValues={{ destination: initialDestination }}
                    />
                </div>
            </div>
        </div>
    );
}
