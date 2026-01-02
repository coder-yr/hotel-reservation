"use client";

import { MapPin, Calendar, Clock, ArrowRight, Star, Phone, Navigation } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import type { Booking } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
    booking: Booking;
    onCancel: (booking: Booking) => void;
    isCancelling: boolean;
    canCancel: boolean;
}

export function BookingCardHotel({ booking, onCancel, isCancelling, canCancel }: Props) {
    const fromDate = booking.fromDate as Date;
    const toDate = booking.toDate as Date;
    const isCancelled = booking.status.trim().toLowerCase() === 'cancelled';

    const router = useRouter();

    return (
        <Card
            onClick={() => router.push(`/bookings/${booking.id}`)}
            className="group overflow-hidden rounded-2xl border-0 shadow-md transition-all hover:shadow-xl hover:translate-y-[-2px] bg-white ring-1 ring-slate-200 cursor-pointer"
        >
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-2/5 relative h-56 md:h-auto min-h-[220px]">
                    <Image
                        src={booking.coverImage || 'https://placehold.co/600x400.png'}
                        alt={booking.hotelName || 'Hotel Image'}
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isCancelled ? 'grayscale' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />

                    <div className="absolute bottom-4 left-4 text-white">
                        <Badge className={`mb-2 backdrop-blur-md border-0 ${isCancelled ? 'bg-red-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
                            {booking.status}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between relative">
                    {isCancelled && (
                        <div className="absolute right-4 top-4 opacity-10 rotate-12 pointer-events-none">
                            <span className="text-8xl font-black text-red-600 uppercase">Cancelled</span>
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-1">{booking.hotelName}</h3>
                                <div className="flex items-center text-slate-500 text-sm">
                                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                    {booking.hotelLocation}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-400">Total Price</p>
                                <p className="text-xl font-bold text-slate-900">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(booking.totalPrice)}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Check-in</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-500" />
                                    <span className="font-semibold text-slate-700">{format(fromDate, 'EEE, MMM d')}</span>
                                </div>
                                <p className="text-xs text-slate-400 pl-7">12:00 PM</p>
                            </div>
                            <div className="space-y-1 border-l pl-4 border-slate-200">
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Check-out</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-500" />
                                    <span className="font-semibold text-slate-700">{format(toDate, 'EEE, MMM d')}</span>
                                </div>
                                <p className="text-xs text-slate-400 pl-7">10:00 AM</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                            <Badge variant="outline" className="rounded-md border-slate-200 font-normal">
                                {booking.roomTitle}
                            </Badge>
                            <span className="text-slate-300">•</span>
                            <span>2 Guests</span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3 pt-4 border-t border-slate-100">
                        <Button variant="outline" className="flex-1 gap-2" asChild onClick={(e) => e.stopPropagation()}>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.hotelName + ' ' + booking.hotelLocation)}`} target="_blank" rel="noreferrer">
                                <Navigation className="w-4 h-4" /> Get Directions
                            </a>
                        </Button>

                        {canCancel && (
                            <Button
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={isCancelling}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancel(booking);
                                }}
                            >
                                Cancel Booking
                            </Button>
                        )}

                        {!canCancel && !isCancelled && (
                            <Button className="bg-slate-900 text-white">Book Again</Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
