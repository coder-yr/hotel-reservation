"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getBookingsByUser, cancelBooking, fromFirestore } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, BedDouble, Calendar, MapPin, Ban, Plane, Clock, Armchair } from 'lucide-react';
import Image from 'next/image';
import { format, isPast, startOfDay } from 'date-fns';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { Button } from './ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Timestamp, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';


export function UserBookings() {
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
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                    Please log in to see your bookings.
                </CardContent>
            </Card>
        );
    }

    if (bookings.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                    You have no bookings yet. Time to <Link href="/" className="text-primary underline">plan a trip</Link>!
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-8">
                {bookings.map((booking) => {
                    const fromDate = booking.fromDate as Date;
                    const toDate = booking.toDate as Date;
                    const isCancelled = booking.status.trim().toLowerCase() === 'cancelled';
                    const isDateInPast = startOfDay(fromDate) < startOfDay(new Date());
                    const canCancel = !isCancelled && !isDateInPast;
                    const isFlight = booking.roomId.startsWith('flight-');

                    if (isFlight) {
                        const [origin, destination] = booking.hotelLocation ? booking.hotelLocation.split(' - ') : ['Origin', 'Dest'];
                        const airlineName = booking.hotelName.split('(')[0].trim();
                        const flightInfo = booking.roomTitle;

                        return (
                            <div key={booking.id} className="relative bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Ticket Perforation Visual */}
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-200" />
                                <div className="absolute right-0 top-1/2 translate-x-1/2 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-200" />

                                <div className="flex flex-col md:flex-row">
                                    {/* Main Ticket Section */}
                                    <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-dashed border-gray-300 relative">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                                    <Plane className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">{airlineName}</h3>
                                                    <p className="text-xs text-gray-500">{flightInfo.split('•')[0].trim()}</p>
                                                </div>
                                            </div>
                                            <Badge className={`${isCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} border-0`}>
                                                {booking.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between gap-8">
                                            <div className="text-center md:text-left">
                                                <div className="text-2xl font-bold text-gray-900">{origin?.substring(0, 3).toUpperCase()}</div>
                                                <div className="text-xs text-gray-500">{format(fromDate, 'HH:mm')}</div>
                                                <div className="text-xs text-gray-400">{format(fromDate, 'dd MMM')}</div>
                                            </div>

                                            <div className="flex-1 flex flex-col items-center px-4">
                                                <div className="text-xs text-gray-400 mb-1">Duration</div>
                                                <div className="w-full h-[1px] bg-gray-300 relative flex items-center justify-center">
                                                    <Plane className="w-4 h-4 text-gray-300 absolute bg-white px-1" />
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">Non-stop</div>
                                            </div>

                                            <div className="text-center md:text-right">
                                                <div className="text-2xl font-bold text-gray-900">{destination?.substring(0, 3).toUpperCase()}</div>
                                                <div className="text-xs text-gray-500">{format(toDate, 'HH:mm')}</div>
                                                <div className="text-xs text-gray-400">{format(toDate, 'dd MMM')}</div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Armchair className="w-4 h-4" />
                                                <span>{flightInfo.split('•')[1]?.trim() || 'Any Seat'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>Check-in closes 60m prior</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price & Action Section */}
                                    <div className="w-full md:w-64 bg-gray-50 p-6 flex flex-col justify-between items-center text-center">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Fare</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(booking.totalPrice || 0)}
                                            </p>
                                        </div>

                                        <div className="w-full space-y-3 mt-4">
                                            {canCancel ? (
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => setBookingToCancel(booking)}
                                                    disabled={isCancelling}
                                                >
                                                    {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
                                                    Cancel Booking
                                                </Button>
                                            ) : (
                                                <div className="text-xs text-gray-400">
                                                    Booking ID: <span className="font-mono">{booking.id.slice(0, 8)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <Card key={booking.id} className="overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-2xl border border-pink-100">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 relative h-56 md:h-auto">
                                    <Image
                                        src={booking.coverImage || 'https://placehold.co/600x400.png'}
                                        alt={`Image of ${booking.hotelName}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className={`bg-muted ${isCancelled ? 'filter grayscale blur-sm' : ''}`}
                                    />
                                    {isCancelled && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold">CANCELLED</div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full md:w-2/3 flex flex-col bg-white">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <Badge className={`mb-2 capitalize ${isCancelled ? 'bg-red-100 text-red-700' : booking.status.trim().toLowerCase() === 'confirmed' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>{booking.status}</Badge>
                                                <h2 className="text-2xl font-headline font-bold">{booking.hotelName}</h2>
                                                <p className="text-lg font-semibold text-primary">{booking.roomTitle}</p>
                                                <div className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                                                    <MapPin className="h-4 w-4" /> {booking.hotelLocation}
                                                </div>
                                            </div>
                                            <div className="hidden sm:block text-sm text-muted-foreground text-right">
                                                <p className="font-semibold">Booking ID</p>
                                                <p className="font-mono text-xs mt-1">{booking.id}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-semibold">Check-in</p>
                                                    <p>{format(fromDate, 'eee, LLL dd, yyyy')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-semibold">Check-out</p>
                                                    <p>{format(toDate, 'eee, LLL dd, yyyy')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <CardFooter className="mt-auto bg-rose-50 p-4 flex items-center justify-between rounded-b-xl">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Price</p>
                                            <p className="text-2xl font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(booking.totalPrice || 0)}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {canCancel ? (
                                                <Button variant="destructive" onClick={() => setBookingToCancel(booking)} disabled={isCancelling}>
                                                    {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
                                                    Cancel Booking
                                                </Button>
                                            ) : (
                                                <div className="text-xs text-muted-foreground hidden sm:block">Booking ID: <span className="font-mono text-xs ml-2">{booking.id}</span></div>
                                            )}
                                        </div>
                                    </CardFooter>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently cancel your booking
                            for <span className="font-semibold">{bookingToCancel?.hotelName}</span>. Please review the hotel's cancellation policy.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Back</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Yes, cancel booking
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
