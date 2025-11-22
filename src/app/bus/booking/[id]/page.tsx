"use client";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getDoc, doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BusDetails } from '@/components/bus/BusDetails';
import { Stepper } from '@/components/bus/Stepper';
import { SeatSelection } from '@/components/bus/SeatSelection';
import { BoardDropPoint } from '@/components/bus/BoardDropPoint';
import { PassengerInfo } from '@/components/bus/PassengerInfo';
import { CheckCircle } from 'lucide-react';

export default function BusBookingPage() {
  const { id } = useParams();
  const [bus, setBus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerInfo, setPassengerInfo] = useState<any>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");

  const [selectedBoarding, setSelectedBoarding] = useState<string>("");
  const [selectedDropping, setSelectedDropping] = useState<string>("");

  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchBus() {
      if (!id) return;
      const busDoc = await getDoc(doc(db, 'buses', id as string));
      if (busDoc.exists()) {
        setBus({ id: busDoc.id, ...busDoc.data() });
      }
      setLoading(false);
    }
    fetchBus();
  }, [id]);

  // Handle pre-selected data from URL
  useEffect(() => {
    const seatsParam = searchParams.get('seats');
    const boardingParam = searchParams.get('boardingPoint');
    const droppingParam = searchParams.get('droppingPoint');

    if (seatsParam) {
      const seats = seatsParam.split(',');
      setSelectedSeats(seats);

      if (boardingParam && droppingParam) {
        setSelectedBoarding(boardingParam);
        setSelectedDropping(droppingParam);
        if (seats.length > 0) {
          setCurrentStep(3); // Auto-advance to Passenger Info
        }
      } else if (seats.length > 0) {
        setCurrentStep(2); // Auto-advance to Boarding Point
      }
    }
  }, [searchParams]);

  const steps = [
    { number: 1, title: 'Select seats' },
    { number: 2, title: 'Board/Drop point' },
    { number: 3, title: 'Passenger Info' }
  ];

  const handleBooking = async (info?: any) => {
    // Save booking to Firestore
    try {
      const docRef = await addDoc(collection(db, 'bus_bookings'), {
        busId: bus?.id,
        seats: selectedSeats,
        passengerInfo: info || passengerInfo,
        createdAt: serverTimestamp(),
        status: 'confirmed',
      });
      setBookingId(docRef.id);
      setPassengerInfo(info || passengerInfo);
      setBookingComplete(true);
    } catch (error) {
      alert('Error saving booking. Please try again.');
    }
  };

  const calculateTotal = () => {
    if (!bus || !bus.seats) return 0;
    return selectedSeats.reduce((total, seatId) => {
      const seatData = bus.seats.find((s: any) => s.id === seatId);
      return total + (seatData?.price || 0);
    }, 0);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading bus details...</div>;
  }

  if (!bus) {
    return <div className="flex items-center justify-center h-screen">Bus not found.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        {bookingComplete ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Your bus tickets have been confirmed. A confirmation email has been sent to your registered email address.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2"><span className="font-medium text-gray-900">Booking ID:</span> {bookingId ? `#${bookingId}` : "-"}</p>
                <p className="text-sm text-gray-600 mb-2"><span className="font-medium text-gray-900">Seats:</span> {selectedSeats.join(', ')}</p>
                <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Total Amount:</span> ₹{calculateTotal()}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-[#E53935] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#D32F2F] transition-colors"
              >
                Book Another Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {currentStep === 1 && (
                  <SeatSelection
                    selectedSeats={selectedSeats}
                    onSeatSelect={setSelectedSeats}
                    bus={bus}
                  />
                )}

                {currentStep === 2 && (
                  <BoardDropPoint
                    selectedSeats={selectedSeats}
                    bus={bus}
                    onContinue={() => setCurrentStep(3)}
                    initialBoarding={selectedBoarding}
                    initialDropping={selectedDropping}
                    onBoardingChange={setSelectedBoarding}
                    onDroppingChange={setSelectedDropping}
                  />
                )}

                {currentStep === 3 && (
                  <PassengerInfo
                    selectedSeats={selectedSeats}
                    onBook={info => handleBooking(info)}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                <BusDetails selectedSeats={selectedSeats} />
                {(currentStep === 2 || currentStep === 3) && (
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">Bus</p>
                        <p className="font-medium text-gray-900">{bus.operator}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Journey Date</p>
                        <p className="font-medium text-gray-900">Wed 12 Nov 2025</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Seats Selected</p>
                        <p className="font-medium text-gray-900">{selectedSeats.join(', ')}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Passengers</p>
                        <p className="font-medium text-gray-900">{selectedSeats.length}</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">₹{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-medium text-gray-900">₹{Math.round(calculateTotal() * 0.1)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-[#E53935]">₹{calculateTotal() + Math.round(calculateTotal() * 0.1)}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
                      <p>Cancellation allowed up to 24 hours before departure</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {currentStep === 1 && selectedSeats.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {selectedSeats.length} seat(s) selected
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{calculateTotal()}
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-[#E53935] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#D32F2F] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
