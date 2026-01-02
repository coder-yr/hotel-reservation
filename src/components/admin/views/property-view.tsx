"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableHead
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DataTable } from "../data-table";
import { columns as allHotelsColumns } from "../all-hotels-columns";
import type { Hotel, Room } from "@/lib/types";
import { Check, X, User as UserIcon, MapPin, Building, BedDouble, PlusCircle } from "lucide-react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PropertyViewProps {
    pendingHotels: Hotel[];
    pendingRooms: Room[];
    allHotels: Hotel[];
    onHotelAction: (id: string, action: 'approve' | 'reject') => void;
    onRoomAction: (id: string, action: 'approve' | 'reject') => void;
    isPending: boolean;
}

export function PropertyView({
    pendingHotels,
    pendingRooms,
    allHotels,
    onHotelAction,
    onRoomAction,
    isPending
}: PropertyViewProps) {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Property Management</h2>
                    <p className="text-muted-foreground">Review submissions and manage listings.</p>
                </div>
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
                </Button>
            </div>

            {/* Pending Approvals Grid */}
            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    Pending Approvals
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Hotels Card */}
                    <Card className="border-none shadow-sm overflow-hidden h-full flex flex-col">
                        <CardHeader className="bg-white border-b py-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base font-semibold">New Hotel Requests</CardTitle>
                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                    {pendingHotels.length} Pending
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <Table>
                                <TableBody>
                                    {pendingHotels.map(hotel => (
                                        <TableRow key={hotel.id} className="hover:bg-muted/30">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 relative rounded-md overflow-hidden bg-gray-100 shrink-0">
                                                        {hotel.coverImage ? (
                                                            <Image src={hotel.coverImage} fill className="object-cover" alt={hotel.name} />
                                                        ) : (
                                                            <Building className="h-5 w-5 text-gray-400 m-auto mt-2.5" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="font-medium text-sm">{hotel.name}</p>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <UserIcon className="h-3 w-3" /> {hotel.ownerName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200" onClick={() => onHotelAction(hotel.id, 'approve')} disabled={isPending}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => onHotelAction(hotel.id, 'reject')} disabled={isPending}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {pendingHotels.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                                                No pending hotel requests
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Pending Rooms Card */}
                    <Card className="border-none shadow-sm overflow-hidden h-full flex flex-col">
                        <CardHeader className="bg-white border-b py-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base font-semibold">New Room Requests</CardTitle>
                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                    {pendingRooms.length} Pending
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <Table>
                                <TableBody>
                                    {pendingRooms.map(room => (
                                        <TableRow key={room.id} className="hover:bg-muted/30">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 relative rounded-md overflow-hidden bg-gray-100 shrink-0">
                                                        {room.images?.[0] ? (
                                                            <Image src={room.images[0]} fill className="object-cover" alt={room.title} />
                                                        ) : (
                                                            <BedDouble className="h-5 w-5 text-gray-400 m-auto mt-2.5" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="font-medium text-sm line-clamp-1">{room.title}</p>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Building className="h-3 w-3" /> {room.hotelName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200" onClick={() => onRoomAction(room.id, 'approve')} disabled={isPending}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => onRoomAction(room.id, 'reject')} disabled={isPending}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {pendingRooms.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                                                No pending room requests
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* All Hotels Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b px-6 py-4">
                    <CardTitle className="text-base font-semibold">Active Listings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable columns={allHotelsColumns} data={allHotels} />
                </CardContent>
            </Card>
        </div>
    );
}
