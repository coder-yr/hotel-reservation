"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const destinations = [
    {
        id: 1,
        name: "Goa",
        count: "1,240 properties",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=60",
        className: "col-span-1 md:col-span-2 row-span-2"
    },
    {
        id: 2,
        name: "Mumbai",
        count: "850 properties",
        image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&auto=format&fit=crop&q=60",
        className: "col-span-1 row-span-1"
    },
    {
        id: 3,
        name: "Jaipur",
        count: "620 properties",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=60",
        className: "col-span-1 row-span-1"
    },
    {
        id: 4,
        name: "Manali",
        count: "430 properties",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=60",
        className: "col-span-1 md:col-span-2 row-span-1"
    }
];

export function TrendingDestinations() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Trending Destinations</h2>
                        <p className="text-slate-500">Most popular choices for travelers from India</p>
                    </div>
                    <Link href="/hotels" className="hidden md:flex items-center text-orange-600 font-semibold hover:text-orange-700">
                        View All <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                    {destinations.map((dest) => (
                        <Link
                            key={dest.id}
                            href={`/hotels?destination=${dest.name}`}
                            className={`relative group overflow-hidden rounded-2xl cursor-pointer block ${dest.className}`}
                        >
                            <Image
                                src={dest.image}
                                alt={dest.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 p-6">
                                <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                                <p className="text-white/80 text-sm font-medium">{dest.count}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
