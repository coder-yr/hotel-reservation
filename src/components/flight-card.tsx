import { Flight } from "@/lib/mock-flight-data";
import { Button } from "./ui/button";
import { Plane } from "lucide-react";

export function FlightCard({ flight }: { flight: Flight }) {
    return (
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Airline Info */}
                <div className="flex items-center gap-4 w-full md:w-1/4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Plane className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{flight.airline}</h3>
                        <p className="text-sm text-slate-500 font-medium">{flight.flightNumber}</p>
                    </div>
                </div>

                {/* Timing */}
                <div className="flex items-center gap-8 w-full md:w-2/4 justify-center">
                    <div className="text-center">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{flight.departureTime}</p>
                        <p className="text-sm font-bold text-slate-400">{flight.from}</p>
                    </div>

                    <div className="flex flex-col items-center gap-1 w-full max-w-[120px]">
                        <p className="text-xs text-slate-500">{flight.duration}</p>
                        <div className="w-full h-px bg-slate-300 dark:bg-slate-700 relative">
                            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 rounded-full bg-teal-500" />
                        </div>
                        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
                    </div>

                    <div className="text-center">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{flight.arrivalTime}</p>
                        <p className="text-sm font-bold text-slate-400">{flight.to}</p>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end gap-2 w-full md:w-1/4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{flight.price.toLocaleString()}</p>
                    <Button className="w-full md:w-auto rounded-full bg-slate-900 text-white hover:bg-teal-600 transition-colors">
                        Book Now
                    </Button>
                </div>

            </div>
        </div>
    );
}
