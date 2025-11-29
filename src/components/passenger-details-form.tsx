"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type PassengerDetails = {
    firstName: string
    lastName: string
    age: string
    gender: string
    passportNumber: string
    nationality: string
}

type Props = {
    details: PassengerDetails
    onChange: (details: PassengerDetails) => void
}

export default function PassengerDetailsForm({ details, onChange }: Props) {
    const handleChange = (field: keyof PassengerDetails, value: string) => {
        onChange({ ...details, [field]: value })
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-semibold border-b pb-4">Traveler Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            placeholder="e.g. John"
                            value={details.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            placeholder="e.g. Doe"
                            value={details.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            placeholder="Age"
                            value={details.age}
                            onChange={(e) => handleChange('age', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Gender</Label>
                        <RadioGroup
                            value={details.gender}
                            onValueChange={(v) => handleChange('gender', v)}
                            className="flex gap-6 mt-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female">Female</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" />
                                <Label htmlFor="other">Other</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Select value={details.nationality} onValueChange={(v) => handleChange('nationality', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IN">India</SelectItem>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="AE">UAE</SelectItem>
                                <SelectItem value="SG">Singapore</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="passport">Passport Number (Optional)</Label>
                        <Input
                            id="passport"
                            placeholder="Enter passport number"
                            value={details.passportNumber}
                            onChange={(e) => handleChange('passportNumber', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
