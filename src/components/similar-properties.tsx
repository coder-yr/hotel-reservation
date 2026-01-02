"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Hotel } from "@/lib/types";
import { MapPin, BedDouble, Bath, Square, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SimilarPropertiesProps {
    hotels: Hotel[];
}

export function SimilarProperties({ hotels }: SimilarPropertiesProps) {
    if (!hotels || hotels.length === 0) return null;

    return (
        <div className="py-12">
            <h2 className="text-2xl font-semibold mb-8 text-center">Explore More Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {hotels.map((hotel) => (
                    <Card key={hotel.id} className="border-none shadow-none group cursor-pointer transition-all hover:-translate-y-1">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                            <Image
                                src={hotel.coverImage || '/placeholder.jpg'}
                                alt={hotel.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{hotel.name}</h3>
                            <div className="flex items-center text-muted-foreground text-sm gap-4">
                                <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> 4 Bed</span>
                                <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> 2 Bath</span>
                                <span className="flex items-center gap-1"><Square className="w-4 h-4" /> 1500 sqft</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="font-semibold text-lg">$750,000 <span className="text-sm font-normal text-muted-foreground">/ night</span></p> {/* Mock price styling based on image */}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="flex justify-end mt-4">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Next <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
