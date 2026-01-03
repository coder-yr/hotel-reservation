import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchForm } from '@/components/search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, MapPin, Clock, Wifi, Coffee, Armchair, TicketPercent } from 'lucide-react';
import Image from 'next/image';
import { getAllBuses } from '@/lib/data';

const ROUTE_IMAGES: Record<string, string> = {
  "Mumbai-Pune": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600&auto=format&fit=crop",
  "Bangalore-Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop",
  "Delhi-Manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&auto=format&fit=crop",
  "Chennai-Bangalore": "https://images.unsplash.com/photo-1582972236019-6c1db6c3d3dd?q=80&w=600&auto=format&fit=crop",
  "Delhi-Jaipur": "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop",
  "Hyderabad-Bangalore": "https://images.unsplash.com/photo-1622308644420-a94bb8adad3f?q=80&w=600&auto=format&fit=crop",
};
const DEFAULT_ROUTE_IMAGE = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop";

export default async function BusPage() {
  const buses = await getAllBuses();

  // Deduplicate routes based on From-To pair
  const uniqueRoutes = Array.from(new Set(buses.map(b => `${b.depart}-${b.arrive}`)))
    .slice(0, 4)
    .map(routeKey => {
      const [from, to] = routeKey.split('-');
      // Find a bus for this route to get typical details
      const representativeBus = buses.find(b => b.depart === from && b.arrive === to);
      return {
        from,
        to,
        duration: representativeBus?.duration || "N/A",
        price: representativeBus?.price ? `From ₹${representativeBus.price}` : "Check Price",
        image: ROUTE_IMAGES[routeKey] || ROUTE_IMAGES[`${from}-${to}`] || DEFAULT_ROUTE_IMAGE
      };
    });

  const popularRoutes = uniqueRoutes.length > 0 ? uniqueRoutes : [
    {
      from: "Mumbai",
      to: "Pune",
      duration: "3h 15m",
      price: "From ₹350",
      image: ROUTE_IMAGES["Mumbai-Pune"]
    },
    {
      from: "Bangalore",
      to: "Goa",
      duration: "10h 30m",
      price: "From ₹800",
      image: ROUTE_IMAGES["Bangalore-Goa"]
    },
    {
      from: "Delhi",
      to: "Manali",
      duration: "12h 45m",
      price: "From ₹1,200",
      image: ROUTE_IMAGES["Delhi-Manali"]
    },
    {
      from: "Chennai",
      to: "Bangalore",
      duration: "6h 00m",
      price: "From ₹550",
      image: ROUTE_IMAGES["Chennai-Bangalore"]
    }
  ];

  const amenities = [
    { icon: Armchair, title: "Comfortable Sleeper", desc: "Spacious sleeper & seater options for relaxed travel." },
    { icon: Wifi, title: "Free WiFi", desc: "Stay connected throughout your journey." },
    { icon: Coffee, title: "Snacks & Water", desc: "Complimentary refreshment on select premium buses." },
    { icon: MapPin, title: "Live Tracking", desc: "Track your bus in real-time for safety & convenience." },
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
              className="w-full h-full object-cover brightness-[0.7]"
              poster="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1920&auto=format&fit=crop"
            >
              <source src="/videos/Bus.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="container relative z-10 px-4">
            <div className="text-center mb-10 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">India's No. 1 Bus Booking Site</h1>
              <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">Trusted by over 40 million travellers</p>
            </div>
            <SearchForm defaultTab="bus" />
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-16 container px-4 bg-muted/20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Top Rated Bus Routes</h2>
              <p className="text-muted-foreground">Handpicked routes for your next getaway</p>
            </div>
            <Button variant="outline">View All</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, idx) => (
              <Card key={idx} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-4 right-4 text-white flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80 uppercase tracking-widest mb-1">Route</p>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        {route.from} <span className="opacity-70">to</span> {route.to}
                      </h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 bg-card">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="font-bold text-lg text-primary">{route.price}</div>
                  </div>
                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 group-hover:shadow-lg transition-all">Book Seat</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose Us Icons */}
        <section className="py-20 container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Unmatched Bus Travel Experience</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {amenities.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white mb-4">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-12 container px-4 mb-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl">
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <TicketPercent className="w-4 h-4" /> Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Save up to 20%</h2>
              <p className="text-lg opacity-90 mb-8">On your first bus booking with code <span className="font-mono font-bold bg-white text-red-500 px-2 py-1 rounded">NEWBUS20</span></p>
              <Button size="lg" variant="secondary" className="font-bold">Claim Offer</Button>
            </div>
            <div className="relative z-10 mt-8 md:mt-0">
              <Bus className="w-48 h-48 text-white/20 rotate-12" />
            </div>

            {/* Abstract Patterns */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
