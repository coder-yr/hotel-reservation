
"use client"

import { motion } from "framer-motion";
import Image from "next/image";

const photos = [
    { src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop", alt: "Traveler", span: "row-span-2" },
    { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop", alt: "Switzerland", span: "row-span-1" },
    { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", alt: "Beach", span: "row-span-1" },
    { src: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=2102&auto=format&fit=crop", alt: "Cinema", span: "col-span-2 row-span-1" },
];

export function FinalJourney() {
    return (
        <section className="bg-[#050505] py-32">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-1/3 pt-20">
                        <h2 className="font-serif text-6xl text-white mb-6 leading-tight">
                            Embark on <br />
                            <span className="italic font-light text-slate-300">a Journey</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            Join millions of travelers who have found their perfect destination with us.
                            Your next story begins with a single click.
                        </p>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4 h-[600px]">
                        {photos.map((photo, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={`relative rounded-xl overflow-hidden hover:opacity-90 transition-opacity ${photo.span}`}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
