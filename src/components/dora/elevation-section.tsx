
"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function ElevationSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-screen bg-[#050505] overflow-hidden py-32 z-30">
            <div className="container mx-auto px-4 relative z-10">

                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Text Content */}
                    <div className="lg:w-1/3">
                        <motion.h2
                            style={{ opacity }}
                            className="font-serif text-6xl md:text-8xl text-white leading-[0.9] mb-8"
                        >
                            Discover <br />
                            <span className="italic text-slate-500">the Beauty</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 text-lg leading-relaxed mb-8"
                        >
                            Soar above expectations with premium flights that turn a journey into an experience.
                            Witness the sunset from 30,000 feet.
                        </motion.p>
                        <Button className="rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-slate-200 transition-colors">
                            Book Your Flight
                        </Button>
                    </div>

                    {/* Parallax Images */}
                    <div className="lg:w-2/3 relative h-[600px] w-full">
                        {/* Image 1 - Main */}
                        <motion.div
                            style={{ y: y1 }}
                            className="absolute right-0 top-0 w-3/4 h-[500px] rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                                alt="Airplane Wing"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Image 2 - Overlapping */}
                        <motion.div
                            style={{ y: y2 }}
                            className="absolute left-10 bottom-0 w-1/2 h-[350px] rounded-[2rem] overflow-hidden shadow-xl border-8 border-white bg-slate-200"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2088&auto=format&fit=crop"
                                alt="Clouds"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Decor Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -z-0 opacity-50" />
        </section>
    )
}
