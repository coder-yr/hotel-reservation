"use client";

import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BoardDropPointProps {
  selectedSeats: string[];
  bus?: any;
  onContinue: () => void;
  initialBoarding?: string;
  initialDropping?: string;
  onBoardingChange?: (val: string) => void;
  onDroppingChange?: (val: string) => void;
}

export function BoardDropPoint({
  selectedSeats,
  bus,
  onContinue,
  initialBoarding,
  initialDropping,
  onBoardingChange,
  onDroppingChange
}: BoardDropPointProps) {
  const [boarding, setBoarding] = useState(initialBoarding || "");
  const [dropping, setDropping] = useState(initialDropping || "");

  const handleBoardingChange = (val: string) => {
    setBoarding(val);
    onBoardingChange?.(val);
  };

  const handleDroppingChange = (val: string) => {
    setDropping(val);
    onDroppingChange?.(val);
  };

  const boardingPoints = [
    { id: "bp1", time: "22:00", place: "Kashmere Gate", landmark: "Metro Station Gate 5" },
    { id: "bp2", time: "22:30", place: "Majnu Ka Tila", landmark: "Petrol Pump" },
    { id: "bp3", time: "23:15", place: "RK Ashram", landmark: "Metro Station" },
  ];

  const droppingPoints = [
    { id: "dp1", time: "06:00", place: "Private Bus Stand", landmark: "Near Mall Road" },
    { id: "dp2", time: "06:45", place: "Patlikuhal", landmark: "Main Highway" },
  ];

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">1</span>
          Select Boarding Point
        </h3>
        <RadioGroup value={boarding} onValueChange={handleBoardingChange} className="space-y-3">
          {boardingPoints.map((point) => (
            <div key={point.id} className={`flex items-center justify-between p-3 rounded-lg border ${boarding === point.place ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={point.place} id={point.id} />
                <Label htmlFor={point.id} className="cursor-pointer">
                  <div className="font-semibold text-slate-900">{point.time} - {point.place}</div>
                  <div className="text-xs text-slate-500">{point.landmark}</div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">2</span>
          Select Dropping Point
        </h3>
        <RadioGroup value={dropping} onValueChange={handleDroppingChange} className="space-y-3">
          {droppingPoints.map((point) => (
            <div key={point.id} className={`flex items-center justify-between p-3 rounded-lg border ${dropping === point.place ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={point.place} id={point.id} />
                <Label htmlFor={point.id} className="cursor-pointer">
                  <div className="font-semibold text-slate-900">{point.time} - {point.place}</div>
                  <div className="text-xs text-slate-500">{point.landmark}</div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button
        className="w-full mt-6"
        disabled={!boarding || !dropping}
        onClick={onContinue}
      >
        Continue to Passenger Details
      </Button>
    </div>
  );
}
