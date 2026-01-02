import React from 'react';
import { Building2, MapPin, Phone, Mail, Globe, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { HotelFormData } from '../types';

interface Step1Props {
    data: HotelFormData;
    updateData: (data: Partial<HotelFormData>) => void;
}

// Fixed type definition for props
const InputField = ({
    label,
    value,
    onChange,
    icon: Icon,
    placeholder,
    type = "text",
    className = ""
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    icon: React.ElementType;
    placeholder?: string;
    type?: string;
    className?: string;
}) => (
    <div className={`relative ${className}`}>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm group-hover:border-slate-300"
                placeholder={placeholder}
            />
        </div>
    </div>
);

export function Step1_BasicInfo({ data, updateData }: Step1Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Left Column: Form Fields */}\n      <div className="lg:col-span-8 space-y-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                        Property Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Hotel Name"
                            value={data.name}
                            onChange={(val: string) => updateData({ name: val })}
                            icon={Building2}
                            placeholder="e.g. Grand Emerald Resort"
                            className="md:col-span-2"
                        />

                        <InputField
                            label="City"
                            value={data.city}
                            onChange={(val: string) => updateData({ city: val })}
                            icon={MapPin}
                            placeholder="e.g. New York"
                        />

                        <InputField
                            label="State / Province"
                            value={data.state}
                            onChange={(val: string) => updateData({ state: val })}
                            icon={MapPin}
                            placeholder="e.g. NY"
                        />

                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                Description
                            </label>
                            <div className="relative group">
                                <div className="absolute top-4 left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => updateData({ description: e.target.value })}
                                    rows={4}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm group-hover:border-slate-300 resize-none"
                                    placeholder="Describe your property..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                        Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Email Address"
                            value={data.email}
                            onChange={(val: string) => updateData({ email: val })}
                            icon={Mail}
                            type="email"
                            placeholder="contact@hotel.com"
                        />

                        <InputField
                            label="Phone Number"
                            value={data.phone}
                            onChange={(val: string) => updateData({ phone: val })}
                            icon={Phone}
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                        />

                        <InputField
                            label="Website"
                            value={data.website}
                            onChange={(val: string) => updateData({ website: val })}
                            icon={Globe}
                            placeholder="https://www.hotel.com"
                        />

                        <InputField
                            label="Full Address"
                            value={data.address}
                            onChange={(val: string) => updateData({ address: val })}
                            icon={MapPin}
                            placeholder="123 Luxury Ave, Suite 100"
                        />
                    </div>
                </div>
            </div>

            {/* Right Column: Media Preview */}
            <div className="lg:col-span-4 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                    Media Assets
                </h3>

                <div className="space-y-6">
                    <InputField
                        label="Cover Image URL"
                        value={data.imageUrl}
                        onChange={(val: string) => updateData({ imageUrl: val })}
                        icon={ImageIcon}
                        placeholder="https://..."
                    />

                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
                        {data.imageUrl ? (
                            <>
                                <img
                                    src={data.imageUrl}
                                    alt="Hotel Preview"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <span className="text-white text-sm font-medium">Live Preview</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                <span className="text-sm">No image provided</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <InputField
                            label="Video Tour URL"
                            value={data.videoUrl}
                            onChange={(val: string) => updateData({ videoUrl: val })}
                            icon={Video}
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
