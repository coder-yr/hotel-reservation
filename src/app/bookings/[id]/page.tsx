"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBookingById } from "@/lib/data";
import { Booking } from "@/lib/types";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Loader2, ArrowLeft, Calendar, MapPin, Clock, Download, CheckCircle, Ticket, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { formatINR } from "@/lib/utils";

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!id) return;
            try {
                const data = await getBookingById(id);
                if (data) {
                    setBooking(data);
                } else {
                    // Handle not found
                }
            } catch (error) {
                console.error("Error fetching booking:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Booking Not Found</h1>
                    <p className="text-slate-500 mb-8">We couldn't find the booking you're looking for.</p>
                    <Button onClick={() => router.push('/bookings')}>Back to Bookings</Button>
                </main>
                <Footer />
            </div>
        );
    }

    const fromDate = booking.fromDate instanceof Object && 'toDate' in booking.fromDate ? (booking.fromDate as any).toDate() : new Date(booking.fromDate as any);
    const toDate = booking.toDate instanceof Object && 'toDate' in booking.toDate ? (booking.toDate as any).toDate() : new Date(booking.toDate as any);
    const isCancelled = booking.status === 'cancelled';

    // Determine Type
    const isFlight = booking.roomId.startsWith('flight-');
    const isBus = booking.roomId.startsWith('bus-');
    const isHotel = !isFlight && !isBus;

    // Type specific color themes
    const themeColor = isFlight ? 'blue' : isBus ? 'orange' : 'rose';

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-orange-600 transition-colors" onClick={() => router.push('/bookings')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Trips
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Ticket/Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Status Banner */}
                        <div className={`rounded-xl p-6 flex items-center justify-between shadow-sm ${isCancelled ? 'bg-red-50 border border-red-100' : 'bg-white border border-slate-200'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCancelled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {isCancelled ? <Ticket className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">{isCancelled ? 'Booking Cancelled' : 'Booking Confirmed'}</h1>
                                    <p className="text-sm text-slate-500">Reference ID: <span className="font-mono text-slate-700">{booking.id}</span></p>
                                </div>
                            </div>
                            {!isCancelled && (
                                <Button variant="outline" className="hidden sm:flex gap-2">
                                    <Download className="h-4 w-4" /> Download Ticket
                                </Button>
                            )}
                        </div>

                        {/* Main Detail Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Header Image */}
                            <div className="relative h-48 md:h-64 w-full">
                                <Image
                                    src={booking.coverImage || 'https://placehold.co/1200x400'}
                                    alt="Cover"
                                    fill
                                    className={`object-cover ${isCancelled ? 'grayscale' : ''}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className={`bg-${themeColor}-500 hover:bg-${themeColor}-600 border-0`}>
                                            {isFlight ? 'Flight' : isBus ? 'Bus' : 'Hotel'}
                                        </Badge>
                                        <div className="flex items-center text-sm font-medium bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded text-white/90">
                                            <MapPin className="w-3 h-3 mr-1" /> {booking.hotelLocation}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-headline font-bold">{booking.hotelName}</h2>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                {/* Itinerary Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                                            {isFlight ? 'Departure' : 'Check-in'}
                                        </p>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg">
                                                <Calendar className="w-6 h-6 text-slate-700" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-slate-900">{format(fromDate, 'EEE, MMM dd, yyyy')}</p>
                                                <p className="text-slate-500">{format(fromDate, 'hh:mm a')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                                            {isFlight ? 'Arrival' : 'Check-out'}
                                        </p>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg">
                                                <Calendar className="w-6 h-6 text-slate-700" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-slate-900">{format(toDate, 'EEE, MMM dd, yyyy')}</p>
                                                <p className="text-slate-500">{format(toDate, 'hh:mm a')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                {/* Booking Details */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Reservation Details</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Booked by</p>
                                            <p className="font-medium text-slate-900">{booking.userName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">
                                                {isFlight || isBus ? 'Seat' : 'Room Type'}
                                            </p>
                                            <p className="font-medium text-slate-900">{booking.roomTitle}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                                            <p className="font-medium text-slate-900">{formatINR(booking.totalPrice)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Status</p>
                                            <p className={`font-medium capitalize ${isCancelled ? 'text-red-600' : 'text-green-600'}`}>
                                                {booking.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Payment Summary</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Base Fare</span>
                                    <span className="text-slate-900 font-medium">{formatINR(booking.totalPrice * 0.82)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Taxes & Fees</span>
                                    <span className="text-slate-900 font-medium">{formatINR(booking.totalPrice * 0.18)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-base">
                                    <span className="text-slate-900 font-bold">Total Paid</span>
                                    <span className="text-slate-900 font-bold">{formatINR(booking.totalPrice)}</span>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3 text-xs text-slate-500">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Type: Credit Card ending in 4242
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
                            <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Printer className="w-4 h-4" /> Print Receipt
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Share2 className="w-4 h-4" /> Email Itinerary
                            </Button>
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
