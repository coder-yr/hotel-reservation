"use client";
import React, { useState, useEffect } from 'react';
import { BusCard, BusCardProps } from '@/components/BusCard';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchBar } from '@/components/SearchBar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function BusPage() {
  const [buses, setBuses] = useState<BusCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'buses'));
        const busList: BusCardProps[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            operator: data.operator || '',
            busType: data.busType || '',
            departureTime: data.depart || '',
            arrivalTime: data.arrive || '',
            duration: data.duration || '',
            rating: typeof data.rating === 'number' ? data.rating : 4.0,
            reviews: typeof data.reviews === 'number' ? data.reviews : 0,
            price: typeof data.price === 'string' ? parseInt(data.price.replace(/[^\d]/g, '')) : (typeof data.price === 'number' ? data.price : 0),
            seatsAvailable: Array.isArray(data.seats) ? data.seats.filter((s: any) => s.status === 'available').length : (typeof data.seats === 'number' ? data.seats : 0),
            amenities: Array.isArray(data.amenities) ? data.amenities : ['wifi'],
            seats: Array.isArray(data.seats) ? data.seats : [],
          };
        });
        setBuses(busList);
      } catch (error) {
        console.error('Error fetching buses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[350px] w-full flex items-center justify-center mb-8">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
              alt="Bus Hero"
              className="w-full h-full object-cover brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-5xl px-4 text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md">
              Bus Tickets Booking
            </h1>
            <div className="pt-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-2xl ring-1 ring-black/5 max-w-4xl mx-auto">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <FilterSidebar />
            </aside>
            <section className="lg:col-span-3 space-y-6 section-bg p-4 rounded-lg">
              {loading ? (
                <div>Loading buses...</div>
              ) : buses.length === 0 ? (
                <div>No buses found.</div>
              ) : (
                buses.map((bus, idx) => (
                  <BusCard key={bus.id || idx} {...bus} />
                ))
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

