"use client"

import React, { useState, useEffect } from "react"
import FlightBookingModal from "./flight-booking-modal"
import { Plane, Clock } from "lucide-react"

type Flight = {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  depart: string
  arrive: string
  duration: string
  price: string
  stops: string
  badge?: string
}

const CITY_CODES: Record<string, string> = {
  'new delhi': 'DEL',
  'delhi': 'DEL',
  'mumbai': 'BOM',
  'bengaluru': 'BLR',
  'bangalore': 'BLR',
  'chennai': 'MAA',
  'kolkata': 'CCU',
  'hyderabad': 'HYD',
  'goa': 'GOI',
  'pune': 'PNQ',
};

const AIRLINE_NAMES: Record<string, string> = {
  'AI': 'Air India',
  'UK': 'Vistara',
  '6E': 'IndiGo',
  'SG': 'SpiceJet',
  'QP': 'Akasa Air',
  'IX': 'Air India Express',
  'G8': 'Go First',
};

const AIRLINE_COLORS: Record<string, string> = {
  'AI': 'bg-red-600',
  'UK': 'bg-purple-800',
  '6E': 'bg-blue-700',
  'SG': 'bg-orange-600',
  'QP': 'bg-orange-500',
  'IX': 'bg-red-500',
};

export default function FlightResultsClient() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState('New Delhi')
  const [to, setTo] = useState('Bengaluru')
  const [date, setDate] = useState('2025-12-12')
  const [searchOpen, setSearchOpen] = useState(false)

  const fetchFlights = async (origin: string, destination: string, date: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ origin, destination, date });
      const res = await fetch(`/api/flights?${params}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const mappedFlights: Flight[] = data.map((offer: any, index: number) => {
          const itinerary = offer.itineraries[0];
          const segment = itinerary.segments[0];
          const airlineCode = segment.carrierCode;
          const flightNumber = segment.number;
          const duration = itinerary.duration.replace('PT', '').toLowerCase();
          const airlineName = AIRLINE_NAMES[airlineCode] || `Airline ${airlineCode}`;

          // Mock badges for demo
          const badges = ["Enjoy free seat and meal", "Partial Refundable", "Enjoy free seat and meal"];
          const badge = badges[index % badges.length];

          return {
            id: offer.id,
            airline: airlineName,
            airlineCode: airlineCode,
            flightNumber: `${airlineCode}-${flightNumber}`,
            depart: new Date(segment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            arrive: new Date(segment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            duration: duration.replace('h', 'h ').replace('m', 'm'),
            price: `₹${offer.price.total}`,
            stops: itinerary.segments.length > 1 ? `${itinerary.segments.length - 1} stop` : 'Non-stop',
            badge: badge
          };
        });
        setFlights(mappedFlights);
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error("Failed to fetch flights", err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights('DEL', 'BOM', '2025-12-12');
  }, []);

  const handleSearch = (nf: string, nt: string, nd: string) => {
    setFrom(nf);
    setTo(nt);
    setDate(nd);
    setSearchOpen(false);
    const normalize = (str: string) => str.toLowerCase().trim();
    const originCode = CITY_CODES[normalize(nf)] || nf.toUpperCase().substring(0, 3);
    const destCode = CITY_CODES[normalize(nt)] || nt.toUpperCase().substring(0, 3);
    fetchFlights(originCode, destCode, nd);
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Flights from {from} to {to}</h1>
          <button onClick={() => setSearchOpen(!searchOpen)} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Update Search
          </button>
        </div>

        {searchOpen && (
          <div className="bg-white p-6 mb-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">From</label>
                <input className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500" value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">To</label>
                <input className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500" value={to} onChange={e => setTo(e.target.value)} />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                <input type="date" className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <button onClick={() => handleSearch(from, to, date)} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors">Search</button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading flights...</div>
        ) : flights.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No flights found.</div>
        ) : (
          flights.map(f => (
            <div key={f.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Badge */}
              <div className="bg-blue-50 px-4 py-1 text-xs text-blue-600 font-medium inline-block rounded-br-lg mb-4">
                {f.badge}
              </div>

              <div className="px-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Airline Info */}
                <div className="flex items-start gap-4 min-w-[180px]">
                  <div className={`w-10 h-10 rounded-lg ${AIRLINE_COLORS[f.airlineCode] || 'bg-gray-500'} flex items-center justify-center text-white`}>
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{f.airline}</div>
                    <div className="text-xs text-gray-500">{f.flightNumber}</div>
                    <button className="text-xs text-blue-600 mt-1 hover:underline">Flight Details</button>
                  </div>
                </div>

                {/* Flight Times */}
                <div className="flex items-center gap-8 text-center flex-1">
                  <div className="text-xl font-medium text-gray-900">{f.depart}</div>
                  <div className="flex flex-col items-center w-32">
                    <div className="text-xs text-gray-500 mb-1">{f.duration}</div>
                    <div className="w-full h-[1px] bg-gray-300 relative">
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-gray-400 left-1/2 -top-[2px] -translate-x-1/2 bg-white border border-gray-400" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{f.stops}</div>
                  </div>
                  <div className="text-xl font-medium text-gray-900">{f.arrive}</div>
                </div>

                {/* Price & Book */}
                <div className="flex flex-col items-end min-w-[200px]">
                  <div className="text-2xl font-bold text-gray-900">{f.price}</div>
                  <div className="text-[10px] text-green-600 mb-3">Get ₹1263 off with SBI Credit Cards</div>
                  <button
                    onClick={() => { setSelectedFlight(f); setModalOpen(true); }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md font-medium transition-colors w-full md:w-auto"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <FlightBookingModal
        flight={selectedFlight}
        open={modalOpen}
        onOpenChangeAction={(v) => { setModalOpen(v); if (!v) setSelectedFlight(null); }}
        onBookedAction={() => console.log('flight booked')}
        originCity={from}
        destinationCity={to}
        travelDate={date}
      />
    </>
  )
}
