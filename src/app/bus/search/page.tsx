"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BusCard, BusCardProps } from '@/components/BusCard';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchForm } from '@/components/search-form'; // Use the new multi-tab search form
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import BusBookingModal from '@/components/bus-booking-modal';

// Mock Data for Demo
const MOCK_BUSES: BusCardProps[] = [
    {
        id: 'mock-1',
        operator: 'Zingbus Premium',
        busType: 'Volvo AC Multi-Axle Sleeper',
        departureTime: '21:30',
        arrivalTime: '07:00',
        duration: '9h 30m',
        rating: 4.8,
        reviews: 324,
        price: 1450,
        seatsAvailable: 12,
        amenities: ['wifi', 'water', 'charging', 'blanket'],
        seats: [],
        source: 'Mumbai',
        destination: 'Goa'
    },
    {
        id: 'mock-2',
        operator: 'VRL Travels',
        busType: 'Scania AC Seater/Sleeper',
        departureTime: '22:00',
        arrivalTime: '08:15',
        duration: '10h 15m',
        rating: 4.5,
        reviews: 856,
        price: 1100,
        seatsAvailable: 24,
        amenities: ['charging', 'reading_light', 'cctv'],
        seats: [],
        source: 'Mumbai',
        destination: 'Goa'
    },
    {
        id: 'mock-3',
        operator: 'IntrCity SmartBus',
        busType: 'AC Sleeper (2+1)',
        departureTime: '19:45',
        arrivalTime: '05:30',
        duration: '9h 45m',
        rating: 4.6,
        reviews: 120,
        price: 1650,
        seatsAvailable: 8,
        amenities: ['wifi', 'water', 'washroom', 'snacks'],
        seats: [],
        source: 'Bangalore',
        destination: 'Goa'
    },
    {
        id: 'mock-4',
        operator: 'Orange Travels',
        busType: 'Bharat Benz AC Sleeper',
        departureTime: '23:15',
        arrivalTime: '06:00',
        duration: '6h 45m',
        rating: 4.3,
        reviews: 410,
        price: 850,
        seatsAvailable: 15,
        amenities: ['charging', 'water'],
        seats: [],
        source: 'Chennai',
        destination: 'Bangalore'
    }
];

export default function BusSearchResultsPage() {
    const searchParams = useSearchParams();
    const [buses, setBuses] = useState<BusCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    const from = searchParams.get('origin') || '';
    const to = searchParams.get('destination') || '';
    const date = searchParams.get('from') || '';

    useEffect(() => {
        const fetchAndFilterBuses = async () => {
            setLoading(true);
            try {
                // Try fetching from DB
                const querySnapshot = await getDocs(collection(db, 'buses'));

                let allBuses: BusCardProps[] = [];

                if (!querySnapshot.empty) {
                    allBuses = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            operator: data.operator || 'Unknown Operator',
                            busType: data.busType || 'AC Sleeper',
                            departureTime: data.depart || '20:00',
                            arrivalTime: data.arrive || '06:00',
                            duration: data.duration || '10h',
                            rating: typeof data.rating === 'number' ? data.rating : 4.2,
                            reviews: typeof data.reviews === 'number' ? data.reviews : 50,
                            price: typeof data.price === 'string' ? parseInt(data.price.replace(/[^\d]/g, '')) : (typeof data.price === 'number' ? data.price : 900),
                            seatsAvailable: Array.isArray(data.seats) ? data.seats.filter((s: any) => s.status === 'available').length : 20,
                            amenities: Array.isArray(data.amenities) ? data.amenities : ['wifi', 'water'],
                            seats: Array.isArray(data.seats) ? data.seats : [],
                            source: data.source || data.origin || 'Mumbai', // Handle variations
                            destination: data.destination || 'Goa'
                        };
                    });
                } else {
                    console.log("DB empty, using MOCK_BUSES");
                    // Mock ID generation to avoid key conflicts
                    allBuses = MOCK_BUSES.map(b => ({ ...b }));
                }

                // Client-side Filtering
                const searchFrom = from.toLowerCase().trim();
                const searchTo = to.toLowerCase().trim();

                let filtered = allBuses.filter(bus => {
                    // If DB doesn't have source/dest, we loosely match or show all if nothing typed
                    if (!from && !to) return true;

                    const busSource = bus.source?.toLowerCase() || '';
                    const busDest = bus.destination?.toLowerCase() || '';

                    // Loose matching (substring)
                    const matchFrom = !from || busSource.includes(searchFrom);
                    const matchTo = !to || busDest.includes(searchTo);

                    return matchFrom && matchTo;
                });

                // If strictly filtered list is empty, and we are in demo mode (using mock data or empty DB), 
                // show ALL mock buses to ensure user sees SOMETHING.
                if (filtered.length === 0 && (querySnapshot.empty || allBuses.length < 5)) {
                    console.log("No exact matches, showing all mock buses for demo.");
                    filtered = MOCK_BUSES; // Fallback to show all mock buses
                }

                setBuses(filtered);

            } catch (error) {
                console.error('Error fetching buses:', error);
                setBuses(MOCK_BUSES); // Fallback on error
            } finally {
                setLoading(false);
            }
        };
        fetchAndFilterBuses();
    }, [from, to, date]);

    const [selectedBus, setSelectedBus] = useState<BusCardProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background">
            <Header />

            {/* Header / Search Refinement */}
            <div className="bg-slate-900 pt-28 pb-12 px-4 transition-all">
                <div className="container mx-auto">
                    <h1 className="text-white text-3xl font-bold mb-6 text-center">Select your bus</h1>
                    {/* Force Tab to 'bus' by default? Logic inside SearchForm handles state, but we can't force prop easily without modifying it. Users can click tab. */}
                    <SearchForm />
                </div>
            </div>

            <main className="container mx-auto px-4 py-12 flex-1">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-1/4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                            <h3 className="font-bold text-lg mb-4">Filters</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2 text-slate-500">Bus Type</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-slate-300" /> AC Sleeper</label>
                                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-slate-300" /> Non-AC Seater</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results */}
                    <section className="lg:w-3/4 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                {loading ? 'Searching...' : `${buses.length} buses found`}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {from} to {to} • {date || 'Today'}
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                            </div>
                        ) : buses.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <h3 className="text-lg font-bold mb-2">No buses found</h3>
                                <p className="text-slate-500">Try searching for generic routes or empty search to see all buses (DB might be empty).</p>
                            </div>
                        ) : (
                            buses.map((bus, idx) => (
                                <BusCard
                                    key={bus.id || idx}
                                    {...bus}
                                    onBook={(b) => { setSelectedBus(b); setIsModalOpen(true); }}
                                />
                            ))
                        )}
                    </section>
                </div>
            </main>
            <Footer />

            <BusBookingModal
                bus={selectedBus}
                open={isModalOpen}
                onOpenChangeAction={setIsModalOpen}
                travelDate={date}
            />
        </div>
    );
}
