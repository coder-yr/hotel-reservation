"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  updateHotelStatus,
  updateRoomStatus,
  fromFirestore,
} from "@/lib/data";
import type { Hotel, Room, Booking, User, Bus } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Loader2,
  Building,
  BedDouble,
  User as UserIcon,
  BookOpen,
  Calendar,
  Archive,
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  Bus as BusIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { RevenueChart } from "./dashboard/revenue-chart";
import { DistributionChart } from "./dashboard/distribution-chart";
import { format } from "date-fns";
import { db } from "@/lib/firebase";
import { formatINR } from '@/lib/utils';
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { DataTable } from "./admin/data-table";
import { columns as allHotelsColumns } from "./admin/all-hotels-columns";
import { columns as allUsersColumns } from "./admin/all-users-columns";
import { columns as allBusesColumns } from "./admin/all-buses-columns";
import { AddBusForm } from "./add-bus-form";

export function AdminDashboard() {
  const [pendingHotels, setPendingHotels] = useState<Hotel[]>([]);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBuses, setAllBuses] = useState<Bus[]>([]);
  const [pendingRooms, setPendingRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);

    const hotelsQuery = query(collection(db, 'hotels'));
    const roomsQuery = query(collection(db, 'rooms'), where('status', '==', 'pending'));
    const bookingsQuery = query(collection(db, 'bookings'));
    const usersQuery = query(collection(db, 'users'));
    const busesQuery = query(collection(db, 'buses'));

    const unsubscribeHotels = onSnapshot(hotelsQuery, (snapshot) => {
      const hotelsData = snapshot.docs.map(doc => fromFirestore<Hotel>(doc)).filter(Boolean) as Hotel[];
      setAllHotels(hotelsData);
      setPendingHotels(hotelsData.filter(h => h.status === 'pending'));
      setLoading(false);
    });

    const unsubscribeRooms = onSnapshot(roomsQuery, async (snapshot) => {
      const roomsData = snapshot.docs.map(doc => fromFirestore<Room>(doc)).filter(Boolean) as Room[];
      const enrichedRooms = await Promise.all(roomsData.map(async (room) => {
        const hotelDocRef = doc(db, 'hotels', room.hotelId);
        const hotelDoc = await getDoc(hotelDocRef);
        const hotelData = hotelDoc.exists() ? fromFirestore<Hotel>(hotelDoc) : undefined;
        return { ...room, hotelName: hotelData ? hotelData.name : 'Unknown Hotel' };
      }));
      setPendingRooms(enrichedRooms);
    });

    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
      setBookings(bookingsData);
    });

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => fromFirestore<User>(doc)).filter(Boolean) as User[];
      setAllUsers(usersData);
    });

    const unsubscribeBuses = onSnapshot(busesQuery, (snapshot) => {
      const busesData = snapshot.docs.map(doc => fromFirestore<Bus>(doc)).filter(Boolean) as Bus[];
      setAllBuses(busesData);
    });


    return () => {
      unsubscribeHotels();
      unsubscribeRooms();
      unsubscribeBookings();
      unsubscribeUsers();
      unsubscribeBuses();
    };
  }, []);


  const handleHotelAction = (hotelId: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      await updateHotelStatus(hotelId, action === 'approve' ? 'approved' : 'rejected');
      toast({
        title: `Hotel ${action}d`,
        description: `The hotel has been successfully ${action}d.`,
      });
    });
  };

  const handleRoomAction = (roomId: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      await updateRoomStatus(roomId, action === 'approve' ? 'approved' : 'rejected');
      toast({
        title: `Room ${action}d`,
        description: `The room has been successfully ${action}d.`,
      });
    });
  };

  // Calculate metrics
  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const pendingActionsCount = pendingHotels.length + pendingRooms.length;

  if (loading && allHotels.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of platform performance and pending tasks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-background">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            System Operational
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">+180 since last hour</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">+19 new users today</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingActionsCount}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Earnings over the last 7 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart totalRevenue={totalRevenue} />
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Vertical Distribution</CardTitle>
            <CardDescription>
              Bookings by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionChart
              hotelsCount={pendingHotels.length + allHotels.length + 5}
              flightsCount={12}
              busesCount={allBuses.length + 8}
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="hotels" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="hotels" className="rounded-lg px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <Building className="mr-2 h-4 w-4" />
            Pending Hotels
            {pendingHotels.length > 0 && <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">{pendingHotels.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="rooms" className="rounded-lg px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <BedDouble className="mr-2 h-4 w-4" />
            Pending Rooms
            {pendingRooms.length > 0 && <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">{pendingRooms.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="all-hotels" className="rounded-lg px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <Archive className="mr-2 h-4 w-4" />
            All Hotels
          </TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-lg px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="add-bus" className="rounded-lg px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <BusIcon className="mr-2 h-4 w-4" />
            Add Bus
          </TabsTrigger>
          <TabsTrigger value="all-buses" className="rounded-lg px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            <BusIcon className="mr-2 h-4 w-4" />
            All Buses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-bus" className="space-y-4">
          <AddBusForm />
        </TabsContent>

        <TabsContent value="all-buses" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>All Buses</CardTitle>
              <CardDescription>A complete list of all buses on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={allBusesColumns} data={allBuses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotels" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Hotel Approval Queue</CardTitle>
              <CardDescription>Review and approve or reject new hotel submissions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[350px] pl-6">Hotel</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingHotels.length > 0 ? pendingHotels.map((hotel) => (
                    <TableRow key={hotel.id} className="group">
                      <TableCell className="font-medium pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-24 overflow-hidden rounded-lg shadow-sm">
                            <Image src={hotel.coverImage} alt={hotel.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-base">{hotel.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{hotel.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{hotel.location}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 cursor-help">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  <UserIcon className="h-4 w-4" />
                                </div>
                                <span className="font-medium">{hotel.ownerName}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{hotel.ownerEmail}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-sm" disabled={isPending} onClick={() => handleHotelAction(hotel.id, 'approve')}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" disabled={isPending} onClick={() => handleHotelAction(hotel.id, 'reject')}>
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Check className="h-6 w-6" />
                          </div>
                          <p className="text-lg font-medium">All caught up!</p>
                          <p className="text-sm">No pending hotel approvals at the moment.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-hotels" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>All Hotels</CardTitle>
              <CardDescription>A complete list of all hotels on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={allHotelsColumns} data={allHotels} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Room Approval Queue</CardTitle>
              <CardDescription>Review and approve or reject new room submissions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[350px] pl-6">Room</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRooms.length > 0 ? pendingRooms.map((room) => (
                    <TableRow key={room.id} className="group">
                      <TableCell className="font-medium pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-24 overflow-hidden rounded-lg shadow-sm">
                            <Image src={room.images[0]} alt={room.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-base">{room.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{room.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{room.hotelName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {formatINR(room.price)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-sm" disabled={isPending} onClick={() => handleRoomAction(room.id, 'approve')}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" disabled={isPending} onClick={() => handleRoomAction(room.id, 'reject')}>
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <BedDouble className="h-6 w-6" />
                          </div>
                          <p className="text-lg font-medium">No pending rooms</p>
                          <p className="text-sm">All room submissions have been reviewed.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>All Platform Bookings</CardTitle>
              <CardDescription>A list of all reservations across all properties.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="pl-6">Guest</TableHead>
                    <TableHead>Hotel &amp; Room</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right pr-6">Total Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length > 0 ? bookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{booking.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">{booking.hotelName}</span>
                          <span className="text-xs text-muted-foreground">{booking.roomTitle}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(booking.fromDate as Date, "MMM d")} - {format(booking.toDate as Date, "MMM d, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge variant="outline" className="font-mono text-base border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          {formatINR(booking.totalPrice)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
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
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>A complete list of all users on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={allUsersColumns} data={allUsers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
