"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Wifi, ChevronDown, ChevronUp, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BusCardProps {
    id: string;
    operator: string;
    busType: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    rating: number;
    reviews: number;
    price: number;
    seatsAvailable: number;
    amenities: string[];
    seats?: any[];
    source: string;
    destination: string;
    onBook?: (bus: BusCardProps, selectedSeats: string[], boarding: string, dropping: string) => void;
}

// Generate mock seat layout (Lower Deck)
const generateSeats = () => {
    const seats = [];
    const rows = 12;
    const layout = ['A', 'B', '', 'C', 'D']; // '' represents aisle

    for (let row = 1; row <= rows; row++) {
        layout.forEach((col, idx) => {
            if (col) {
                const seatId = `${col}${row}`;
                const isBooked = Math.random() > 0.7; // Random booking for demo
                seats.push({
                    id: seatId,
                    row,
                    col,
                    status: isBooked ? 'booked' : 'available',
                    type: row <= 2 ? 'sleeper' : 'seater',
                    price: row <= 2 ? 200 : 150
                });
            }
        });
    }
    return seats;
};

const BOARDING_POINTS = [
    { name: 'Borivali East', time: '20:30' },
    { name: 'Dadar West', time: '21:00' },
    { name: 'Bandra Kurla Complex', time: '21:30' },
];

const DROPPING_POINTS = [
    { name: 'Panjim Bus Stand', time: '06:00' },
    { name: 'Mapusa Circle', time: '06:30' },
    { name: 'Calangute Beach', time: '07:00' },
];

export const BusCard = (props: BusCardProps) => {
    const {
        id,
        operator,
        busType,
        departureTime,
        arrivalTime,
        duration,
        rating,
        reviews,
        price,
        seatsAvailable,
        amenities,
        onBook
    } = props;

    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [selectedBoarding, setSelectedBoarding] = useState('');
    const [selectedDropping, setSelectedDropping] = useState('');
    const [seatLayout] = useState(generateSeats());

    const handleSeatClick = (seatId: string, status: string) => {
        if (status === 'booked') return;

        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(s => s !== seatId)
                : [...prev, seatId]
        );
    };

    const totalAmount = selectedSeats.reduce((acc, seatId) => {
        const seat = seatLayout.find(s => s.id === seatId);
        return acc + (seat?.price || 0);
    }, 0);

    const handleProceed = () => {
        if (selectedSeats.length === 0 || !selectedBoarding || !selectedDropping) return;
        onBook?.(props, selectedSeats, selectedBoarding, selectedDropping);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all mb-4 overflow-hidden">
            {/* Main Card */}
            <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Operator Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-gray-900 mb-1">{operator}</h3>
                        <p className="text-xs text-gray-500 mb-2">{busType}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            {amenities.slice(0, 3).map((amenity, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                    {amenity === 'wifi' && <Wifi className="w-2.5 h-2.5 mr-1" />}
                                    {amenity}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Timing */}
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">{departureTime}</p>
                            <p className="text-xs text-gray-500">{props.source}</p>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-xs text-gray-400 mb-1">{duration}</p>
                            <div className="w-20 h-[1px] bg-gray-300 relative">
                                <div className="absolute -top-1 left-0 w-2 h-2 bg-gray-400 rounded-full"></div>
                                <div className="absolute -top-1 right-0 w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">{arrivalTime}</p>
                            <p className="text-xs text-gray-500">{props.destination}</p>
                        </div>
                    </div>

                    {/* Rating & Price */}
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end mb-2">
                            <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                                <Star className="h-3 w-3 fill-white" />
                                {rating}
                            </div>
                            <span className="text-xs text-gray-400">({reviews})</span>
                        </div>
                        <p className="text-xs text-gray-400 line-through">₹{Math.round(price * 1.15)}</p>
                        <p className="text-2xl font-bold text-gray-900">₹{price}</p>
                    </div>

                    {/* Action Button */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">{seatsAvailable} Seats</p>
                        <Button
                            onClick={() => setExpanded(!expanded)}
                            variant={expanded ? "outline" : "default"}
                            className={cn(
                                "min-w-[120px]",
                                !expanded && "bg-orange-600 hover:bg-orange-700 text-white"
                            )}
                        >
                            {expanded ? (
                                <>Hide Seats <ChevronUp className="ml-1 h-4 w-4" /></>
                            ) : (
                                <>View Seats <ChevronDown className="ml-1 h-4 w-4" /></>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Expandable Seat Selection */}
            {expanded && (
                <div className="border-t bg-gray-50 p-6 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Seat Map */}
                        <div className="col-span-5 bg-white rounded-lg p-4 border">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-sm">Select Seats</h4>
                                <div className="flex gap-3 text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                                        <span>Available</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                        <span>Selected</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                        <span>Booked</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lower Deck Label */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-gray-600">Lower Deck</span>
                                <div className="text-xs text-gray-400">Steering →</div>
                            </div>

                            {/* Seat Grid */}
                            <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: 12 }).map((_, rowIdx) => (
                                    <React.Fragment key={rowIdx}>
                                        {['A', 'B', '', 'C', 'D'].map((col, colIdx) => {
                                            if (!col) return <div key={`aisle-${rowIdx}-${colIdx}`} className="w-8"></div>;

                                            const seatId = `${col}${rowIdx + 1}`;
                                            const seat = seatLayout.find(s => s.id === seatId);
                                            const isSelected = selectedSeats.includes(seatId);
                                            const isBooked = seat?.status === 'booked';

                                            return (
                                                <button
                                                    key={seatId}
                                                    onClick={() => handleSeatClick(seatId, seat?.status || 'available')}
                                                    disabled={isBooked}
                                                    className={cn(
                                                        "w-8 h-8 rounded text-[10px] font-bold border-2 transition-all",
                                                        isBooked && "bg-gray-300 border-gray-300 cursor-not-allowed",
                                                        !isBooked && !isSelected && "border-gray-300 hover:border-orange-400 hover:bg-orange-50",
                                                        isSelected && "bg-orange-500 border-orange-600 text-white"
                                                    )}
                                                >
                                                    {!isBooked && seatId}
                                                </button>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Boarding & Dropping Points */}
                        <div className="col-span-4 space-y-4">
                            {/* Boarding */}
                            <div className="bg-white rounded-lg p-4 border">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Boarding Point
                                </h4>
                                <div className="space-y-2">
                                    {BOARDING_POINTS.map((point) => (
                                        <div
                                            key={point.name}
                                            onClick={() => setSelectedBoarding(point.name)}
                                            className={cn(
                                                "p-3 rounded border cursor-pointer transition-all text-sm",
                                                selectedBoarding === point.name
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{point.name}</span>
                                                <span className="text-xs text-gray-500">{point.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dropping */}
                            <div className="bg-white rounded-lg p-4 border">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    Dropping Point
                                </h4>
                                <div className="space-y-2">
                                    {DROPPING_POINTS.map((point) => (
                                        <div
                                            key={point.name}
                                            onClick={() => setSelectedDropping(point.name)}
                                            className={cn(
                                                "p-3 rounded border cursor-pointer transition-all text-sm",
                                                selectedDropping === point.name
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{point.name}</span>
                                                <span className="text-xs text-gray-500">{point.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary & Proceed */}
                        <div className="col-span-3 bg-white rounded-lg p-4 border h-fit sticky top-4">
                            <h4 className="font-semibold text-sm mb-4">Booking Summary</h4>

                            <div className="space-y-3 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Selected Seats</span>
                                    <span className="font-medium">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Boarding</span>
                                    <span className="font-medium text-xs">{selectedBoarding || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Dropping</span>
                                    <span className="font-medium text-xs">{selectedDropping || '-'}</span>
                                </div>
                            </div>

                            <div className="border-t pt-3 mb-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-600">Total Amount</span>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-orange-600">₹{totalAmount}</p>
                                        <p className="text-xs text-gray-400">{selectedSeats.length} seat(s)</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleProceed}
                                disabled={selectedSeats.length === 0 || !selectedBoarding || !selectedDropping}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-base"
                            >
                                PROCEED TO BOOK
                            </Button>

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                <Info className="w-3 h-3 inline mr-1" />
                                Seats will be held for 5 minutes
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
