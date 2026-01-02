import { Header } from '@/components/header'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import { FilterSidebar } from '@/components/hotels/filter-sidebar'
import { ListingHeader } from '@/components/hotels/listing-header'
import { HotelCard } from '@/components/hotel-card'
import { searchHotels } from '@/lib/data'
import { HotelLandingHero } from '@/components/hotels/hotel-landing-hero'
import { TrendingDestinations } from '@/components/hotels/trending-destinations'
import { HotelBenefits } from '@/components/hotels/hotel-benefits'

interface HotelsPageProps {
    searchParams: Promise<{
        destination?: string;
        minPrice?: string;
        maxPrice?: string;
        facilities?: string;
        location?: string;
    }>
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
    const params = await searchParams;

    // Combine destination and location if both exist (search form uses 'location' sometimes for hotels)
    const destinationQuery = params.destination || params.location;

    const hotels = await searchHotels({
        destination: destinationQuery,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        facilities: params.facilities ? params.facilities.split(',') : undefined,
    });

    const isFiltered = !!destinationQuery || !!params.minPrice || !!params.facilities;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Header />

            <main className="flex-1 pb-20">
                {/* Hero - Show full hero but pre-filled if searching */}
                <HotelLandingHero initialDestination={destinationQuery} />

                {/* Only show "Trending" if user hasn't selected a destination yet */}
                {!isFiltered && (
                    <>
                        <TrendingDestinations />
                        <HotelBenefits />
                    </>
                )}

                {/* Main Listing Area */}
                <div className="container mx-auto px-4 mt-20" id="browse-hotels">
                    <div className="text-center mb-12 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            {destinationQuery ? `Stays in ${destinationQuery}` : 'Browse All Properties'}
                        </h2>
                        <p className="text-slate-500 text-lg">
                            {isFiltered
                                ? `${hotels.length} properties found matching your criteria.`
                                : 'Explore our handpicked selection of hotels, resorts, and vacation homes.'}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="hidden lg:block w-72 shrink-0">
                            <FilterSidebar />
                        </aside>

                        {/* Listings */}
                        <div className="flex-1">
                            <ListingHeader count={hotels.length} />

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {hotels.map((hotel) => (
                                    <Link key={hotel.id} href={`/hotel/${hotel.id}`} className="block h-full">
                                        <HotelCard hotel={hotel} />
                                    </Link>
                                ))}
                                {/* Fallback/Empty State */}
                                {hotels.length === 0 && (
                                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <h3 className="text-xl font-bold text-slate-900">No hotels found</h3>
                                        <p className="text-slate-500 mt-2">
                                            We couldn't find any matches for "{destinationQuery || 'your filters'}".
                                            <br />Try adjusting your price range or amenities.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
