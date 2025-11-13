"use client";
import React, { useEffect, useState } from "react";
import { Bus } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Bus as BusIcon,
  ChevronLeft,
  Clock,
  MapPin,
  Users,
  Zap,
  CreditCard,
  Armchair,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import PointsEditor from "@/components/admin/points-editor";
import SeatLayoutEditor from "@/components/admin/seat-layout-editor";
import { Button } from "@/components/ui/button";

type BusBooking = {
  id: string;
  passengerInfo?: { name?: string };
  seats: string[] | string;
  status?: string;
  createdAt?: any;
};

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
}

function formatDate(date: any) {
  if (!date) return "";
  try {
    if (date?.seconds)
      return new Date(date.seconds * 1000).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(date);
  }
}

export default function AdminBusDashboard() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BusBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    operator: string;
    depart: string;
    arrive: string;
    duration: string;
    price: string;
    amenities: string;
    boardingPoints: any[];
    droppingPoints: any[];
  }>({
    operator: "",
    depart: "",
    arrive: "",
    duration: "",
    price: "",
    amenities: "",
    boardingPoints: [],
    droppingPoints: [],
  });
  const [seatEdit, setSeatEdit] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBuses() {
      const snapshot = await getDocs(collection(db, "buses"));
      setBuses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Bus)));
      setLoading(false);
    }
    fetchBuses();
  }, []);

  useEffect(() => {
    if (!selectedBusId) return;
    async function fetchBookings() {
      const bookingsQuery = query(
        collection(db, "bus_bookings"),
        where("busId", "==", selectedBusId)
      );
      const snapshot = await getDocs(bookingsQuery);
      setBookings(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BusBooking))
      );
    }
    fetchBookings();
  }, [selectedBusId]);

  const selectedBus = buses.find((b) => b.id === selectedBusId);
  const isEditing = editId !== null;

  async function handleSubmit() {
    if (!form.operator || !form.depart || !form.arrive || !form.duration || !form.price) return;
    if (isEditing) {
      await fetch(`/api/buses/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, seats: seatEdit }),
      });
      setBuses((prev) => prev.map((b) => (b.id === editId ? ({ ...b, ...form, seats: seatEdit } as any) : b)));
    } else {
      const res = await fetch("/api/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, seats: seatEdit }),
      });
      const data = await res.json();
      setBuses((prev) => [...prev, { id: data.id, ...form, seats: seatEdit } as any]);
    }
    setForm({
      operator: "",
      depart: "",
      arrive: "",
      duration: "",
      price: "",
      amenities: "",
      boardingPoints: [],
      droppingPoints: [],
    });
    setSeatEdit([]);
    setEditId(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <BusIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">Admin Bus Dashboard</h1>
          </div>
          <p className="text-slate-600 ml-16">Manage bus schedules and monitor bookings</p>
        </div>

        {!selectedBus && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Bus" : "Add New Bus"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input className="border rounded px-3 py-2" placeholder="Operator" value={form.operator} onChange={(e) => setForm((f) => ({ ...f, operator: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Depart" value={form.depart} onChange={(e) => setForm((f) => ({ ...f, depart: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Arrive" value={form.arrive} onChange={(e) => setForm((f) => ({ ...f, arrive: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Duration" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Amenities (CSV)" value={form.amenities} onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <PointsEditor title="Boarding" points={form.boardingPoints} onChange={(pts) => setForm((f) => ({ ...f, boardingPoints: pts }))} />
              <PointsEditor title="Dropping" points={form.droppingPoints} onChange={(pts) => setForm((f) => ({ ...f, droppingPoints: pts }))} />
            </div>
            <div className="mb-4">
              <SeatLayoutEditor seats={seatEdit} onChange={setSeatEdit} onReset={() => setSeatEdit([])} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>{isEditing ? "Update Bus" : "Add Bus"}</Button>
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditId(null);
                    setForm({
                      operator: "",
                      depart: "",
                      arrive: "",
                      duration: "",
                      price: "",
                      amenities: "",
                      boardingPoints: [],
                      droppingPoints: [],
                    });
                    setSeatEdit([]);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        {selectedBus ? (
          <div>
            <button
              onClick={() => setSelectedBusId(null)}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Buses</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-slate-200">
              <div className="relative h-64">
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <BusIcon className="w-24 h-24 text-slate-400" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full font-bold text-lg">{selectedBus.id}</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{`${selectedBus.depart} → ${selectedBus.arrive}`}</h2>
                  <p className="text-lg text-white/90">{selectedBus.operator}</p>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Departure</p>
                      <p className="text-xl font-bold text-slate-800">{selectedBus.depart}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Arrival</p>
                      <p className="text-xl font-bold text-slate-800">{selectedBus.arrive}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Armchair className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Seats</p>
                      <p className="text-xl font-bold text-slate-800">{selectedBus.seats?.length ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Booking Details</h3>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                  {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
                </span>
              </div>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <CreditCard className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg">No bookings yet for this bus</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-4 px-4 font-semibold text-slate-700">Booking ID</th>
                        <th className="text-left py-4 px-4 font-semibold text-slate-700">Seats</th>
                        <th className="text-left py-4 px-4 font-semibold text-slate-700">Passenger Name</th>
                        <th className="text-left py-4 px-4 font-semibold text-slate-700">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-slate-700">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-slate-400" />
                              <span className="font-mono font-semibold text-slate-800">{booking.id}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Armchair className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-700">{Array.isArray(booking.seats) ? booking.seats.join(", ") : booking.seats}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-800">{booking.passengerInfo?.name || "-"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(booking.status ?? "")}`}>
                              {getStatusIcon(booking.status ?? "")}
                              <span className="capitalize">{booking.status ?? "-"}</span>
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600 text-sm">{formatDate(booking.createdAt)}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-slate-200">
              <p className="text-slate-600 text-sm">
                <span className="font-semibold text-slate-800">{buses.length} buses</span> scheduled for today
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-slate-200"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <BusIcon className="w-16 h-16 text-slate-400" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-slate-800">{bus.id}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white">
                        <MapPin className="w-5 h-5" />
                        <span className="font-semibold text-lg">{`${bus.depart} → ${bus.arrive}`}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <p className="text-slate-600 text-sm mb-1">Operated by</p>
                      <p className="font-semibold text-slate-800 text-lg">{bus.operator}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Departure</p>
                          <p className="font-bold text-slate-800">{bus.depart}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Arrival</p>
                          <p className="font-bold text-slate-800">{bus.arrive}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Total Seats</p>
                        <p className="font-bold text-slate-800">{bus.seats?.length ?? 0} seats</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Amenities</p>
                          <p className="text-sm text-slate-700 line-clamp-2">{Array.isArray(bus.amenities) ? bus.amenities.join(", ") : ""}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200" onClick={() => setSelectedBusId(bus.id)}>
                        View Bookings
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditId(bus.id);
                          setForm({
                            operator: (bus as any).operator || "",
                            depart: (bus as any).depart || "",
                            arrive: (bus as any).arrive || "",
                            duration: (bus as any).duration || "",
                            price: (bus as any).price || "",
                            amenities: Array.isArray((bus as any).amenities)
                              ? ((bus as any).amenities as string[]).join(", ")
                              : ((bus as any).amenities || ""),
                            boardingPoints: (bus as any).boardingPoints || [],
                            droppingPoints: (bus as any).droppingPoints || [],
                          });
                          setSeatEdit(((bus as any).seats as any[]) || []);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await fetch(`/api/buses/${bus.id}`, { method: "DELETE" });
                          setBuses((prev) => prev.filter((b) => b.id !== bus.id));
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
