"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { cancelBooking, fromFirestore } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { Loader2, Ticket, History, CalendarX2 } from 'lucide-react';
import { startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// Import Cards
import { BookingCardHotel } from './booking-card-hotel';
import { BookingCardFlight } from './booking-card-flight';
import { BookingCardBus } from './booking-card-bus';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function BookingsDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCancelling, startTransition] = useTransition();
    const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const bookingsQuery = query(
                collection(db, 'bookings'),
                where('userId', '==', user.id)
            );

            const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
                const userBookings = snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
                // Sort by date desc
                userBookings.sort((a, b) => (b.fromDate as Date).getTime() - (a.fromDate as Date).getTime());
                setBookings(userBookings);
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            setBookings([]);
            setLoading(false);
        }
    }, [user]);

    const handleCancelBooking = async () => {
        if (!bookingToCancel) return;

        startTransition(async () => {
            try {
                await cancelBooking(bookingToCancel.id);
                toast({
                    title: "Booking Cancelled",
                    description: "Your reservation has been successfully cancelled.",
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Cancellation Failed",
                    description: (error as Error).message || "There was a problem cancelling your booking.",
                });
            } finally {
                setBookingToCancel(null);
            }
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                <p className="text-slate-500 animate-pulse">Loading your trips...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
                <h3 className="text-lg font-semibold mb-2">Sign in to view bookings</h3>
                <p className="text-slate-500 mb-6">You need an account to manage your trips.</p>
                <Button asChild>
                    <Link href="/login">Sign In</Link>
                </Button>
            </div>
        );
    }

    // Filter Bookings
    const hotelBookings = bookings.filter(b => !b.roomId.startsWith('flight-') && !b.roomId.startsWith('bus-'));
    const flightBookings = bookings.filter(b => b.roomId.startsWith('flight-'));
    const busBookings = bookings.filter(b => b.roomId.startsWith('bus-'));

    const renderBookingsList = (list: Booking[], type: 'hotel' | 'flight' | 'bus') => {
        if (list.length === 0) {
            return (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        {type === 'hotel' ? <Ticket className="w-10 h-10" /> : type === 'flight' ? <Ticket className="w-10 h-10" /> : <Ticket className="w-10 h-10" />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No {type} bookings found</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        Looks like you haven't booked any {type}s yet. Ready to explore?
                    </p>
                    <Button className="bg-orange-600 hover:bg-orange-700" asChild>
                        <Link href={type === 'hotel' ? '/hotels' : type === 'flight' ? '/flights' : '/bus'}>
                            Book a {type === 'bus' ? 'Bus' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </Link>
                    </Button>
                </div>
            )
        }

        return (
            <div className="grid gap-6">
                {list.map(booking => {
                    const fromDate = booking.fromDate as Date;
                    const isCancelled = booking.status.trim().toLowerCase() === 'cancelled';
                    const isDateInPast = startOfDay(fromDate) < startOfDay(new Date());
                    const canCancel = !isCancelled && !isDateInPast;

                    if (type === 'flight') {
                        return <BookingCardFlight key={booking.id} booking={booking} onCancel={setBookingToCancel} isCancelling={isCancelling} canCancel={canCancel} />
                    }
                    if (type === 'bus') {
                        return <BookingCardBus key={booking.id} booking={booking} onCancel={setBookingToCancel} isCancelling={isCancelling} canCancel={canCancel} />
                    }
                    return <BookingCardHotel key={booking.id} booking={booking} onCancel={setBookingToCancel} isCancelling={isCancelling} canCancel={canCancel} />
                })}
            </div>
        )
    }

    return (
        <>
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-8 w-full justify-start overflow-x-auto h-12 bg-transparent p-0 border-b border-slate-200 rounded-none gap-2">
                    <TabsTrigger
                        value="all"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-orange-600 px-4 sm:px-8 text-base h-full"
                    >
                        All Trips
                    </TabsTrigger>
                    <TabsTrigger
                        value="hotels"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-orange-600 px-4 sm:px-8 text-base h-full"
                    >
                        Hotels
                    </TabsTrigger>
                    <TabsTrigger
                        value="flights"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-orange-600 px-4 sm:px-8 text-base h-full"
                    >
                        Flights
                    </TabsTrigger>
                    <TabsTrigger
                        value="bus"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-orange-600 px-4 sm:px-8 text-base h-full"
                    >
                        Buses
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-8 animate-in slide-in-from-bottom-2 fade-in duration-500">
                    {bookings.length === 0 ? (
                        renderBookingsList([], 'hotel') // General Empty State
                    ) : (
                        <div className="space-y-8">
                            {/* Group by type roughly or just list all sorted by date */}
                            <div className="grid gap-6">
                                {bookings.map(booking => {
                                    const fromDate = booking.fromDate as Date;
                                    const isCancelled = booking.status.trim().toLowerCase() === 'cancelled';
                                    const isDateInPast = startOfDay(fromDate) < startOfDay(new Date());
                                    const canCancel = !isCancelled && !isDateInPast;
                                    const isFlight = booking.roomId.startsWith('flight-');
                                    const isBus = booking.roomId.startsWith('bus-');

                                    if (isFlight) return <BookingCardFlight key={booking.id} booking={booking} onCancel={setBookingToCancel} isCancelling={isCancelling} canCancel={canCancel} />
                                    if (isBus) return <BookingCardBus key={booking.id} booking={booking} onCancel={setBookingToCancel} isCancelling={isCancelling} canCancel={canCancel} />
                                    return <BookingCardHotel key={booking.id} booking={booking} onCancel={setBookingToCancel} isCancelling={isCancelling} canCancel={canCancel} />
                                })}
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="hotels" className="animate-in slide-in-from-bottom-2 fade-in duration-500">
                    {renderBookingsList(hotelBookings, 'hotel')}
                </TabsContent>

                <TabsContent value="flights" className="animate-in slide-in-from-bottom-2 fade-in duration-500">
                    {renderBookingsList(flightBookings, 'flight')}
                </TabsContent>

                <TabsContent value="bus" className="animate-in slide-in-from-bottom-2 fade-in duration-500">
                    {renderBookingsList(busBookings, 'bus')}
                </TabsContent>
            </Tabs>

            <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel your booking for <span className="font-semibold text-slate-900">{bookingToCancel?.hotelName}</span>?
                            <br /><br />
                            This action cannot be undone. Refunds will be processed according to the cancellation policy.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700 text-white">
                            {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Yes, Cancel It
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
