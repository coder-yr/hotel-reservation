"use client";

import { Bus, Clock, MapPin } from "lucide-react";
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

export function BookingCardBus({ booking, onCancel, isCancelling, canCancel }: Props) {
    const fromDate = booking.fromDate as Date;
    //   const toDate = booking.toDate as Date;
    const isCancelled = booking.status.trim().toLowerCase() === 'cancelled';
    const [source, destination] = booking.hotelLocation ? booking.hotelLocation.split(' - ') : ['Source', 'Dest'];
    const operatorName = (booking.hotelName || 'Unknown Operator').split('(')[0].trim();
    const busType = (booking.hotelName || 'Unknown').split('(')[1]?.replace(')', '') || 'AC Sleeper';
    const seatInfo = booking.roomTitle || 'Seat Any';
    const seatNumber = seatInfo.split('Seat')[1]?.trim().split('(')[0] || 'Any';
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/bookings/${booking.id}`)}
            className={`relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group ${isCancelled ? 'opacity-80' : ''} cursor-pointer`}
        >
            <div className="flex flex-col sm:flex-row">
                {/* Left Color Bar based on Status */}
                <div className={`w-full sm:w-2 h-2 sm:h-auto ${isCancelled ? 'bg-red-500' : 'bg-orange-500'}`} />

                <div className="flex-1 p-5 sm:p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">{operatorName}</h3>
                            <p className="text-xs text-slate-500">{busType}</p>
                        </div>
                        <Badge variant="secondary" className={isCancelled ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}>
                            {booking.status}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1">
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-slate-900">{format(fromDate, 'HH:mm')}</span>
                                <span className="text-xs text-slate-500">{source}</span>
                                <span className="text-xs text-slate-400 mt-0.5">{format(fromDate, 'dd MMM')}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center px-2">
                            <div className="text-[10px] text-slate-400 mb-1">12h 15m</div>
                            <div className="w-16 h-[2px] bg-slate-200 relative">
                                <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45" />
                            </div>
                        </div>

                        <div className="flex-1 text-right">
                            <div className="flex flex-col items-end">
                                <span className="text-lg font-bold text-slate-900">06:45</span>
                                <span className="text-xs text-slate-500">{destination}</span>
                                <span className="text-xs text-slate-400 mt-0.5">{format(new Date(fromDate.getTime() + 12 * 60 * 60 * 1000), 'dd MMM')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                                {seatNumber}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Seat Number</p>
                                <p className="font-medium text-slate-900">{seatInfo.includes('Upper') ? 'Upper Deck' : 'Lower Deck'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Total Fare</p>
                            <p className="font-bold text-slate-900">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(booking.totalPrice)}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-slate-50 sm:w-48 border-t sm:border-t-0 sm:border-l border-slate-100 p-5 sm:p-6 flex flex-col justify-center gap-3">
                    {canCancel ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancel(booking);
                            }}
                            disabled={isCancelling}
                        >
                            Cancel Ticket
                        </Button>
                    ) : (
                        <Button variant="secondary" size="sm" className="w-full" disabled>
                            Receipt
                        </Button>
                    )}
                    <Button size="sm" variant="outline" className="w-full">
                        Track Bus
                    </Button>
                </div>
            </div>
        </div>
    );
}
