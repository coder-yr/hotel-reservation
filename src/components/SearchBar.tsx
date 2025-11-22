import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeftRight, Calendar as CalendarIcon, Bus, Search } from "lucide-react";
import { format, addDays } from "date-fns";

export const SearchBar = () => {
  const [fromCity, setFromCity] = useState("Borivali East");
  const [toCity, setToCity] = useState("Pune");
  const [date, setDate] = useState<Date>(new Date("2025-11-12"));

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* From Section */}
      <div className="flex-1 flex items-center border-r border-gray-200 relative group h-20 px-6 hover:bg-gray-50 transition-colors">
        <Bus className="h-5 w-5 text-gray-400 mr-3" />
        <div className="flex-1">
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 block">From</label>
          <input
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="w-full text-lg font-bold text-gray-800 bg-transparent border-none outline-none placeholder:text-gray-300"
            placeholder="Source"
          />
        </div>
        {/* Swap Button Absolute */}
        <button
          onClick={swapCities}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeftRight className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* To Section */}
      <div className="flex-1 flex items-center border-r border-gray-200 h-20 px-8 hover:bg-gray-50 transition-colors">
        <Bus className="h-5 w-5 text-gray-400 mr-3" />
        <div className="flex-1">
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 block">To</label>
          <input
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="w-full text-lg font-bold text-gray-800 bg-transparent border-none outline-none placeholder:text-gray-300"
            placeholder="Destination"
          />
        </div>
      </div>

      {/* Date Section */}
      <div className="flex-[0.8] flex items-center h-20 px-6 hover:bg-gray-50 transition-colors cursor-pointer">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center w-full">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Date</label>
                <div className="text-lg font-bold text-gray-800">
                  {format(date, "dd MMM yyyy")}
                </div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Search Button */}
      <button className="bg-[#d84e55] hover:bg-[#c23e44] text-white font-bold text-lg px-10 h-20 transition-colors uppercase tracking-wide">
        Search
      </button>
    </div>
  );
}
