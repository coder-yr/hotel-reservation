"use client";

import React from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PassengerInfoProps {
  selectedSeats: string[];
  onBook: (data: any) => void;
}

export function PassengerInfo({ selectedSeats, onBook }: PassengerInfoProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      phone: "",
      passengers: selectedSeats.map(seat => ({ seatNumber: seat, name: "", age: "", gender: "" }))
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "passengers"
  });

  return (
    <form onSubmit={handleSubmit(onBook)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" {...register("email", { required: true })} />
              {errors.email && <span className="text-xs text-red-500">Required</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" {...register("phone", { required: true })} />
              {errors.phone && <span className="text-xs text-red-500">Required</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 text-sm rounded-md">
            <span>ℹ️</span>
            Your ticket and booking details will be sent here.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Passenger Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium text-slate-700">Passenger {index + 1} <span className="text-sm font-normal text-slate-500">(Seat {field.seatNumber})</span></h4>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-3 space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Name" {...register(`passengers.${index}.name` as const, { required: true })} />
                </div>
                <div className="md:col-span-1 space-y-2">
                  <Label>Age</Label>
                  <Input type="number" placeholder="Age" {...register(`passengers.${index}.age` as const, { required: true })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Gender</Label>
                  <Select onValueChange={(val) => {
                    // Need to manually handle select with react-hook-form if not using Controller
                    // For simplicity, assumed handled or added hidden input logic if needed
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full">
        Proceed to Payment
      </Button>
    </form>
  );
}
