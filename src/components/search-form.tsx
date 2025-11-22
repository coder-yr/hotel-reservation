
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Calendar as CalendarIcon, Minus, Plus } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

export function SearchForm() {
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState({
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

            // Adults must be at least 1 if other guests are present
            if (type === 'adults' && new_val < 1 && (prev.children > 0 || prev.infants > 0)) {
                return prev;
            }

            return { ...prev, [type]: new_val };
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (destination) {
            params.set('destination', destination);
        }
        if (dateRange?.from) {
            params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
        }
        if (dateRange?.to) {
            params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
        }
        if (totalGuests > 0) {
            params.set('guests', totalGuests.toString());
        }
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-2 p-2 glass rounded-[2rem] shadow-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10">

                <div className="w-full md:w-auto flex-grow flex items-center p-3 rounded-[1.5rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="pl-4 pr-2 w-full">
                        <label htmlFor="destination" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Where</label>
                        <input
                            id="destination"
                            type="text"
                            placeholder="Search destinations"
                            className="w-full text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none bg-transparent"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700 mx-2" />

                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center w-full md:w-auto gap-2">
                            <button type="button" className="w-full md:w-auto flex-grow flex items-center p-3 rounded-[1.5rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all text-left group">
                                <div className="px-4">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Check in</p>
                                    <p className="text-base font-medium text-slate-900 dark:text-white">{dateRange?.from ? format(dateRange.from, "LLL dd") : "Add dates"}</p>
                                </div>
                            </button>
                            <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700 mx-2" />
                            <button type="button" className="w-full md:w-auto flex-grow flex items-center p-3 rounded-[1.5rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all text-left group">
                                <div className="px-4">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Check out</p>
                                    <p className="text-base font-medium text-slate-900 dark:text-white">{dateRange?.to ? format(dateRange.to, "LLL dd") : "Add dates"}</p>
                                </div>
                            </button>
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

                <div className="w-full md:w-auto flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button type="button" className="flex-grow flex items-center text-left pl-6 pr-2 py-3 rounded-[1.5rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all">
                                <div className="flex-grow">
                                    <label htmlFor="guests" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Who</label>
                                    <p className="text-base font-medium text-slate-900 dark:text-white">{guestText}</p>
                                </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl" align="end">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Guests</h4>
                                    <p className="text-sm text-muted-foreground">Select the number of guests.</p>
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
    );
}
