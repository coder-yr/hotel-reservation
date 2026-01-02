"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Bus, Wifi, Zap } from "lucide-react";

interface BusDetailsProps {
  selectedSeats: string[];
  bus?: any; // Add bus prop if available in parent
}

export function BusDetails({ selectedSeats, bus }: BusDetailsProps) {
  if (!bus) {
    // Fallback mock data if bus prop isn't passed yet
    bus = {
      operator: "InterCity SmartBus",
      type: "A/C Sleeper (2+1)",
      rating: "4.5",
      totalRatings: "1.2k",
      departureTime: "22:00",
      arrivalTime: "06:00",
      duration: "8h 00m",
      from: "Delhi",
      to: "Manali",
      amenities: ["WiFi", "Charging Point", "Water Bottle"]
    };
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex justify-between items-center">
          Trip Details
          <Badge variant="outline" className="text-xs font-normal">
            {bus.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Route Info */}
        <div className="flex justify-between items-start relative">
          {/* Connecting Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-dashed border-l border-slate-300" />

          <div className="space-y-6 w-full">
            {/* Departure */}
            <div className="flex gap-4 relative">
              <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 z-10" />
              <div>
                <div className="font-bold text-lg leading-none">{bus.departureTime}</div>
                <div className="text-sm font-medium text-slate-700 mt-1">{bus.from}</div>
                <div className="text-xs text-slate-500 mt-0.5">Kashmere Gate</div>
              </div>
            </div>

            {/* Duration (Floating) */}
            <div className="flex gap-4">
              <div className="w-4 flex justify-center">
                <span className="text-xs text-slate-400 bg-white px-1 py-0.5 border rounded">
                  {bus.duration}
                </span>
              </div>
            </div>


            {/* Arrival */}
            <div className="flex gap-4 relative">
              <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-100 z-10" />
              <div>
                <div className="font-bold text-lg leading-none">{bus.arrivalTime}</div>
                <div className="text-sm font-medium text-slate-700 mt-1">{bus.to}</div>
                <div className="text-xs text-slate-500 mt-0.5">Private Bus Stand</div>
              </div>
            </div>
          </div>
        </div>

        {/* Operator Info */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">{bus.operator}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <span className="text-yellow-500">★</span> {bus.rating} ({bus.totalRatings})
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
