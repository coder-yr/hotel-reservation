
"use client"

import { motion } from "framer-motion";
import { SearchForm } from "@/components/search-form";
import Image from "next/image";

export function DoraHero() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
            {/* Cinematic Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                    poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop"
                >
                    <source src="/videos/1851190-uhd_3840_2160_25fps.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">

                {/* Cinematic Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-12"
                >
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-white tracking-wide drop-shadow-2xl">
                        Discover the World's
                    </h1>
                    <p className="mt-4 text-slate-300 text-lg md:text-xl font-light tracking-widest uppercase">
                        Limitless Travel Awaits
                    </p>
                </motion.div>

                {/* Floating Search Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className="w-full max-w-4xl"
                >
                    <SearchForm defaultTab="hotel" />
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
                </motion.div>
            </div>
        </section>
    )
}
