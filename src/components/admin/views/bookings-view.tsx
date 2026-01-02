"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, User as UserIcon, Calendar, BookOpen, MoreHorizontal } from "lucide-react";
import type { Booking } from "@/lib/types";
import { format } from "date-fns";
import { formatINR } from '@/lib/utils';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BookingsViewProps {
    bookings: Booking[];
}

export function BookingsView({ bookings }: BookingsViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
                    <p className="text-muted-foreground">View and manage all platform reservations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-9">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b px-6 py-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold">Results ({bookings.length})</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="pl-6 w-[250px] font-medium">Guest</TableHead>
                                <TableHead className="font-medium">Details</TableHead>
                                <TableHead className="font-medium">Stay Duration</TableHead>
                                <TableHead className="font-medium">Status</TableHead>
                                <TableHead className="text-right pr-6 font-medium">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.length > 0 ? bookings.map(booking => (
                                <TableRow key={booking.id} className="cursor-pointer hover:bg-green-50/50 transition-colors group">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 bg-blue-100 text-blue-600">
                                                <AvatarFallback className="bg-blue-100 text-blue-600">{booking.userName?.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{booking.userName}</span>
                                                <span className="text-xs text-muted-foreground">ID: {booking.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{booking.hotelName}</span>
                                            <span className="text-xs text-muted-foreground">{booking.roomTitle}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                                            <span>
                                                {format(booking.fromDate as Date, "MMM d")} - {format(booking.toDate as Date, "MMM d, yyyy")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={booking.status === 'confirmed' ? "default" : "secondary"}
                                            className={
                                                booking.status === 'confirmed'
                                                    ? "bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none"
                                                    : booking.status === 'cancelled'
                                                        ? "bg-red-100 text-red-700 hover:bg-red-100 border-none shadow-none"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-100 border-none shadow-none"
                                            }
                                        >
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <span className="font-bold text-sm">
                                            {formatINR(booking.totalPrice)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <p className="text-lg font-medium">No bookings yet</p>
                                            <p className="text-sm">Reservations will appear here once made.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
