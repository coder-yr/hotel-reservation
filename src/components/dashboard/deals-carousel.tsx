"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import Image from "next/image";

const deals = [
    {
        id: 1,
        title: "Summer Escape",
        desc: "Get 20% off on beach resorts",
        code: "SUMMER20",
        color: "bg-teal-600",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        title: "City Break",
        desc: "Flat ₹500 off on hotels in Mumbai",
        code: "MUMBAI500",
        color: "bg-indigo-600",
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        title: "First Flight",
        desc: "10% Instant discount on domestic flights",
        code: "FLYHIGH",
        color: "bg-sky-600",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60"
    }
];

export function DealsCarousel() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-bold text-slate-900">Exclusive Deals</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {deals.map(deal => (
                    <div key={deal.id} className="min-w-[280px] md:min-w-[320px] snap-center rounded-2xl overflow-hidden relative h-48 group cursor-pointer shadow-sm hover:shadow-md transition-all">
                        <Image
                            src={deal.image}
                            alt={deal.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-5 w-full">
                            <Badge className="mb-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
                                {deal.code}
                            </Badge>
                            <h3 className="text-white font-bold text-lg mb-0.5">{deal.title}</h3>
                            <p className="text-white/80 text-sm">{deal.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
