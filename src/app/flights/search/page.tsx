"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchForm } from "@/components/search-form";
import { Flight, searchFlights } from "@/lib/mock-flight-data";
import { FlightCard } from "@/components/flight-card";
import { Loader2 } from "lucide-react";

export default function FlightSearchResultsPage() {
    const searchParams = useSearchParams();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);

    const from = searchParams.get('origin') || '';
    const to = searchParams.get('destination') || '';
    const date = searchParams.get('from') || '';

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            const results = await searchFlights(from, to, date);
            setFlights(results);
            setLoading(false);
        };

        fetchFlights();
    }, [from, to, date]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background">
            <Header />

            {/* Header / Search Refinement */}
            <div className="bg-slate-900 pt-28 pb-12 px-4">
                <div className="container mx-auto">
                    <h1 className="text-white text-3xl font-bold mb-6 text-center">Select your flight</h1>
                    <SearchForm />
                </div>
            </div>

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Filters Sidebar (Placeholder) */}
                    <div className="hidden md:block w-64 shrink-0 space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                            <h3 className="font-bold text-lg mb-4">Filters</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2 text-slate-500">Stops</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-slate-300" /> Non-stop</label>
                                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-slate-300" /> 1 Stop</label>
                                    </div>
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-slate-800" />
                                <div>
                                    <h4 className="text-sm font-medium mb-2 text-slate-500">Airlines</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-slate-300" /> Indigo</label>
                                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-slate-300" /> Air India</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="flex-grow space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                {loading ? 'Searching...' : `${flights.length} flights found`}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {from} to {to} • {date || 'Any Date'}
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
                                <p className="text-slate-500">Finding the best fares for you...</p>
                            </div>
                        ) : flights.length > 0 ? (
                            flights.map(flight => (
                                <FlightCard key={flight.id} flight={flight} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <h3 className="text-lg font-bold mb-2">No flights found</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    We couldn't find any flights matching your criteria. Try changing dates or cities.
                                    <br /><span className="text-xs text-slate-400 mt-2 block">(Try 'DEL' to 'BLR' for demo results)</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
