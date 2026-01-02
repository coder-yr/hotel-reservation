"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  updateHotelStatus,
  updateRoomStatus,
  fromFirestore,
} from "@/lib/data";
import type { Hotel, Room, Booking, User, Bus } from "@/lib/types";
import { Sidebar } from "./admin/sidebar";
import { TopBar } from "./admin/top-bar";
import { OverviewStats } from "./admin/overview-stats";
import { CampaignChart } from "./admin/campaign-chart";
import { GuestsWidget } from "./admin/guests-widget";
import { RevenueGauge } from "./admin/revenue-gauge";
import { GuestsView } from "./admin/views/guests-view";
import { BookingsView } from "./admin/views/bookings-view";
import { PropertyView } from "./admin/views/property-view";
import { BusView } from "./admin/views/bus-view"; // Import Property View
import {
  Loader2,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { DataTable } from "./admin/data-table";
import { columns as allBusesColumns } from "./admin/all-buses-columns";
import { AddBusForm } from "./add-bus-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingHotels, setPendingHotels] = useState<Hotel[]>([]);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBuses, setAllBuses] = useState<Bus[]>([]);
  const [pendingRooms, setPendingRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useAuth(); // Add useAuth here

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

  if (loading && allHotels.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <Sidebar
        className="hidden md:flex"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <>
              <h2 className="text-xl font-semibold">Good morning! {user?.name || 'Esther'} 👋</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <CampaignChart />
                  <GuestsWidget totalGuests={allUsers.length} />
                </div>
                <div className="space-y-6">
                  <OverviewStats
                    bookingsCount={bookings.length}
                    cancelledCount={bookings.filter(b => b.status === 'cancelled').length}
                    totalRevenue={totalRevenue}
                    checkInCount={143839} // Dummy data as placeholder
                  />
                  <RevenueGauge totalRevenue={totalRevenue} />
                </div>
              </div>
            </>
          )}

          {/* Guests / Users View */}
          {activeTab === 'guests' && (
            <GuestsView users={allUsers} />
          )}

          {/* Bus System View */}
          {activeTab === 'bus-system' && <BusView buses={allBuses} />}
          {/* Bookings View */}
          {activeTab === 'bookings' && (
            <BookingsView bookings={bookings} />
          )}

          {/* My Property (Hotels) View */}
          {activeTab === 'my-property' && (
            <PropertyView
              pendingHotels={pendingHotels}
              pendingRooms={pendingRooms}
              allHotels={allHotels}
              onHotelAction={handleHotelAction}
              onRoomAction={handleRoomAction}
              isPending={isPending}
            />
          )}

          {/* Add Bus Form */}
          {activeTab === 'add-bus' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Add Bus</h2>
              <AddBusForm />
            </div>
          )}

          {/* All Buses */}
          {activeTab === 'all-buses' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Bus Management</h2>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>All Buses</CardTitle>
                  <CardDescription>A complete list of all buses on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable columns={allBusesColumns} data={allBuses} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Placeholder Views for other tabs */}
          {['analytic', 'transaction', 'cashflow', 'message'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
              <Building className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground">Coming Soon</h3>
              <p>This module is currently under development.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
