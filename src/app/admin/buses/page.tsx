"use client";
import { useState, useEffect, useMemo } from 'react';

import { Bus, Seat, BusPoint } from '@/lib/types';
import PointsEditor from '@/components/admin/points-editor';
import SeatLayoutEditor from '@/components/admin/seat-layout-editor';


type BusBooking = {
  id: string;
  passengerInfo?: { name?: string };
  seats: string[] | string;
};
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import AdminBusDashboard from './AdminBusDashboard';
export default function AdminBusesPage() {
  return <AdminBusDashboard />;
}
