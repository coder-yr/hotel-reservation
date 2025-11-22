
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HotelCard } from '@/components/hotel-card';
import { getApprovedHotels, getRoomsByHotelId, fromFirestore } from '@/lib/data';
import { SearchForm } from '@/components/search-form';
import { Button } from '@/components/ui/button';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Room } from '@/lib/types';

export default async function HomePage() {
  const allHotels = await getApprovedHotels();
  const hotelIds = allHotels.map(h => h.id);

  let allRooms: Room[] = [];
  if (hotelIds.length > 0) {
    const roomsQuery = query(collection(db, 'rooms'), where('hotelId', 'in', hotelIds), where('status', '==', 'approved'));
    const roomsSnapshot = await getDocs(roomsQuery);
    allRooms = roomsSnapshot.docs.map(doc => fromFirestore<Room>(doc)).filter(Boolean) as Room[];
  }

  const pricesByHotelId = allRooms.reduce((acc, room) => {
    if (!acc[room.hotelId] || room.price < acc[room.hotelId]) {
      acc[room.hotelId] = room.price;
    }
    return acc;
  }, {} as Record<string, number>);

  const hotelsWithPrices = allHotels.map(hotel => ({
    ...hotel,
    price: pricesByHotelId[hotel.id] || null,
  }));

  const popularInTurkey = hotelsWithPrices.filter(h => h.location.toLowerCase().includes('turkey')).slice(0, 6);
  const inGreece = hotelsWithPrices.filter(h => h.location.toLowerCase().includes('greece')).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative min-h-[600px] w-full flex flex-col items-center justify-start pt-64 pb-20 overflow-hidden">
          {/* Animated Gradient Orbs Background */}
          <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/20 blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/20 blur-[100px] animate-pulse delay-1000" />
            <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-400/20 blur-[80px] animate-pulse delay-700" />
          </div>

          <div className="relative z-10 w-full max-w-6xl px-4 text-center space-y-8 mt-10">
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
                Find your next <span className="text-gradient">adventure</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                Discover extraordinary stays, flights, and experiences in one place.
              </p>
            </div>

            <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <SearchForm />
            </div>

            {/* Floating Chips */}
            <div className="flex flex-wrap justify-center gap-3 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              {['🔥 Trending in Bali', '🏝️ Maldives Resorts', '🏔️ Swiss Alps', '🏙️ Tokyo City'].map((tag) => (
                <button key={tag} className="glass px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:scale-105">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Popular homes in Turkey</h2>
              <Button variant="ghost" size="sm">Show all &gt;</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {popularInTurkey.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} price={hotel.price ?? undefined} variant="compact" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Available in Greece this weekend</h2>
              <Button variant="ghost" size="sm">Show all &gt;</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {inGreece.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} price={hotel.price ?? undefined} variant="compact" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">All Stays</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {hotelsWithPrices.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} price={hotel.price ?? undefined} variant="compact" />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
