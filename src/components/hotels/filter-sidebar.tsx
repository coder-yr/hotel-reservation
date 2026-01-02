"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function FilterSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [priceRange, setPriceRange] = useState([
        Number(searchParams.get('minPrice')) || 50,
        Number(searchParams.get('maxPrice')) || 1000
    ])

    // Helper to check if a generic array param includes a value
    // Since searchParams.getAll isn't always reliable with some Next.js setups or simple ?facilities=a,b format
    // We'll assume comma separated for simple URL sharing
    const getParamArray = (key: string) => {
        const param = searchParams.get(key);
        return param ? param.split(',') : [];
    }

    const [selectedFacilities, setSelectedFacilities] = useState<string[]>(getParamArray('facilities'))

    const handleFacilityChange = (facility: string, checked: boolean) => {
        if (checked) {
            setSelectedFacilities([...selectedFacilities, facility])
        } else {
            setSelectedFacilities(selectedFacilities.filter(f => f !== facility))
        }
    }

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        params.set('minPrice', priceRange[0].toString())
        params.set('maxPrice', priceRange[1].toString())

        if (selectedFacilities.length > 0) {
            params.set('facilities', selectedFacilities.join(','))
        } else {
            params.delete('facilities')
        }

        router.push(`/hotels?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="w-full lg:w-72 shrink-0 bg-white p-6 rounded-2xl border sticky top-24 h-fit">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground h-auto p-0 hover:bg-transparent hover:text-primary"
                    onClick={() => router.push('/hotels')}
                >
                    Reset
                </Button>
            </div>

            {/* Price Range */}
            <div className="mb-8">
                <h4 className="font-medium mb-4 text-sm">Price Range</h4>
                <Slider
                    defaultValue={[50, 1000]}
                    max={2000}
                    step={50}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-3"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}+</span>
                </div>
            </div>

            {/* Amenities (Using Facilities to match Data logic) */}
            <div className="mb-8 space-y-3">
                <h4 className="font-medium mb-2 text-sm">Amenities</h4>
                {['Wifi', 'Pool', 'Parking', 'Restaurant', 'Gym', 'Pet Friendly'].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                            id={`amenity-${item}`}
                            checked={selectedFacilities.includes(item)}
                            onCheckedChange={(checked) => handleFacilityChange(item, checked as boolean)}
                        />
                        <Label htmlFor={`amenity-${item}`} className="text-sm font-normal text-muted-foreground cursor-pointer">{item}</Label>
                    </div>
                ))}
            </div>

            <Button onClick={applyFilters} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                Apply Filters
            </Button>
        </div>
    )
}
