"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from '@/hooks/use-auth'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Plane, Check, X, Calendar, Briefcase, Utensils, Armchair, RefreshCw, Luggage, ArrowLeft, User } from "lucide-react"

type FlightInfo = {
  id: string
  airline: string
  depart: string
  arrive: string
  duration: string
  price: string
  stops: string
  flightNumber?: string
}

type Props = {
  flight: FlightInfo | null
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onBookedAction?: () => void
  originCity: string
  destinationCity: string
  travelDate: string
}

const FARE_OPTIONS = [
  {
    id: 'value',
    name: 'ECO VALUE',
    priceOffset: 0,
    benefits: [
      { icon: RefreshCw, text: 'Cancellation fee', included: false, label: 'Starting ₹3,500' },
      { icon: Calendar, text: 'Date change fee', included: false, label: 'Starting ₹3,000' },
      { icon: Armchair, text: 'Seat selection', included: false, label: 'Chargeable' },
      { icon: Utensils, text: 'Meal selection', included: false, label: 'Chargeable' },
      { icon: Briefcase, text: 'Cabin bag', included: true, label: '7 kg' },
      { icon: Luggage, text: 'Check-in bag', included: true, label: '15 kg' },
    ]
  },
  {
    id: 'classic',
    name: 'ECO CLASSIC',
    priceOffset: 1056,
    benefits: [
      { icon: RefreshCw, text: 'Cancellation fee', included: false, label: 'Starting ₹2,500' },
      { icon: Calendar, text: 'Date change fee', included: true, label: 'Free' },
      { icon: Armchair, text: 'Seat selection', included: true, label: 'Free Standard' },
      { icon: Utensils, text: 'Meal selection', included: true, label: 'Free Standard' },
      { icon: Briefcase, text: 'Cabin bag', included: true, label: '7 kg' },
      { icon: Luggage, text: 'Check-in bag', included: true, label: '15 kg' },
    ]
  },
  {
    id: 'flex',
    name: 'ECO FLEX',
    priceOffset: 3166,
    benefits: [
      { icon: RefreshCw, text: 'Cancellation fee', included: true, label: 'Free' },
      { icon: Calendar, text: 'Date change fee', included: true, label: 'Free' },
      { icon: Armchair, text: 'Seat selection', included: true, label: 'Free Any Seat' },
      { icon: Utensils, text: 'Meal selection', included: true, label: 'Free Any Meal' },
      { icon: Briefcase, text: 'Cabin bag', included: true, label: '7 kg' },
      { icon: Luggage, text: 'Check-in bag', included: true, label: '20 kg' },
    ]
  }
]

// Mock Seat Map Data
const SEAT_ROWS = 10;

export default function FlightBookingModal({ flight, open, onOpenChangeAction, onBookedAction, originCity, destinationCity, travelDate }: Props) {
  const [step, setStep] = useState(1) // 1: Fare, 2: Seat, 3: Passenger
  const [selectedFare, setSelectedFare] = useState('value')
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth();

  const basePrice = flight ? Number(flight.price.replace(/[^0-9.-]+/g, '')) : 0
  const selectedOption = FARE_OPTIONS.find(f => f.id === selectedFare)

  // Calculate Seat Price
  const getSeatPrice = (row: number, col: string) => {
    if (selectedOption?.id === 'flex') return 0;
    if (selectedOption?.id === 'classic' && row > 3) return 0;

    if (row <= 3) return 1500; // Premium rows
    if (col === 'A' || col === 'F') return 350; // Window
    if (col === 'C' || col === 'D') return 250; // Aisle
    return 150; // Middle
  }

  const seatPrice = selectedSeat ? getSeatPrice(parseInt(selectedSeat.slice(0, -1)), selectedSeat.slice(-1)) : 0
  const totalPrice = basePrice + (selectedOption?.priceOffset || 0) + seatPrice

  const handleBook = async () => {
    try {
      if (!user) {
        alert('Please log in to complete booking.');
        return;
      }

      const bookingsCol = collection(db, 'bookings');
      await addDoc(bookingsCol, {
        userId: user.id,
        roomId: flight ? `flight-${flight.id}` : `flight-unknown`,
        hotelId: flight ? `flight-${flight.id}` : `flight-unknown`,
        fromDate: Timestamp.fromDate(new Date(travelDate)),
        toDate: Timestamp.fromDate(new Date(new Date(travelDate).getTime() + 24 * 60 * 60 * 1000)),
        totalPrice: totalPrice,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        hotelName: flight ? `${flight.airline} (${selectedOption?.name})` : 'Flight Booking',
        hotelLocation: `${originCity} - ${destinationCity}`,
        roomTitle: `Flight ${flight?.flightNumber || ''} • Seat ${selectedSeat || 'Any'}`,
        coverImage: '/images/flight-depart.svg',
        userName: user.name,
        hotelOwnerId: user.id,
      });

      onBookedAction?.();
      onOpenChangeAction(false);
      router.push('/bookings');
    } catch (err) {
      console.error('Failed to create booking doc:', err);
      alert('Failed to create booking: ' + (err as Error).message);
    }
  }

  if (!flight) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 bg-white overflow-hidden h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <DialogTitle className="text-2xl font-bold">
                {step === 1 ? 'Select your fare' : step === 2 ? 'Select your seat' : 'Passenger Details'}
              </DialogTitle>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Amount</div>
              <div className="text-xl font-bold text-orange-600">₹{totalPrice.toLocaleString()}</div>
            </div>
          </div>

          {/* Flight Summary */}
          <div className="flex items-center gap-4 mt-4 bg-blue-50 p-3 rounded-lg">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white shrink-0">
              <Plane className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 truncate">
                {originCity} → {destinationCity} • {new Date(travelDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
              <div className="font-semibold text-sm truncate">
                {flight.depart} - {flight.arrive} • {flight.duration}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          {step === 1 && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Sidebar Benefits Legend */}
              <div className="hidden md:flex flex-col gap-6 p-6 w-64 text-sm font-medium text-gray-700 bg-white border-r">
                <div className="flex items-center gap-3 h-5"><RefreshCw className="w-4 h-4" /> Cancellation fee</div>
                <div className="flex items-center gap-3 h-5"><Calendar className="w-4 h-4" /> Date change fee</div>
                <div className="flex items-center gap-3 h-5"><Armchair className="w-4 h-4" /> Seat selection</div>
                <div className="flex items-center gap-3 h-5"><Utensils className="w-4 h-4" /> Meal selection</div>
                <div className="flex items-center gap-3 h-5"><Briefcase className="w-4 h-4" /> Cabin bag/adult</div>
                <div className="flex items-center gap-3 h-5"><Luggage className="w-4 h-4" /> Check-in bag/adult</div>
              </div>

              {/* Fare Cards */}
              <div className="flex-1 flex overflow-x-auto p-6 gap-4">
                {FARE_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    className={`flex-1 min-w-[240px] rounded-xl border transition-all duration-200 bg-white flex flex-col ${selectedFare === option.id
                        ? 'border-black ring-1 ring-black shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className={`p-4 rounded-t-xl ${selectedFare === option.id ? 'bg-gray-50' : ''}`}>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{option.name}</div>
                      <div className="text-2xl font-bold">₹{(basePrice + option.priceOffset).toLocaleString()}</div>
                      <button
                        onClick={() => setSelectedFare(option.id)}
                        className={`w-full mt-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${selectedFare === option.id
                            ? 'bg-gray-900 text-white'
                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                      >
                        {selectedFare === option.id ? <><Check className="w-4 h-4" /> Selected</> : 'Select'}
                      </button>
                    </div>
                    <div className="p-4 space-y-6 flex-1 border-t border-dashed">
                      {option.benefits.map((benefit, i) => (
                        <div key={i} className="text-xs flex items-center gap-1 h-5">
                          {benefit.included ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-400" />}
                          <span className={benefit.included ? 'text-gray-700' : 'text-gray-500'}>{benefit.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex justify-center p-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 relative max-w-md w-full">
                {/* Plane Nose */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-24 bg-gray-100 rounded-t-[100px] border-t border-x border-gray-200 z-0" />

                <div className="relative z-10">
                  <div className="flex justify-between mb-8 px-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white border border-gray-300" /> Free</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-100 border border-blue-300" /> ₹150-350</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-purple-100 border border-purple-300" /> Premium</div>
                  </div>

                  <div className="flex justify-center gap-8">
                    {/* Left Side (A, B, C) */}
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: SEAT_ROWS }).map((_, row) => (
                        <React.Fragment key={`left-${row}`}>
                          {['A', 'B', 'C'].map(col => {
                            const seatId = `${row + 1}${col}`;
                            const price = getSeatPrice(row + 1, col);
                            const isSelected = selectedSeat === seatId;
                            const isPremium = row < 3;

                            return (
                              <button
                                key={seatId}
                                onClick={() => setSelectedSeat(seatId)}
                                className={`w-8 h-10 rounded-t-lg border-t border-x border-b-4 transition-all flex items-center justify-center text-[10px] font-medium
                                  ${isSelected
                                    ? 'bg-green-500 border-green-600 text-white border-b-green-700'
                                    : isPremium
                                      ? 'bg-purple-50 border-purple-200 text-purple-700 border-b-purple-300 hover:bg-purple-100'
                                      : price > 0
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 border-b-blue-300 hover:bg-blue-100'
                                        : 'bg-white border-gray-300 text-gray-500 border-b-gray-400 hover:bg-gray-50'
                                  }`}
                              >
                                {seatId}
                              </button>
                            )
                          })}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Aisle */}
                    <div className="w-4 flex items-center justify-center text-xs text-gray-300 font-mono tracking-widest vertical-rl">
                      AISLE
                    </div>

                    {/* Right Side (D, E, F) */}
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: SEAT_ROWS }).map((_, row) => (
                        <React.Fragment key={`right-${row}`}>
                          {['D', 'E', 'F'].map(col => {
                            const seatId = `${row + 1}${col}`;
                            const price = getSeatPrice(row + 1, col);
                            const isSelected = selectedSeat === seatId;
                            const isPremium = row < 3;

                            return (
                              <button
                                key={seatId}
                                onClick={() => setSelectedSeat(seatId)}
                                className={`w-8 h-10 rounded-t-lg border-t border-x border-b-4 transition-all flex items-center justify-center text-[10px] font-medium
                                  ${isSelected
                                    ? 'bg-green-500 border-green-600 text-white border-b-green-700'
                                    : isPremium
                                      ? 'bg-purple-50 border-purple-200 text-purple-700 border-b-purple-300 hover:bg-purple-100'
                                      : price > 0
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 border-b-blue-300 hover:bg-blue-100'
                                        : 'bg-white border-gray-300 text-gray-500 border-b-gray-400 hover:bg-gray-50'
                                  }`}
                              >
                                {seatId}
                              </button>
                            )
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white flex items-center justify-between shrink-0">
          <div className="text-sm text-gray-500">
            {step === 2 && selectedSeat && (
              <span>Selected Seat: <strong className="text-gray-900">{selectedSeat}</strong> (+₹{seatPrice})</span>
            )}
          </div>
          <button
            onClick={() => step === 2 ? handleBook() : setStep(step + 1)}
            disabled={step === 2 && !selectedSeat}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg shadow-orange-500/20"
          >
            {step === 2 ? 'Continue to Passenger' : 'Continue'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
