"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createBus } from "@/lib/data";
import { Loader2, Bus, Plus, Trash2 } from "lucide-react";

const pointSchema = z.object({
    name: z.string().min(1, "Name is required"),
    time: z.string().min(1, "Time is required"),
    address: z.string().min(1, "Address is required"),
});

const busSchema = z.object({
    operator: z.string().min(2, "Operator name is required"),
    busType: z.string().min(1, "Bus type is required"),
    depart: z.string().min(1, "Departure time is required"),
    arrive: z.string().min(1, "Arrival time is required"),
    duration: z.string().min(1, "Duration is required"),
    price: z.string().min(1, "Price is required"),
    totalSeats: z.string().transform((val) => parseInt(val, 10)),
    amenities: z.array(z.string()).default([]),
    boardingPoints: z.array(pointSchema).default([]),
    droppingPoints: z.array(pointSchema).default([]),
});

type BusFormValues = z.infer<typeof busSchema>;

const AMENITIES_LIST = [
    { id: "wifi", label: "WiFi" },
    { id: "water", label: "Water Bottle" },
    { id: "charging", label: "Charging Point" },
    { id: "reading_light", label: "Reading Light" },
    { id: "emergency_exit", label: "Emergency Exit" },
];

export function AddBusForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<BusFormValues>({
        resolver: zodResolver(busSchema),
        defaultValues: {
            operator: "",
            busType: "",
            depart: "",
            arrive: "",
            duration: "",
            price: "",
            totalSeats: 40,
            amenities: [],
            boardingPoints: [],
            droppingPoints: [],
        },
    });

    const { fields: boardingFields, append: appendBoarding, remove: removeBoarding } = useFieldArray({
        control,
        name: "boardingPoints",
    });

    const { fields: droppingFields, append: appendDropping, remove: removeDropping } = useFieldArray({
        control,
        name: "droppingPoints",
    });

    const amenities = watch("amenities");

    const handleAmenityChange = (checked: boolean, amenityId: string) => {
        if (checked) {
            setValue("amenities", [...amenities, amenityId]);
        } else {
            setValue(
                "amenities",
                amenities.filter((id) => id !== amenityId)
            );
        }
    };

    const onSubmit = async (data: BusFormValues) => {
        setIsSubmitting(true);
        try {
            // Ensure points have IDs if needed, or just pass as is
            await createBus(data);
            toast({
                title: "Bus Added",
                description: "The new bus has been successfully added.",
            });
            reset();
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add bus. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Bus className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Add New Bus</h2>
                    <p className="text-sm text-muted-foreground">
                        Enter details to list a new bus route.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="operator">Operator Name</Label>
                        <Input id="operator" {...register("operator")} placeholder="e.g. Zingbus" />
                        {errors.operator && (
                            <p className="text-xs text-red-500">{errors.operator.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="busType">Bus Type</Label>
                        <Select
                            onValueChange={(value) => setValue("busType", value)}
                            defaultValue={watch("busType")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AC Seater">AC Seater</SelectItem>
                                <SelectItem value="AC Sleeper">AC Sleeper</SelectItem>
                                <SelectItem value="Non-AC Seater">Non-AC Seater</SelectItem>
                                <SelectItem value="Volvo Multi-Axle">Volvo Multi-Axle</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.busType && (
                            <p className="text-xs text-red-500">{errors.busType.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="depart">Departure Time</Label>
                        <Input id="depart" type="time" {...register("depart")} />
                        {errors.depart && (
                            <p className="text-xs text-red-500">{errors.depart.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="arrive">Arrival Time</Label>
                        <Input id="arrive" type="time" {...register("arrive")} />
                        {errors.arrive && (
                            <p className="text-xs text-red-500">{errors.arrive.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" {...register("duration")} placeholder="e.g. 4h 30m" />
                        {errors.duration && (
                            <p className="text-xs text-red-500">{errors.duration.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" type="number" {...register("price")} placeholder="e.g. 800" />
                        {errors.price && (
                            <p className="text-xs text-red-500">{errors.price.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="totalSeats">Total Seats</Label>
                        <Input
                            id="totalSeats"
                            type="number"
                            {...register("totalSeats")}
                            defaultValue={40}
                        />
                        {errors.totalSeats && (
                            <p className="text-xs text-red-500">{errors.totalSeats.message}</p>
                        )}
                    </div>
                </div>

                {/* Boarding Points Section */}
                <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Boarding Points</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendBoarding({ name: "", time: "", address: "" })}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Point
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {boardingFields.map((field, index) => (
                            <div key={field.id} className="flex gap-3 items-start">
                                <div className="grid grid-cols-3 gap-3 flex-1">
                                    <Input
                                        {...register(`boardingPoints.${index}.name`)}
                                        placeholder="Location Name (e.g. Sion)"
                                    />
                                    <Input
                                        {...register(`boardingPoints.${index}.time`)}
                                        type="time"
                                    />
                                    <Input
                                        {...register(`boardingPoints.${index}.address`)}
                                        placeholder="Address"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeBoarding(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dropping Points Section */}
                <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Dropping Points</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendDropping({ name: "", time: "", address: "" })}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Point
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {droppingFields.map((field, index) => (
                            <div key={field.id} className="flex gap-3 items-start">
                                <div className="grid grid-cols-3 gap-3 flex-1">
                                    <Input
                                        {...register(`droppingPoints.${index}.name`)}
                                        placeholder="Location Name (e.g. Pune)"
                                    />
                                    <Input
                                        {...register(`droppingPoints.${index}.time`)}
                                        type="time"
                                    />
                                    <Input
                                        {...register(`droppingPoints.${index}.address`)}
                                        placeholder="Address"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeDropping(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {AMENITIES_LIST.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={item.id}
                                    checked={amenities.includes(item.id)}
                                    onCheckedChange={(checked) =>
                                        handleAmenityChange(checked as boolean, item.id)
                                    }
                                />
                                <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Bus...
                        </>
                    ) : (
                        "Add Bus"
                    )}
                </Button>
            </form>
        </div>
    );
}
