
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, Minus, Plus, Building2, Plane, Bus as BusIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';

type SearchType = 'hotel' | 'flight' | 'bus';

interface SearchFormProps {
    defaultTab?: SearchType;
    initialValues?: {
        destination?: string;
        origin?: string;
        dates?: DateRange;
        guests?: { adults: number; children: number; infants: number };
    }
}

export function SearchForm({ defaultTab = 'hotel', initialValues }: SearchFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SearchType>(defaultTab);
    const [destination, setDestination] = useState(initialValues?.destination || '');
    const [origin, setOrigin] = useState(initialValues?.origin || ''); // New for Flights/Bus
    const [dateRange, setDateRange] = useState<DateRange | undefined>(initialValues?.dates);
    const [guests, setGuests] = useState(initialValues?.guests || {
        adults: 1,
        children: 0,
        infants: 0
    });

    const totalGuests = guests.adults + guests.children;
    const guestText = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests';

    const handleGuestChange = (type: keyof typeof guests, operation: 'increment' | 'decrement') => {
        setGuests(prev => {
            const current_val = prev[type];
            const new_val = operation === 'increment' ? current_val + 1 : Math.max(0, current_val - 1);
            if (type === 'adults' && new_val < 1 && (prev.children > 0 || prev.infants > 0)) return prev;
            return { ...prev, [type]: new_val };
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (activeTab === 'hotel') {
            if (destination) params.set('location', destination); // Hotel API expects 'location' often
        } else {
            if (origin) params.set('origin', origin);
            if (destination) params.set('destination', destination);
        }

        if (dateRange?.from) params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
        if (dateRange?.to) params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
        if (totalGuests > 0) params.set('guests', totalGuests.toString());

        // Route mapping
        const routes = {
            hotel: '/hotels',
            flight: '/flights/results',
            bus: '/bus/search'
        };

        router.push(`${routes[activeTab]}?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex justify-center">
                <div className="flex p-1 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                    {[
                        { id: 'hotel', label: 'Stays', icon: Building2 },
                        { id: 'flight', label: 'Flights', icon: Plane },
                        { id: 'bus', label: 'Bus', icon: BusIcon },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as SearchType)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                activeTab === tab.id
                                    ? "bg-white text-slate-900 shadow-sm transform scale-105"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full relative z-20">
                <div className="flex flex-col md:flex-row items-center gap-2 p-2 glass rounded-[2rem] shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10">

                    {/* Left Section: Inputs */}
                    <div className="w-full flex-grow flex flex-col md:flex-row items-center">

                        {/* Origin (Only for Flights/Bus) */}
                        {activeTab !== 'hotel' && (
                            <>
                                <div className="w-full md:w-auto flex-grow flex items-center p-3 rounded-[1.5rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all text-left group cursor-text">
                                    <div className="pl-4 pr-2 w-full">
                                        <label htmlFor="origin" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">From</label>
                                        <input
                                            id="origin"
                                            type="text"
                                            placeholder="City or Airport"
                                            className="w-full text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none bg-transparent truncate"
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700 mx-2" />
                            </>
                        )}

                        {/* Destination */}
                        <div className="w-full md:w-auto flex-grow flex items-center p-3 rounded-[1.5rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all text-left group cursor-text">
                            <div className="pl-4 pr-2 w-full">
                                <label htmlFor="destination" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    {activeTab === 'hotel' ? 'Where' : 'To'}
                                </label>
                                <input
                                    id="destination"
                                    type="text"
                                    placeholder={activeTab === 'hotel' ? "Search destinations" : "City or Airport"}
                                    className="w-full text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none bg-transparent truncate"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700 mx-2" />

                    {/* Date Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="flex items-center w-full md:w-auto gap-2 cursor-pointer">
                                <div className="w-full md:w-auto flex-grow flex items-center p-3 rounded-[1.5rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all text-left group">
                                    <div className="px-4 whitespace-nowrap">
                                        <p className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                            {activeTab === 'hotel' ? 'Check in' : 'Dates'}
                                        </p>
                                        <p className="text-base font-medium text-slate-900 dark:text-white">
                                            {dateRange?.from ? format(dateRange.from, "MMM dd") : "Add dates"}
                                            {dateRange?.from && activeTab === 'hotel' ? " - " : ""}
                                            {activeTab === 'hotel' && dateRange?.to ? format(dateRange.to, "MMM dd") : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl" align="center">
                            <Calendar
                                initialFocus
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                className="bg-transparent"
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700 mx-2" />

                    {/* Guests */}
                    <div className="w-full md:w-auto flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button type="button" className="flex-grow flex items-center text-left pl-6 pr-2 py-3 rounded-[1.5rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all whitespace-nowrap">
                                    <div className="flex-grow">
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                            {activeTab === 'hotel' ? 'Who' : 'Passengers'}
                                        </label>
                                        <p className="text-base font-medium text-slate-900 dark:text-white">{guestText}</p>
                                    </div>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl" align="end">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Guests</h4>
                                        <p className="text-sm text-muted-foreground">Select the number of travelers.</p>
                                    </div>
                                    <div className="grid gap-4">
                                        {Object.entries(guests).map(([type, count]) => (
                                            <div key={type} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium capitalize">{type}</p>
                                                    {type === 'infants' && <p className="text-xs text-muted-foreground">Under 2</p>}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => handleGuestChange(type as keyof typeof guests, 'decrement')}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-4 text-center">{count}</span>
                                                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => handleGuestChange(type as keyof typeof guests, 'increment')}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Button type="submit" size="icon" className="rounded-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white h-16 w-16 shrink-0 shadow-lg shadow-teal-500/30 transition-all hover:scale-105 active:scale-95 ml-2">
                            <Search className="h-6 w-6" />
                            <span className="sr-only">Search</span>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
