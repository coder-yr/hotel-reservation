"use client"

import React, { useState, useEffect } from "react"
import { getAllFlights, getFilteredFlights } from "@/lib/data"
import FlightBookingModal from "./flight-booking-modal"

type Flight = {
  id: string
  airline: string
  depart: string
  arrive: string
  duration: string
  price: string
  stops: string
}

// Removed MOCK_FLIGHTS. Will fetch from Firestore.

export default function FlightResultsClient() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState('New Delhi')
  const [to, setTo] = useState('Bengaluru')
  const [date, setDate] = useState('2025-11-12')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    async function fetchFlights() {
      try {
        const data = await getAllFlights()
        setFlights(data)
      } catch (err) {
        console.error("Failed to fetch flights", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFlights()
  }, [])

  const handleSearch = async (nf: string, nt: string, nd: string) => {
    setFrom(nf)
    setTo(nt)
    setDate(nd)
    setSearchOpen(false)
    setLoading(true)
    try {
      const filtered = await getFilteredFlights(nf, nt, nd)
      setFlights(filtered)
    } catch (err) {
      console.error("Failed to filter flights", err)
      setFlights([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Flight Results</h1>
        <p className="text-sm text-muted-foreground mt-1">{from} → {to} • {new Date(date).toLocaleDateString()}</p>
        <div className="mt-6">
          <button onClick={() => setSearchOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Update Search</button>
          {searchOpen && (
            <div className="glass-card p-6 mb-6 border-0">
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground mr-2">FROM</label>
                  <input className="glass px-4 py-2 rounded-xl border-0" value={from} onChange={e => setFrom(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground mr-2">TO</label>
                  <input className="glass px-4 py-2 rounded-xl border-0" value={to} onChange={e => setTo(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground mr-2">DEPARTURE DATE</label>
                  <input type="date" className="glass px-4 py-2 rounded-xl border-0" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => setSearchOpen(false)} className="px-4 py-2 border rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
                  <button onClick={() => handleSearch(from, to, date)} className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all">Search</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div>Loading flights...</div>
        ) : flights.length === 0 ? (
          <div>No flights found.</div>
        ) : (
          flights.map(f => (
            <div key={f.id} className="glass-card flex items-center justify-between p-6 hover:scale-[1.01] transition-all duration-300 border-0">
              <div>
                <div className="font-medium">{f.airline}</div>
                <div className="text-sm text-muted-foreground">{f.depart} • {f.duration} • {f.arrive} • {f.stops}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{f.price}</div>
                <div className="mt-2">
                  <button
                    onClick={() => { setSelectedFlight(f); setModalOpen(true); }}
                    className="btn-primary px-4 py-2"
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
      />
    </>
  )
}
