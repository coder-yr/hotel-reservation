"use client";

import { Plane, ArrowRight, Clock, Armchair, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Booking } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
    booking: Booking;
    onCancel: (booking: Booking) => void;
    isCancelling: boolean;
    canCancel: boolean;
}

export function BookingCardFlight({ booking, onCancel, isCancelling, canCancel }: Props) {
    const fromDate = booking.fromDate as Date;
    const toDate = booking.toDate as Date;
    const isCancelled = booking.status.trim().toLowerCase() === 'cancelled';
    const [origin, destination] = booking.hotelLocation ? booking.hotelLocation.split(' - ') : ['Origin', 'Dest'];
    const airlineName = (booking.hotelName || 'Unknown Airline').split('(')[0].trim();
    const flightInfo = booking.roomTitle || 'Flight Info';
    const seatNumber = flightInfo.split('•')[1]?.trim() || 'Any';
    const flightNumber = flightInfo.split('•')[0]?.replace('Flight', '').trim() || 'FN-123';
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/bookings/${booking.id}`)}
            className={`relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group ${isCancelled ? 'opacity-75' : ''} cursor-pointer`}
        >
            {/* Decorative Top Band */}
            <div className={`h-2 w-full ${isCancelled ? 'bg-slate-300' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`} />

            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                {/* Left: Flight Route & Time */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <Plane className={`w-6 h-6 ${isCancelled ? '' : 'rotate-45'}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{airlineName}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{flightNumber}</span>
                                    <span>•</span>
                                    <span>Economy Class</span>
                                </div>
                            </div>
                        </div>

                        <Badge className={isCancelled ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-green-100 text-green-700 hover:bg-green-100'}>
                            {booking.status}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:gap-12">
                        {/* Origin */}
                        <div className="text-left">
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{origin?.substring(0, 3).toUpperCase()}</p>
                            <p className="text-sm text-slate-500 font-medium">{origin}</p>
                            <div className="mt-2">
                                <p className="text-lg font-bold text-slate-900">{format(fromDate, 'HH:mm')}</p>
                                <p className="text-xs text-slate-400">{format(fromDate, 'dd MMM')}</p>
                            </div>
                        </div>

                        {/* Path Visual */}
                        <div className="flex-1 flex flex-col items-center px-4 relative">
                            <div className="text-xs text-slate-400 mb-1">2h 30m</div>
                            <div className="w-full h-[2px] bg-slate-200 relative flex items-center justify-center">
                                <div className="absolute left-0 w-2 h-2 rounded-full bg-slate-300"></div>
                                <div className="absolute right-0 w-2 h-2 rounded-full bg-slate-300"></div>
                                <Plane className="w-5 h-5 text-indigo-400 absolute bg-white p-0.5 rotate-90" />
                            </div>
                            <div className="text-xs text-slate-400 mt-1">Direct</div>
                        </div>

                        {/* Destination */}
                        <div className="text-right">
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{destination?.substring(0, 3).toUpperCase()}</p>
                            <p className="text-sm text-slate-500 font-medium">{destination}</p>
                            <div className="mt-2">
                                <p className="text-lg font-bold text-slate-900">{format(toDate, 'HH:mm')}</p>
                                <p className="text-xs text-slate-400">{format(toDate, 'dd MMM')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Ticket Details & Action */}
                <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-dashed border-slate-300 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Gate</p>
                            <p className="font-mono font-bold text-slate-900">B12</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Seat</p>
                            <p className="font-mono font-bold text-slate-900">{seatNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Boarding</p>
                            <p className="font-bold text-slate-900">{format(new Date(fromDate.getTime() - 45 * 60000), 'HH:mm')}</p>
                        </div>
                    </div>

                    <div className="mt-auto">
                        {canCancel ? (
                            <Button
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancel(booking);
                                }}
                                disabled={isCancelling}
                            >
                                Cancel Flight
                            </Button>
                        ) : (
                            <div className="bg-slate-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-slate-500">Booking Reference</p>
                                <p className="font-mono font-bold text-slate-700 tracking-widest">{booking.id.slice(0, 6).toUpperCase()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Perforation circles */}
            <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-50 rounded-full" />
            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-50 rounded-full" />
        </div>
    );
}
