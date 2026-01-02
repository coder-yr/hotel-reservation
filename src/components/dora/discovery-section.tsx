
"use client"

import { motion } from "framer-motion";
import { Globe2, Map, Compass } from "lucide-react";

export function DiscoverySection() {
    return (
        <section className="bg-[#1a1a1a] text-white py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 z-10 relative">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-5xl md:text-7xl mb-6"
                    >
                        Explore the World's
                    </motion.h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                        Navigate through curated destinations with our intelligent travel mapping system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Globe2, title: "Global Coverage", desc: "Access to 190+ countries" },
                        { icon: Map, title: "Smart Routing", desc: "Optimize your transit paths" },
                        { icon: Compass, title: "Local Guides", desc: "Expert insights everywhere" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default"
                        >
                            {/* HUD Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center mb-6">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-serif">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
        </section>
    )
}
