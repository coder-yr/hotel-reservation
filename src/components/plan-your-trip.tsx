"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Plane } from "lucide-react";
import Link from "next/link";
import Spline from "@splinetool/react-spline";

export function PlanYourTrip() {
    return (
        <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#06060c' }}>
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Content */}
                    <div className="w-full lg:w-1/2 space-y-8 z-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                                Plan Your Trip
                            </h2>
                            <p className="text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                                Experience the future of travel with our cutting-edge platform. Effortlessly book flights, hotels, and transportation.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300">
                                <Link href="/flights">
                                    Book Now
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Visual - Phone & Plane Mockup */}
                    <div className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center">
                        {/* Gradient glow behind the phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px]" />

                        {/* CSS Phone Mockup since we don't have the 3D asset file yet */}
                        <div className="relative w-[280px] h-[580px] bg-[#0f172a] rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                            {/* Screen Content */}
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-indigo-600 opacity-90">
                                {/* Cloud/Sky patterns */}
                                <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                                {/* UI Elements Mockup */}
                                <div className="absolute top-12 left-0 right-0 px-6 text-center text-white/90">
                                    <div className="w-16 h-1 bg-white/30 mx-auto rounded-full mb-4"></div>
                                    <div className="text-2xl font-bold mb-1">TravelVerse</div>
                                    <div className="text-xs opacity-75">Your journey starts here</div>
                                </div>

                                <div className="absolute top-1/3 left-0 right-0 px-6">
                                    <div className="glass p-4 rounded-2xl mb-4 bg-white/10 border border-white/20 backdrop-blur-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Plane className="text-white w-5 h-5" />
                                            <div className="h-2 w-20 bg-white/40 rounded-full"></div>
                                        </div>
                                        <div className="h-2 w-full bg-white/20 rounded-full mb-2"></div>
                                        <div className="h-2 w-2/3 bg-white/20 rounded-full"></div>
                                    </div>
                                    <div className="glass p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm transform scale-95 opacity-80 mt-[-10px]">
                                    </div>
                                </div>

                                {/* Floating Plane Icon imitating the 3D asset */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                    <div className="relative animate-bounce duration-[3000ms]">
                                        <Plane className="w-32 h-32 text-white drop-shadow-2xl transform -rotate-45" strokeWidth={1.5} />
                                        {/* Trail */}
                                        <div className="absolute top-full left-1/2 w-1 h-20 bg-gradient-to-b from-white/50 to-transparent -translate-x-1/2 blur-sm"></div>
                                    </div>
                                </div>

                                <div className="absolute bottom-10 left-6 right-6">
                                    <div className="w-full h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center font-bold shadow-lg">
                                        Get Started
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
