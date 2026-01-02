
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import FlightResultsClient from '@/components/flight-results-client'
import { getAllFlights, getFilteredFlights } from '@/lib/data'

type Props = {
  searchParams: Promise<{
    origin?: string
    destination?: string
    from?: string // Date
    guests?: string
  }>
}

export default async function FlightResultsPage({ searchParams }: Props) {
  const { origin, destination, from: date, guests } = await searchParams

  // We can fetch initial data here server-side if we want, or let the client handling IT.
  // Given existing client component structure, we'll pass params to it.

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="hero-gradient rounded p-4 mb-6">
          <h2 className="text-lg font-semibold text-white">
            Flights {origin ? `from ${origin}` : ''} {destination ? `to ${destination}` : ''}
          </h2>
        </div>

        <div className="lg:grid lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="border rounded p-4 mb-4 bg-card">
              <h3 className="font-semibold mb-3">Filters</h3>
              <div className="text-sm text-muted-foreground">
                <label className="flex items-center gap-2"><input type="checkbox" /> Non Stop</label>
                <label className="flex items-center gap-2 mt-2"><input type="checkbox" /> 1 Stop</label>
                <div className="mt-4">Price Range</div>
                <input type="range" min={0} max={10000} className="w-full" />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-9">
            {/* Results list (client) which handles fetching/displaying */}
            <FlightResultsClient
              initialOrigin={origin}
              initialDestination={destination}
              initialDate={date}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
