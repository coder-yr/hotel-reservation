
"use client"

import Link from "next/link";
import { ArrowRight, Plane, Building2, Bus } from "lucide-react";
import Image from "next/image";

const verticals = [
    {
        title: "Stay in Style",
        description: "Discover verified hotels, resorts, and vacation homes.",
        icon: Building2,
        href: "/hotels",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
        color: "bg-blue-600"
    },
    {
        title: "Fly Anywhere",
        description: "Best deals on domestic and international flights.",
        icon: Plane,
        href: "/flights",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
        color: "bg-sky-500"
    },
    {
        title: "Budget Travel",
        description: "Comfortable bus journeys across the country.",
        icon: Bus,
        href: "/bus",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5960?q=80&w=2070&auto=format&fit=crop",
        color: "bg-emerald-600"
    }
]

export function VerticalsShowcase() {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Your Complete Travel Gateway
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Everything you need for your next adventure, all in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {verticals.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <div className={`inline-flex p-2 rounded-lg mb-3 ${item.color} bg-opacity-90 backdrop-blur-sm shadow-lg`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{item.title}</h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-6">
                                <p className="text-slate-600 dark:text-slate-300 flex-1 mb-6">
                                    {item.description}
                                </p>
                                <div className="flex items-center text-primary font-semibold group/link">
                                    Explore {item.title.split(' ')[0]}
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
