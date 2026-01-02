"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useAuth } from '@/hooks/use-auth'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Bus, Armchair, ArrowLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaymentGateway } from "./payment-gateway"

type BusInfo = {
  id: string
  operator: string
  busType: string
  departureTime: string
  arrivalTime: string
  price: number
  source: string
  destination: string
}

type Props = {
  bus: BusInfo | null
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onBookedAction?: () => void
  travelDate?: string
}

// Mock 12-row sleeper bus layout (Lower/Upper Deck)
const ROWS = 6;

export default function BusBookingModal({ bus, open, onOpenChangeAction, onBookedAction, travelDate }: Props) {
  const [step, setStep] = useState(1) // 1: Seat, 2: Review
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [deck, setDeck] = useState<'lower' | 'upper'>('lower')
  const [isBooking, setIsBooking] = useState(false)
  const router = useRouter()
  const { user } = useAuth();

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
      // No delay needed

      await addDoc(bookingsCol, {
        userId: user!.id,
        roomId: bus ? `bus-${bus.id}` : `bus-unknown`,
        hotelId: bus ? `bus-${bus.id}` : `bus-unknown`, // Reusing field for simplicity
        fromDate: Timestamp.fromDate(new Date(travelDate || new Date())),
        toDate: Timestamp.fromDate(new Date(new Date(travelDate || new Date()).getTime() + 10 * 60 * 60 * 1000)), // Approx duration
        totalPrice: bus?.price || 0,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        hotelName: bus ? `${bus.operator} (${bus.busType})` : 'Bus Booking',
        hotelLocation: bus ? `${bus.source} - ${bus.destination}` : 'Bus Trip',
        roomTitle: `Seat ${selectedSeat || 'Any'} (${deck.toUpperCase()})`,
        coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop', // Bus image
        userName: user!.name,
        hotelOwnerId: user!.id,
      });

      onBookedAction?.();
      onOpenChangeAction(false);
      router.push('/bookings');
    } catch (err) {
      console.error('Failed to create booking:', err);
      alert('Failed to book: ' + (err as Error).message);
    } finally {
      setIsBooking(false);
    }
  }

  if (!bus) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-4xl w-full p-0 gap-0 bg-slate-50 overflow-hidden h-[85vh] flex flex-col rounded-2xl">

        {/* Header */}
        <div className="bg-white px-6 py-4 border-b flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Bus className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-slate-900 leading-tight">
                {step === 1 ? "Select Seat" : "Review Booking"}
              </h2>
              <div className="text-xs text-slate-500 font-medium tracking-wide">
                {bus.operator} • {bus.source} to {bus.destination}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {step === 1 && (
            <div className="flex flex-col items-center">

              {/* Deck Switcher */}
              <div className="flex gap-4 mb-8 bg-white p-1 rounded-xl shadow-sm border">
                <button
                  onClick={() => setDeck('lower')}
                  className={cn("px-6 py-2 rounded-lg text-sm font-medium transition-all", deck === 'lower' ? "bg-slate-900 text-white shadow-md" : "hover:bg-slate-100 text-slate-500")}
                >
                  Lower Deck
                </button>
                <button
                  onClick={() => setDeck('upper')}
                  className={cn("px-6 py-2 rounded-lg text-sm font-medium transition-all", deck === 'upper' ? "bg-slate-900 text-white shadow-md" : "hover:bg-slate-100 text-slate-500")}
                >
                  Upper Deck
                </button>
              </div>

              {/* Bus Layout */}
              <div className="relative bg-white border-2 border-slate-200 rounded-[3rem] p-12 pr-24 shadow-xl">
                {/* Driver Seat */}
                <div className="absolute top-12 right-6">
                  <Armchair className="w-8 h-8 text-slate-300 rotate-90" />
                </div>

                <div className="grid grid-rows-2 gap-12">
                  {/* Left Side (Single Seats) */}
                  <div className="grid grid-cols-6 gap-4">
                    {Array.from({ length: ROWS }).map((_, i) => {
                      const seatId = `${deck === 'lower' ? 'L' : 'U'}${i + 1}`;
                      const isSelected = selectedSeat === seatId;
                      return (
                        <button
                          key={seatId}
                          onClick={() => setSelectedSeat(seatId)}
                          className={cn(
                            "w-12 h-20 rounded-lg border-2 flex items-center justify-center transition-all relative hover:scale-105 active:scale-95",
                            isSelected ? "bg-orange-500 border-orange-600 text-white shadow-lg" : "bg-white border-slate-200 hover:border-orange-300 text-slate-400"
                          )}
                        >
                          {deck === 'upper' ? (
                            <div className="w-full h-full p-2 flex flex-col justify-between">
                              <div className="w-full h-2 rounded-full bg-current opacity-20" />
                              <span className="text-xs font-bold">{seatId}</span>
                            </div>
                          ) : (
                            <Armchair className="w-6 h-6" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Right Side (Double Seats - implied Logic for simplicity just showing another row) */}
                  <div className="grid grid-cols-6 gap-4">
                    {Array.from({ length: ROWS }).map((_, i) => {
                      const seatId = `${deck === 'lower' ? 'L' : 'U'}${i + 7}`;
                      const isSelected = selectedSeat === seatId;
                      return (
                        <button
                          key={seatId}
                          onClick={() => setSelectedSeat(seatId)}
                          className={cn(
                            "w-12 h-20 rounded-lg border-2 flex items-center justify-center transition-all relative hover:scale-105 active:scale-95",
                            isSelected ? "bg-orange-500 border-orange-600 text-white shadow-lg" : "bg-white border-slate-200 hover:border-orange-300 text-slate-400"
                          )}
                        >
                          {deck === 'upper' ? (
                            <div className="w-full h-full p-2 flex flex-col justify-between">
                              <div className="w-full h-2 rounded-full bg-current opacity-20" />
                              <span className="text-xs font-bold">{seatId}</span>
                            </div>
                          ) : (
                            <Armchair className="w-6 h-6" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-6 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border bg-white border-slate-200" /> Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-500" /> Selected</div>
                <div className="flex items-center gap-2 opacity-50"><div className="w-4 h-4 rounded bg-slate-300" /> Booked</div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4">Trip Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-2 border-b border-dashed">
                  <span className="text-muted-foreground">Operator</span>
                  <span className="font-medium">{bus.operator}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-dashed">
                  <span className="text-muted-foreground">Seat</span>
                  <span className="font-medium">{selectedSeat} ({deck} deck)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-dashed">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{travelDate || 'Today'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-lg font-bold">Total Pay</span>
                  <span className="text-xl font-bold text-orange-600">₹{bus.price}</span>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 mb-4 border border-yellow-100">
                Boarding point details will be sent via SMS/Email after booking.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t p-6 shadow-t-xl z-20 flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold">₹{selectedSeat ? bus.price : 0}</p>
          </div>

          <button
            onClick={() => step === 2 ? handleBook() : setStep(step + 1)}
            disabled={!selectedSeat || isBooking}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all",
              isBooking || !selectedSeat ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200"
            )}
          >
            {isBooking ? 'Processing...' : step === 2 ? 'Pay Now' : 'Continue'}
            {!isBooking && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

      </DialogContent>

      <PaymentGateway
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={bus ? bus.price : 0}
        onSuccess={onPaymentSuccess}
      />
    </Dialog>
  )
}
