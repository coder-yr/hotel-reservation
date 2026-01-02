"use client";

import { GripHorizontal } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SeatSelectionProps {
    selectedSeats: string[];
    onSeatSelect: (seats: string[]) => void;
    bus?: any;
}

export function SeatSelection({ selectedSeats, onSeatSelect, bus }: SeatSelectionProps) {
    // Mock seat layout if bus data is missing or incomplete
    const seatLayout = bus?.seats || generateMockSeats();

    const handleSeatClick = (seatId: string) => {
        if (selectedSeats.includes(seatId)) {
            onSeatSelect(selectedSeats.filter(id => id !== seatId));
        } else {
            onSeatSelect([...selectedSeats, seatId]);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Select Seats</h2>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <div className="border-2 border-slate-200 rounded-xl p-4 relative max-w-sm mx-auto">
                        {/* Driver Icon */}
                        <div className="absolute top-4 right-4">
                            <GripHorizontal className="w-8 h-8 text-slate-400" />
                        </div>

                        {/* Seat Grid */}
                        <div className="grid grid-cols-4 gap-4 mt-12">
                            {seatLayout.map((seat: any) => (
                                <button
                                    key={seat.id}
                                    disabled={seat.isBooked}
                                    onClick={() => handleSeatClick(seat.id)}
                                    className={cn(
                                        "w-10 h-10 rounded-md flex items-center justify-center text-xs font-medium transition-all",
                                        seat.isBooked ? "bg-slate-300 cursor-not-allowed text-slate-500" :
                                            selectedSeats.includes(seat.id) ? "bg-primary text-primary-foreground shadow-lg scale-110" :
                                                "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                                    )}
                                >
                                    {seat.number}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200" />
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-primary" />
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-300" />
                        <span>Booked</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function generateMockSeats() {
    const seats = [];
    // Lower Deck / Seater
    for (let i = 1; i <= 20; i++) {
        seats.push({
            id: `L${i}`,
            number: `${i}`,
            type: 'seater',
            price: 500,
            isBooked: Math.random() > 0.8
        });
    }
    return seats;
}
