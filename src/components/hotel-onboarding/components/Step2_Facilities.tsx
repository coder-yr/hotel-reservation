import React from 'react';
import { Wifi, Car, Utensils, Dumbbell, Waves, Sprout, Clock, FileText, Dog } from 'lucide-react';
import { HotelFormData } from '../types';
import { clsx } from 'clsx';

interface Step2Props {
    data: HotelFormData;
    updateData: (data: Partial<HotelFormData>) => void;
}

const FACILITIES = [
    { id: 'wifi', label: 'Free Wi-Fi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
    { id: 'gym', label: 'Fitness Center', icon: Dumbbell },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'spa', label: 'Wellness Spa', icon: Sprout },
];

export function Step2_Facilities({ data, updateData }: Step2Props) {
    const toggleFacility = (id: string) => {
        const current = data.facilities || [];
        const updated = current.includes(id)
            ? current.filter(item => item !== id)
            : [...current, id];
        updateData({ facilities: updated });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Facilities Section */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Amenities & Facilities</h3>
                <p className="text-slate-500 mb-6 text-sm">Select all the amenities available at your property</p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {FACILITIES.map((facility) => {
                        const isSelected = data.facilities?.includes(facility.id);
                        const Icon = facility.icon;

                        return (
                            <button
                                key={facility.id}
                                onClick={() => toggleFacility(facility.id)}
                                className={clsx(
                                    "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 gap-3 group relative overflow-hidden",
                                    isSelected
                                        ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 shadow-md shadow-emerald-100"
                                        : "border-slate-100 bg-white text-slate-500 hover:border-emerald-200 hover:bg-slate-50"
                                )}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                                <Icon className={clsx(
                                    "w-8 h-8 transition-transform duration-300 group-hover:scale-110",
                                    isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"
                                )} />
                                <span className="font-medium text-sm">{facility.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Policies Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                        Policies & Rules
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                Check-in Time
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="time"
                                    value={data.checkIn}
                                    onChange={(e) => updateData({ checkIn: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                Check-out Time
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="time"
                                    value={data.checkOut}
                                    onChange={(e) => updateData({ checkOut: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                            Cancellation Policy
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                            <textarea
                                value={data.cancellationPolicy}
                                onChange={(e) => updateData({ cancellationPolicy: e.target.value })}
                                rows={4}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 resize-none"
                                placeholder="Enter policy details..."
                            />
                        </div>
                    </div>
                </div>

                {/* Extra Settings */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                        Additional Settings
                    </h3>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between hover:border-emerald-200 transition-colors shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={clsx(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                                data.petFriendly ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                            )}>
                                <Dog className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Pet Friendly</h4>
                                <p className="text-sm text-slate-500">Allow guests to bring pets</p>
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.petFriendly}
                                onChange={(e) => updateData({ petFriendly: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
