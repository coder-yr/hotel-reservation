import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Wifi, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { SeatSelection } from "./bus/SeatSelection";

export interface BusCardProps {
  id: string;
  operator: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  reviews: number;
  price: number;
  seatsAvailable: number;
  amenities: string[];
  seats: any[]; // Full seat data
}

export const BusCard = ({
  id,
  operator,
  busType,
  departureTime,
  arrivalTime,
  duration,
  rating,
  reviews,
  price,
  seatsAvailable,
  amenities,
  seats,
}: BusCardProps) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<string>("");
  const [selectedDropping, setSelectedDropping] = useState<string>("");

  const handleBookSeats = () => {
    if (selectedSeats.length === 0) return;
    const params = new URLSearchParams();
    params.set("seats", selectedSeats.join(","));
    if (selectedBoarding) params.set("boardingPoint", selectedBoarding);
    if (selectedDropping) params.set("droppingPoint", selectedDropping);
    router.push(`/bus/booking/${id}?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 mb-4 overflow-hidden">
      {/* Main Card Content */}
      <div className="p-5 flex flex-col md:flex-row gap-6">
        {/* Operator Info */}
        <div className="flex-[1.5]">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{operator}</h3>
          <p className="text-xs text-gray-500 mb-3">{busType}</p>
          <div className="flex items-center gap-2">
            {amenities.slice(0, 3).map((amenity, idx) => (
              <div key={idx} className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {amenity === 'wifi' && <Wifi className="w-3 h-3 mr-1" />}
                {amenity}
              </div>
            ))}
          </div>
        </div>

        {/* Timing Info */}
        <div className="flex-[2] flex items-center justify-between px-4">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-700">{departureTime}</p>
            <p className="text-xs text-gray-500">Borivali East</p>
          </div>
          <div className="flex flex-col items-center px-4">
            <p className="text-xs text-gray-400 mb-1">{duration}</p>
            <div className="w-24 h-[1px] bg-gray-300 relative">
              <div className="absolute -top-1 left-0 w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="absolute -top-1 right-0 w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-700">{arrivalTime}</p>
            <p className="text-xs text-gray-500">Pune</p>
          </div>
        </div>

        {/* Rating & Price */}
        <div className="flex-1 flex flex-col items-end justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
              <Star className="h-3 w-3 fill-white" />
              {rating}
            </div>
            <span className="text-xs text-gray-500">{reviews} ratings</span>
          </div>

          <div className="text-right mt-4">
            <p className="text-xs text-gray-400 line-through">₹{Math.round(price * 1.2)}</p>
            <p className="text-2xl font-bold text-gray-800">₹{price}</p>
          </div>
        </div>
      </div>

      {/* Footer / Action Bar */}
      <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <span className="font-bold text-gray-700">{seatsAvailable}</span> Seats available
        </div>
        <Button
          onClick={() => setExpanded(!expanded)}
          className="bg-[#d84e55] hover:bg-[#c23e44] text-white font-semibold h-9 px-6"
        >
          {expanded ? 'Hide Seats' : 'View Seats'}
        </Button>
      </div>

      {/* Inline Seat & Point Selection */}
      {expanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Seat Selection Area */}
            <div className="flex-1 border-r border-gray-200 pr-8">
              <h4 className="font-semibold mb-4 text-gray-800">1. Select Seats</h4>
              <SeatSelection
                selectedSeats={selectedSeats}
                onSeatSelect={setSelectedSeats}
                bus={{ seats }}
              />
            </div>

            {/* Boarding & Dropping Points Area */}
            <div className="flex-1 border-r border-gray-200 pr-8">
              <h4 className="font-semibold mb-4 text-gray-800">2. Select Boarding & Dropping Points</h4>
              <div className="grid grid-cols-2 gap-6">
                {/* Boarding Points */}
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1"><div className="w-2 h-2 bg-gray-800 rounded-full"></div> Boarding Point</h5>
                  <div className="space-y-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {['Sion, Mumbai', 'Dadar, Mumbai', 'Bandra, Mumbai'].map((point) => (
                      <div
                        key={point}
                        onClick={() => setSelectedBoarding(point)}
                        className={`p-3 rounded border cursor-pointer transition-all ${selectedBoarding === point ? 'border-[#d84e55] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-800">{point}</span>
                          <span className="text-xs font-bold text-gray-600">15:45</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dropping Points */}
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1"><div className="w-2 h-2 bg-[#d84e55] rounded-full"></div> Dropping Point</h5>
                  <div className="space-y-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {['Pune Central', 'Pune Camp', 'Pune Airport'].map((point) => (
                      <div
                        key={point}
                        onClick={() => setSelectedDropping(point)}
                        className={`p-3 rounded border cursor-pointer transition-all ${selectedDropping === point ? 'border-[#d84e55] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-800">{point}</span>
                          <span className="text-xs font-bold text-gray-600">21:00</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary & Proceed */}
            <div className="w-64 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Boarding Point</p>
                  <p className="font-medium text-gray-800 truncate">{selectedBoarding || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dropping Point</p>
                  <p className="font-medium text-gray-800 truncate">{selectedDropping || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-medium text-gray-800">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="font-bold text-2xl text-gray-800">
                    ₹{selectedSeats.reduce((acc, seatId) => {
                      const seat = seats.find(s => s.id === seatId);
                      return acc + (seat?.price || 0);
                    }, 0)}
                  </span>
                </div>
                <Button
                  onClick={handleBookSeats}
                  disabled={selectedSeats.length === 0 || !selectedBoarding || !selectedDropping}
                  className="w-full bg-[#d84e55] hover:bg-[#c23e44] text-white font-bold py-6 text-lg"
                >
                  PROCEED TO BOOK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
