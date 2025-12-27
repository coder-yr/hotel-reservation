import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchForm } from "@/components/search-form";
import { HotelCard } from "@/components/hotel-card";
import { getApprovedHotels } from "@/lib/firebase";
import { HeroSceneWrapper } from "@/components/hero-scene-wrapper";

import dynamic from "next/dynamic";

const PlanYourTrip = dynamic(() => import("@/components/plan-your-trip").then(mod => mod.PlanYourTrip));
const ExplorePackages = dynamic(() => import("@/components/marketing-sections").then(mod => mod.ExplorePackages));
const DiscoverMore = dynamic(() => import("@/components/marketing-sections").then(mod => mod.DiscoverMore));

export default async function HomePage() {
  const allHotels = await getApprovedHotels();

  // Filter for popular/featured if needed, or just show all
  const popularHotels = allHotels.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section with 3D Background */}
        <div className="relative min-h-[600px] w-full flex flex-col items-center justify-start pt-64 pb-20 overflow-hidden" style={{ backgroundColor: '#06060c' }}>
          {/* 3D Scene Wrapper (Client Component) */}
          <HeroSceneWrapper />

          <div className="relative z-10 w-full max-w-6xl px-4 text-center space-y-8 mt-10 pointer-events-none">
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pointer-events-auto">
              {/* Removed "Find your next adventure" heading as requested */}
              <p className="text-xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
                Discover extraordinary stays, flights, and experiences in one place.
              </p>
            </div>

            <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 pointer-events-auto">
              <SearchForm />
            </div>

            {/* Floating Chips / Pills if any were there, omitted for cleaner look or restored if remembered */}
            <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 pointer-events-auto">
              {[
                { label: "Trending in Bali", icon: "🔥" },
                { label: "Maldives Resorts", icon: "🏝️" },
                { label: "Swiss Alps", icon: "🏔️" },
                { label: "Tokyo City", icon: "bmw" },
              ].map((chip) => (
                <button
                  key={chip.label}
                  className="glass px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-white/40 transition-colors flex items-center gap-2"
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Your Trip Section */}
        <PlanYourTrip />

        {/* New Marketing Sections */}
        <ExplorePackages />
        <DiscoverMore />

        {/* Hotel Listings */}
        <div className="container mx-auto px-4 py-16 space-y-16">
          <section>
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Popular homes in Turkey</h2>
                <p className="text-muted-foreground">Top-rated locations recommended for you</p>
              </div>
              <Link href="/hotels" className="text-sm font-medium text-primary hover:underline">
                Show all &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularHotels.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">All Stays</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allHotels.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} variant="compact" />
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
