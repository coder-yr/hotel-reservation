import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function FlightsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero / Search */}
        {/* Hero / Search */}
        <div className="relative h-[400px] w-full flex items-center justify-center mb-12">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
              alt="Flights Hero"
              className="w-full h-full object-cover brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-6xl px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-8 drop-shadow-md">
              Book Domestic and International Flights
            </h1>
            <div className="glass p-8 rounded-[2rem] shadow-2xl border-0">
              <form className="space-y-4">
                <div className="flex gap-3 items-center justify-between border-b pb-4 mb-4">
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="trip" defaultChecked className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Oneway</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="trip" className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Round Trip</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="trip" className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Multi City</span>
                    </label>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Trusted by millions of travelers</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold uppercase text-muted-foreground">From</label>
                    <input className="w-full p-3 glass border-0 rounded-xl font-semibold text-lg focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-500" placeholder="Delhi (DEL)" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold uppercase text-muted-foreground">To</label>
                    <input className="w-full p-3 glass border-0 rounded-xl font-semibold text-lg focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-500" placeholder="Bengaluru (BLR)" />
                  </div>
                  <div className="md:col-span-1 space-y-1">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Departure</label>
                    <input type="date" className="w-full p-3 glass border-0 rounded-xl font-medium" />
                  </div>
                  <div className="md:col-span-1 space-y-1">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Return</label>
                    <input type="date" className="w-full p-3 glass border-0 rounded-xl font-medium" />
                  </div>
                </div>

                <div className="flex items-center gap-3 md:justify-between pt-4">
                  <div className="flex items-center gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Travellers & Class</label>
                      <select className="w-full bg-transparent font-semibold outline-none">
                        <option>1 Traveller, Economy</option>
                        <option>2 Travellers, Economy</option>
                        <option>1 Traveller, Business</option>
                      </select>
                    </div>
                  </div>

                  <div className="ml-auto">
                    <a href="/flights/results" className="inline-block">
                      <button type="button" className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                        SEARCH FLIGHTS
                      </button>
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Offers row */}
        <section className="container mx-auto px-4 py-8 section-bg p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Offers For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="#" className="block border rounded-lg p-4 shadow-sm">
              <div className="font-medium">Up to 52% OFF on Travel Bookings!</div>
              <div className="text-sm text-muted-foreground">Bus, Hotels, Cabs, Flights, Trains</div>
            </Link>
            <Link href="#" className="block border rounded-lg p-4 shadow-sm">
              <div className="font-medium">Bank Offers</div>
              <div className="text-sm text-muted-foreground">Save with partner cards</div>
            </Link>
            <Link href="#" className="block border rounded-lg p-4 shadow-sm">
              <div className="font-medium">Explore Offers</div>
              <div className="text-sm text-muted-foreground">View all</div>
            </Link>
            <Link href="#" className="block border rounded-lg p-4 shadow-sm">
              <div className="font-medium">Hotels</div>
              <div className="text-sm text-muted-foreground">Up to 52% OFF</div>
            </Link>
          </div>
        </section>

        {/* Popular routes & FAQs (short) */}
        <section className="container mx-auto px-4 py-6 section-bg p-6 rounded-lg">
          <h3 className="font-semibold mb-3">Popular Flight Routes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <ul className="space-y-1">
                <li>Delhi Flights</li>
                <li>Mumbai Flights</li>
                <li>Bengaluru Flights</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                <li>Goa Flights</li>
                <li>Hyderabad Flights</li>
                <li>Jaipur Flights</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                <li>Chennai Flights</li>
                <li>Kolkata Flights</li>
                <li>Ahmedabad Flights</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

