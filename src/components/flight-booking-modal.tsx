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
import { Plane, Check, X, Calendar, Briefcase, Utensils, Armchair, RefreshCw, Luggage, ArrowLeft, Info, ChevronRight, CreditCard, User, Sparkles, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaymentGateway } from "./payment-gateway"

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
    name: 'SAVER',
    priceOffset: 0,
    color: 'bg-white',
    borderColor: 'border-slate-200',
    titleColor: 'text-slate-700',
    description: "Travel light, travel smart.",
    benefits: [
      { icon: Briefcase, text: 'Cabin bag (7kg)', included: true },
      { icon: Luggage, text: 'Check-in bag (15kg)', included: true },
      { icon: Armchair, text: 'Seat selection', included: false },
      { icon: Utensils, text: 'Meal', included: false },
      { icon: RefreshCw, text: 'Cancellation', included: false },
    ]
  },
  {
    id: 'classic',
    name: 'CLASSIC',
    recommended: true,
    priceOffset: 1200,
    color: 'bg-indigo-50/50',
    borderColor: 'border-indigo-200',
    titleColor: 'text-indigo-700',
    description: "Extra flexibility & comfort.",
    benefits: [
      { icon: Briefcase, text: 'Cabin bag (7kg)', included: true },
      { icon: Luggage, text: 'Check-in bag (15kg)', included: true },
      { icon: Armchair, text: 'Standard Seat', included: true },
      { icon: Utensils, text: 'Meal', included: true },
      { icon: RefreshCw, text: 'Cancellation (Fee)', included: true, info: "Low Fee" },
    ]
  },
  {
    id: 'flex',
    name: 'FLEXI PLUS',
    priceOffset: 3500,
    color: 'bg-amber-50/50',
    borderColor: 'border-amber-200',
    titleColor: 'text-amber-700',
    description: "Total peace of mind.",
    benefits: [
      { icon: Briefcase, text: 'Cabin bag (7kg)', included: true },
      { icon: Luggage, text: 'Check-in bag (25kg)', included: true },
      { icon: Armchair, text: 'Any Seat Free', included: true },
      { icon: Utensils, text: 'Gourmet Meal', included: true },
      { icon: RefreshCw, text: 'Free Cancellation', included: true },
    ]
  }
]

// Mock Seat Map Data
const SEAT_ROWS = 12;

export default function FlightBookingModal({ flight, open, onOpenChangeAction, onBookedAction, originCity, destinationCity, travelDate }: Props) {
  const [step, setStep] = useState(1) // 1: Fare, 2: Seat, 3: Passenger
  const [selectedFare, setSelectedFare] = useState('classic')
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)
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

  // State for Payment Modal
  const [showPayment, setShowPayment] = useState(false);

  const handleBook = () => {
    if (!user) {
      alert('Please log in to complete booking.');
      return;
    }
    setShowPayment(true);
  }

  const onPaymentSuccess = async () => {
    setShowPayment(false);
    try {
      setIsBooking(true);

      const bookingsCol = collection(db, 'bookings');
      // No need for fake delay here, payment gateway did it

      await addDoc(bookingsCol, {
        userId: user!.id,
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
        coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop',
        userName: user!.name,
        hotelOwnerId: user!.id, // For now, mapping to self as placeholder
      });

      onBookedAction?.();
      onOpenChangeAction(false);
      router.push('/bookings');
    } catch (err) {
      console.error('Failed to create booking doc:', err);
      alert('Failed to create booking: ' + (err as Error).message);
    } finally {
      setIsBooking(false);
    }
  }

  if (!flight) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 bg-slate-50 overflow-hidden h-[90vh] flex flex-col rounded-2xl shadow-2xl">

        {/* Top Progress Bar */}
        <div className="bg-white px-8 py-4 border-b flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors mr-2">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            ) : (
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 mr-2">
                <Plane className="w-5 h-5 text-slate-800" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {step === 1 && "Select Fare"}
                {step === 2 && "Choose Seat"}
                {step === 3 && "Review & Pay"}
              </h2>
              <div className="text-xs text-slate-500 font-medium tracking-wide">
                {originCity} to {destinationCity}
              </div>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex gap-2">
            <div className={cn("h-1.5 w-8 rounded-full transition-colors", step >= 1 ? "bg-slate-900" : "bg-slate-200")} />
            <div className={cn("h-1.5 w-8 rounded-full transition-colors", step >= 2 ? "bg-slate-900" : "bg-slate-200")} />
            <div className={cn("h-1.5 w-8 rounded-full transition-colors", step >= 3 ? "bg-slate-900" : "bg-slate-200")} />
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">

          {/* STEP 1: FARE SELECTION */}
          {step === 1 && (
            <div className="p-8 max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Customize your journey</h3>
                <p className="text-slate-500">Select the fare that suits your travel needs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FARE_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedFare(option.id)}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border-2 transition-all p-0 cursor-pointer hover:shadow-xl group",
                      selectedFare === option.id
                        ? `${option.borderColor} ring-1 ring-offset-2 ${option.borderColor} bg-white shadow-lg scale-[1.02] z-10`
                        : "border-transparent bg-white shadow-sm hover:scale-[1.01]"
                    )}
                  >
                    {option.recommended && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
                    )}
                    {option.recommended && (
                      <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Recommended
                      </div>
                    )}

                    <div className={cn("p-6 pb-4 border-b border-dashed", option.color)}>
                      <h4 className={cn("font-extrabold text-xl tracking-tight mb-1", option.titleColor)}>{option.name}</h4>
                      <p className="text-xs font-medium text-slate-500 mb-4 h-4">{option.description}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-semibold text-slate-400">₹</span>
                        <span className="text-3xl font-bold text-slate-900">{(basePrice + option.priceOffset).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {option.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={cn(
                            "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                            benefit.included ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                          )}>
                            {benefit.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          </div>
                          <div className="flex-1">
                            <p className={cn("text-sm font-medium", benefit.included ? "text-slate-700" : "text-slate-400 line-through")}>
                              {benefit.text}
                            </p>
                            {benefit.info && <p className="text-[10px] text-emerald-600 font-semibold">{benefit.info}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedFare === option.id && (
                      <div className="absolute bottom-4 right-4 text-emerald-500">
                        <Check className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* STEP 2: SEAT SELECTION */}
          {step === 2 && (
            <div className="flex flex-col items-center py-8">
              <div className="mb-6 flex items-center gap-6 text-sm font-medium bg-white px-6 py-2 rounded-full shadow-sm border">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border bg-white" /> Free</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border bg-indigo-50 border-indigo-200" /> ₹150-350</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border bg-amber-50 border-amber-200" /> Premium</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border bg-emerald-500 border-emerald-600" /> Selected</div>
                <div className="flex items-center gap-2 opacity-50"><div className="w-4 h-4 rounded bg-slate-200" /> Occupied</div>
              </div>

              {/* Plane Fuselage */}
              <div className="relative bg-white pt-24 pb-12 px-12 rounded-[4rem] shadow-2xl border-2 border-slate-100 max-w-2xl w-full">
                {/* Cockpit */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-b from-slate-200 to-white rounded-full opacity-50 blur-xl pointer-events-none" />
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-1 border-b-4 border-slate-200 rounded-full" />

                <div className="flex justify-center gap-10">
                  {/* Left Block */}
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: SEAT_ROWS }).map((_, row) => (
                      <React.Fragment key={`left-${row}`}>
                        {['A', 'B', 'C'].map(col => {
                          const seatId = `${row + 1}${col}`;
                          const price = getSeatPrice(row + 1, col);
                          const isSelected = selectedSeat === seatId;
                          const isPremium = row < 3;
                          const isOccupied = row === 4 && col === 'B'; // Mock occupied

                          return (
                            <button
                              key={seatId}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatId)}
                              className={cn(
                                "w-10 h-10 rounded-lg border transition-all flex flex-col items-center justify-center relative group",
                                isOccupied ? "bg-slate-100 border-slate-200 cursor-not-allowed opacity-50" :
                                  isSelected ? "bg-emerald-500 border-emerald-600 text-white shadow-lg ring-2 ring-emerald-200 z-10" :
                                    isPremium ? "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100 hover:border-amber-300" :
                                      price > 0 ? "bg-indigo-50 border-indigo-100 text-indigo-900 hover:bg-indigo-100 hover:border-indigo-300" :
                                        "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300"
                              )}
                            >
                              <span className="text-[10px] font-bold">{col}</span>
                              {/* Tooltip Price */}
                              {!isOccupied && !isSelected && (
                                <span className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                  {price === 0 ? 'Free' : `₹${price}`}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Aisle - Row Numbers */}
                  <div className="flex flex-col gap-3 items-center pt-1 text-xs font-mono text-slate-300">
                    {Array.from({ length: SEAT_ROWS }).map((_, i) => (
                      <div key={i} className="h-10 flex items-center">{i + 1}</div>
                    ))}
                  </div>

                  {/* Right Block */}
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: SEAT_ROWS }).map((_, row) => (
                      <React.Fragment key={`right-${row}`}>
                        {['D', 'E', 'F'].map(col => {
                          const seatId = `${row + 1}${col}`;
                          const price = getSeatPrice(row + 1, col);
                          const isSelected = selectedSeat === seatId;
                          const isPremium = row < 3;
                          const isOccupied = row === 6 && col === 'E'; // Mock occupied

                          return (
                            <button
                              key={seatId}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatId)}
                              className={cn(
                                "w-10 h-10 rounded-lg border transition-all flex flex-col items-center justify-center relative group",
                                isOccupied ? "bg-slate-100 border-slate-200 cursor-not-allowed opacity-50" :
                                  isSelected ? "bg-emerald-500 border-emerald-600 text-white shadow-lg ring-2 ring-emerald-200 z-10" :
                                    isPremium ? "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100 hover:border-amber-300" :
                                      price > 0 ? "bg-indigo-50 border-indigo-100 text-indigo-900 hover:bg-indigo-100 hover:border-indigo-300" :
                                        "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300"
                              )}
                            >
                              <span className="text-[10px] font-bold">{col}</span>
                              {/* Tooltip Price */}
                              {!isOccupied && !isSelected && (
                                <span className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                  {price === 0 ? 'Free' : `₹${price}`}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <div className="p-8 max-w-2xl mx-auto">
              <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-6">
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg"><Plane className="w-6 h-6" /></div>
                    <div>
                      <div className="text-sm opacity-80">Flight Summary</div>
                      <div className="font-bold text-lg">{originCity} <span className="opacity-50">→</span> {destinationCity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-70">Travel Date</div>
                    <div className="font-medium">{new Date(travelDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-slate-500">Base Fare ({selectedOption?.name})</span>
                    <span className="font-medium text-slate-900">₹{(basePrice + (selectedOption?.priceOffset || 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-slate-500">Seat Selection ({selectedSeat})</span>
                    <span className="font-medium text-slate-900">₹{seatPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 text-orange-800 text-sm mb-6">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Please review your booking details accurately. Names must match government ID.</p>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Bottom Footer */}
        <div className="bg-white border-t p-6 shadow-t-xl z-20">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total to pay</span>
              <span className="text-3xl font-black text-slate-900">₹{totalPrice.toLocaleString()}</span>
            </div>

            <button
              onClick={() => step === 3 ? handleBook() : setStep(step + 1)}
              disabled={(step === 2 && !selectedSeat) || isBooking}
              className={cn(
                "flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg shadow-indigo-200",
                isBooking ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                  "bg-slate-900 text-white hover:bg-slate-800 hover:translate-y-[-2px]"
              )}
            >
              {isBooking ? (
                <>Processing...</>
              ) : step === 3 ? (
                <>Confirm & Pay <CreditCard className="w-5 h-5 ml-1" /></>
              ) : (
                <>Continue <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

      </DialogContent>

      <PaymentGateway
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={totalPrice}
        onSuccess={onPaymentSuccess}
      />
    </Dialog>
  )
}
