"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fromFirestore } from "@/lib/data";
import { Booking } from "@/lib/types";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookingCardHotel } from "@/components/bookings/booking-card-hotel";
import { BookingCardFlight } from "@/components/bookings/booking-card-flight";
import { BookingCardBus } from "@/components/bookings/booking-card-bus";
import { startOfDay } from "date-fns";

export function UpcomingTrip() {
    const { user } = useAuth();
    const router = useRouter();
    const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Just get all future bookings and sort client side to be safe with indexes or complex queries
        // Ideally we use a compound query: where userId == x AND fromDate >= nowOrderBy fromDate ASC limit 1
        // But Firestore requires an index for this. To avoid blocking index creation errors in this demo,
        // we'll fetch active bookings and filter/sort client side for the single "next" trip.

        const q = query(
            collection(db, 'bookings'),
            where('userId', '==', user.id),
            where('status', '==', 'confirmed')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const bookings = snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];

            const now = new Date();
            // Filter only future trips (or today)
            const futureBookings = bookings.filter(b => {
                const date = b.fromDate instanceof Object && 'toDate' in b.fromDate ? (b.fromDate as any).toDate() : new Date(b.fromDate as any);
                return date >= startOfDay(now);
            });

            // Sort by nearest date
            futureBookings.sort((a, b) => {
                const dateA = a.fromDate instanceof Object && 'toDate' in a.fromDate ? (a.fromDate as any).toDate() : new Date(a.fromDate as any);
                const dateB = b.fromDate instanceof Object && 'toDate' in b.fromDate ? (b.fromDate as any).toDate() : new Date(b.fromDate as any);
                return dateA.getTime() - dateB.getTime();
            });

            setUpcomingBooking(futureBookings[0] || null);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) return <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />;

    if (!upcomingBooking) {
        return (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">No upcoming trips</h3>
                    <p className="text-indigo-100 mb-6 max-w-md">You have no active bookings at the moment. Why not explore some popular destinations?</p>
                    <Button onClick={() => router.push('/hotels')} variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50">
                        Start Exploring
                    </Button>
                </div>
                {/* Decor */}
                <div className="absolute right-0 bottom-0 opacity-10">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor">
                        <path d="M45.5 150l-20-40 50-10 20 40-50 10zm-10-60l20-40 40 10-20 40-40-10z" />
                    </svg>
                </div>
            </div>
        );
    }

    const booking = upcomingBooking;
    const isFlight = booking.roomId.startsWith('flight-');
    const isBus = booking.roomId.startsWith('bus-');
    const isHotel = !isFlight && !isBus;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Your Next Trip</h2>
                <Button variant="link" className="text-orange-600" onClick={() => router.push('/bookings')}>
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {/* Wrap in a container to add specific styling if needed, or just reuse the card */}
            <div className="transform transition-all">
                {isFlight && <BookingCardFlight booking={booking} onCancel={() => { }} isCancelling={false} canCancel={false} />}
                {isBus && <BookingCardBus booking={booking} onCancel={() => { }} isCancelling={false} canCancel={false} />}
                {isHotel && <BookingCardHotel booking={booking} onCancel={() => { }} isCancelling={false} canCancel={false} />}
            </div>
        </div>
    );
}
