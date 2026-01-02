import React, { useState } from 'react';
import { Plus, Trash2, Bed, Users, DollarSign, Layout } from 'lucide-react';
import { HotelFormData } from '../types';

interface Step3Props {
    data: HotelFormData;
    updateData: (data: Partial<HotelFormData>) => void;
}

export function Step3_Rooms({ data, updateData }: Step3Props) {
    const [newRoom, setNewRoom] = useState({
        type: 'Standard Room',
        price: '',
        capacity: '2',
        beds: '1 Queen Bed',
        size: ''
    });

    const addRoom = () => {
        if (!newRoom.price) return;
        const room = { ...newRoom, id: Date.now() };
        updateData({ rooms: [...(data.rooms || []), room] });
        setNewRoom({
            type: 'Standard Room',
            price: '',
            capacity: '2',
            beds: '1 Queen Bed',
            size: ''
        });
    };

    const removeRoom = (id: number) => {
        updateData({ rooms: (data.rooms || []).filter(r => r.id !== id) });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Room Configuration</h3>
                    <p className="text-slate-500 text-sm mt-1">Add details for each room type available</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {(data.rooms || []).length} Rooms Added
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Add Room Form */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-emerald-500" />
                            Add New Room Type
                        </h4>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room Type</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-slate-200 text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    value={newRoom.type}
                                    onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}
                                >
                                    <option>Standard Room</option>
                                    <option>Deluxe Suite</option>
                                    <option>Family Studio</option>
                                    <option>Penthouse</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price per Night ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-9 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        value={newRoom.price}
                                        onChange={e => setNewRoom({ ...newRoom, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Capacity</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                        <input
                                            type="number"
                                            className="w-full pl-9 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                            value={newRoom.capacity}
                                            onChange={e => setNewRoom({ ...newRoom, capacity: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Size (sq ft)</label>
                                    <div className="relative">
                                        <Layout className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                        <input
                                            type="number"
                                            placeholder="300"
                                            className="w-full pl-9 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                            value={newRoom.size}
                                            onChange={e => setNewRoom({ ...newRoom, size: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={addRoom}
                                disabled={!newRoom.price}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Room
                            </button>
                        </div>
                    </div>
                </div>

                {/* Room List */}
                <div className="lg:col-span-8">
                    {(!data.rooms || data.rooms.length === 0) ? (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            <Bed className="w-12 h-12 text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No rooms added yet</p>
                            <p className="text-slate-400 text-sm">Add a room type to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.rooms.map((room) => (
                                <div key={room.id} className="group relative bg-white border border-slate-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 rounded-2xl p-5 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{room.type}</h4>
                                            <p className="text-emerald-600 font-bold">${room.price} <span className="text-slate-400 text-xs font-normal">/ night</span></p>
                                        </div>
                                        <button
                                            onClick={() => removeRoom(room.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5" />
                                            {room.capacity} Guests
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Bed className="w-3.5 h-3.5" />
                                            {room.beds}
                                        </div>
                                        {room.size && (
                                            <div className="flex items-center gap-1.5">
                                                <Layout className="w-3.5 h-3.5" />
                                                {room.size} sq ft
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
