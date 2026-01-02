import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchForm } from '@/components/search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, CalendarRange, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getAllFlights } from '@/lib/data';

const CITY_IMAGES: Record<string, string> = {
    "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea90b79875c?q=80&w=600&auto=format&fit=crop",
    "London": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop",
    "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=600&auto=format&fit=crop",
    "Bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600&auto=format&fit=crop",
    "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
    "New York": "https://images.unsplash.com/photo-1496442226310-804d10071206?q=80&w=600&auto=format&fit=crop",
    "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop",
    "Mumbai": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600&auto=format&fit=crop",
    "Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop",
    "Bangalore": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600&auto=format&fit=crop",
    "Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop",
};

const DEFAULT_CITY_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop";

export default async function FlightsPage() {
    const flights = await getAllFlights();

    // Process Popular Destinations (Unique Arrival Cities)
    const uniqueDestinations = Array.from(new Set(flights.map(f => f.arrive))).slice(0, 4);

    // Fallback if no flights
    const displayDestinations = uniqueDestinations.length > 0 ? uniqueDestinations.map(city => ({
        city,
        country: "Popular Destination", // We don't have country data in simple Flight type, keeping generic
        image: CITY_IMAGES[city] || DEFAULT_CITY_IMAGE,
        price: "Check Prices"
    })) : [
        // Fallback static data if DB is empty to keep UI looking good
        { city: "Dubai", country: "UAE", price: "From ₹18,000", image: CITY_IMAGES["Dubai"] },
        { city: "London", country: "UK", price: "From ₹45,000", image: CITY_IMAGES["London"] },
        { city: "Singapore", country: "Singapore", price: "From ₹22,000", image: CITY_IMAGES["Singapore"] },
        { city: "Bangkok", country: "Thailand", price: "From ₹12,000", image: CITY_IMAGES["Bangkok"] }
    ];

    // Process Deals (Just taking first 3 flights for now, randomizing would be better but simple is fine)
    const displayDeals = flights.length > 0 ? flights.slice(0, 3).map(f => ({
        from: f.depart,
        to: f.arrive,
        airline: f.airline,
        price: f.price,
        date: "Upcoming" // We don't have specific dates in Flight type yet, it's a schedule
    })) : [
        { from: "Delhi", to: "Mumbai", airline: "Indigo", price: "₹4,500", date: "15 Oct" },
        { from: "Bangalore", to: "Goa", airline: "Vistara", price: "₹3,200", date: "20 Oct" },
        { from: "Chennai", to: "Delhi", airline: "Air India", price: "₹6,100", date: "25 Oct" }
    ];


    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            <Header />
            <main className="flex-1">

                {/* Hero Section */}
                <section className="relative h-[95vh] flex items-center justify-center pt-20">
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover brightness-[0.6]"
                        >
                            <source src="/videos/airline.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="container relative z-10 px-4">
                        <div className="text-center mb-8 text-white">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover the World</h1>
                            <p className="text-xl md:text-2xl opacity-90">Find and book great flights at the lowest prices.</p>
                        </div>
                        <SearchForm defaultTab="flight" />
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 container px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: Plane, title: "Huge Selection", desc: "Compare flights from 500+ airlines" },
                            { icon: Tag, title: "Best Price Match", desc: "Found a cheaper flight? We will match it." },
                            { icon: ShieldCheck, title: "Secure Booking", desc: "100% secure payment processing" },
                            { icon: CalendarRange, title: "Flexible Plans", desc: "Change your mind? Modify simply." },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="p-4 rounded-full bg-primary/10 text-primary">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-xl">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Popular Destinations */}
                <section className="py-12 bg-muted/20">
                    <div className="container px-4">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
                                <p className="text-muted-foreground">Top recurring destinations from our travellers</p>
                            </div>
                            <Button variant="outline">View All</Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayDestinations.map((dest, idx) => (
                                <Card key={idx} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={dest.image}
                                            alt={dest.city}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="text-2xl font-bold">{dest.city}</h3>
                                            <p className="opacity-90">{dest.country}</p>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 flex justify-between items-center bg-white dark:bg-slate-900 absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="font-semibold text-primary">{dest.price}</span>
                                        <Button size="sm" className="rounded-full">Book Now</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Flight Deals Grid */}
                <section className="py-16 container px-4">
                    <h2 className="text-3xl font-bold mb-8">Latest Flight Deals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {displayDeals.map((deal, idx) => (
                            <div key={idx} className="border border-dashed border-primary/30 rounded-xl p-6 bg-primary/5 hover:bg-primary/10 transition-colors flex justify-between items-center cursor-pointer group">
                                <div>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <CalendarRange className="w-4 h-4" /> {deal.date}
                                    </div>
                                    <div className="flex items-center gap-4 text-xl font-bold mb-1">
                                        <span>{deal.from}</span>
                                        <ArrowRight className="w-5 h-5 text-muted-foreground mx-1 group-hover:translate-x-1 transition-transform" />
                                        <span>{deal.to}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{deal.airline}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                                    <p className="text-xl font-bold text-primary">{deal.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="py-20 bg-slate-900 text-white mt-12">
                    <div className="container px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Never Miss a Deal</h2>
                        <p className="text-slate-300 mb-8 max-w-xl mx-auto">Subscribe to our newsletter and get exclusive flight offers, travel tips, and more delivered straight to your inbox.</p>
                        <div className="flex max-w-md mx-auto gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Button size="lg" className="rounded-full px-8">Subscribe</Button>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
