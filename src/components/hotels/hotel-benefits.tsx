"use client";

import { ShieldCheck, Headset, Wallet, Star } from "lucide-react";

const benefits = [
    {
        icon: ShieldCheck,
        title: "Secure Booking",
        desc: "We prioritize your privacy and security with top-notch encryption."
    },
    {
        icon: Headset,
        title: "24/7 Support",
        desc: "Our team is here to help you anytime, anywhere, for any issue."
    },
    {
        icon: Wallet,
        title: "Best Price Guarantee",
        desc: "Find a lower price? We'll match it and give you a discount."
    },
    {
        icon: Star,
        title: "Verified Reviews",
        desc: "Millions of genuine reviews to help you make the right choice."
    }
];

export function HotelBenefits() {
    return (
        <section className="py-12 bg-slate-50 border-y border-slate-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((bg, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                                <bg.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">{bg.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{bg.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
