import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DoraHero } from "@/components/dora/dora-hero";
import { ElevationSection } from "@/components/dora/elevation-section";
import { DiscoverySection } from "@/components/dora/discovery-section";
import { BookingSuite } from "@/components/dora/booking-suite";
import { FinalJourney } from "@/components/dora/final-journey";

export default async function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-black font-sans selection:bg-orange-500/30 selection:text-orange-200">
            {/* Transparent Header for visual continuity */}
            <div className="fixed top-0 w-full z-50">
                <Header />
            </div>

            <main className="flex-1">
                <DoraHero />
                <ElevationSection />
                <DiscoverySection />
                <BookingSuite />
                <FinalJourney />
            </main>

            <Footer />
        </div>
    );
}
