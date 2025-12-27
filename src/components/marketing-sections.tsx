"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane, Building2, Map, Shield, Calendar, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Spline = dynamic(() => import('@splinetool/react-spline').then(mod => mod.default), {
    ssr: false,
});

// Lazy wrapper to prevent WebGL context processing until visible
const LazySpline = ({ scene, className }: { scene: string, className?: string }) => {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setShouldLoad(true);
                observer.disconnect();
            }
        }, { rootMargin: "200px" });

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={`${className} relative`}>
            {shouldLoad && (
                <div
                    className={`absolute inset-0 transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Spline
                        scene={scene}
                        className="w-full h-full"
                        onLoad={() => setIsLoaded(true)}
                    />
                </div>
            )}
            {!isLoaded && (
                <div className={`w-full h-full flex items-center justify-center bg-[#06060c] absolute inset-0 transition-opacity duration-500 ${shouldLoad ? 'opacity-100' : 'opacity-100'}`}>
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export function ExplorePackages() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(textRef.current?.children || [], {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        })
            .from(visualRef.current, {
                x: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.6");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full py-24 overflow-hidden" style={{ backgroundColor: '#06060c' }}>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* Left Content */}
                    <div ref={textRef} className="w-full lg:w-1/2 space-y-10 z-10 order-2 lg:order-1">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                                <Map className="w-4 h-4" />
                                <span>Exclusive Offers</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.2]">
                                Explore Premium <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Travel Packages</span>
                            </h2>
                            <p className="text-lg text-slate-400 font-normal leading-relaxed max-w-xl">
                                Curated experiences designed for the modern traveler. From weekend getaways to month-long expeditions, find the perfect package for your next adventure.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: Shield, title: "Secure Booking", desc: "End-to-end protection" },
                                { icon: Calendar, title: "Flexible Dates", desc: "Change plans easily" },
                                { icon: CreditCard, title: "Best Price", desc: "Guaranteed rates" },
                                { icon: Plane, title: "Top Airlines", desc: "Global partners" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <item.icon className="w-8 h-8 text-blue-400 mb-1" />
                                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all w-full sm:w-auto">
                                <Link href="/flights">
                                    Explore All Packages
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Visual - Spline 3D Scene */}
                    <div ref={visualRef} className="w-full lg:w-1/2 relative h-[500px] rounded-[3rem] overflow-hidden order-1 lg:order-2 group">
                        <div className="absolute inset-0 bg-[#06060c] z-0" /> {/* Background to match */}

                        <div className="relative w-full h-full">
                            <LazySpline
                                scene="https://prod.spline.design/DsLtHfbhKfNUS6Kk/scene.splinecode"
                                className="w-full h-full"
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute bottom-10 left-10 z-20 glass px-6 py-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md pointer-events-none">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Plane className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300 uppercase tracking-wider font-medium">Flying to</p>
                                    <p className="text-xl font-bold text-white">Paris, France</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export function DiscoverMore() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(visualRef.current, {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
            .from(textRef.current?.children || [], {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.6");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full py-24 overflow-hidden bg-[#06060cb0]">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-20">

                    {/* Left Visual - Spline 3D Scene */}
                    <div ref={visualRef} className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <LazySpline
                                scene="https://prod.spline.design/yjjeZWK4qiXoKYfr/scene.splinecode"
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div ref={textRef} className="w-full lg:w-1/2 space-y-10 z-10">
                        <div className="space-y-6">
                            <span className="text-sm font-bold tracking-widest text-slate-500 uppercase">Flights & Hotels</span>
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-none">
                                Hotels
                            </h2>
                            <div className="relative">
                                <p className="text-xl text-slate-300 font-light leading-relaxed border-l-4 border-orange-500 pl-6 py-2 bg-white/5 rounded-r-xl backdrop-blur-sm max-w-lg">
                                    Discover our extensive collection of flight and hotel packages, tailored to your budget and preferences. Elevate your travel experience with our seamless platform.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button asChild size="lg" className="rounded-full px-10 h-16 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 transition-all hover:scale-105">
                                <Link href="/flights">
                                    Book Flights
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="rounded-full px-10 h-16 text-lg font-bold bg-[#1e293b] hover:bg-[#334155] text-white border border-slate-700 shadow-xl transition-all hover:scale-105">
                                <Link href="/hotels">
                                    Book Hotels
                                </Link>
                            </Button>
                        </div>

                        {/* Stats or trust markers */}
                        <div className="pt-8 flex gap-8 border-t border-white/10">
                            <div>
                                <p className="text-3xl font-bold text-white">2.5k+</p>
                                <p className="text-sm text-slate-500">Destinations</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">100%</p>
                                <p className="text-sm text-slate-500">Secure</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">24/7</p>
                                <p className="text-sm text-slate-500">Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
