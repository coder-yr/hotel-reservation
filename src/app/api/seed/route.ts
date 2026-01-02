import { NextResponse } from 'next/server';
import { seedDatabase, getApprovedHotels } from '@/lib/firebase';

export async function GET() {
    try {
        await seedDatabase();
        const hotels = await getApprovedHotels();
        const hotelNames = hotels.map(h => h.name);
        return NextResponse.json({
            message: 'Seeding attempt finished.',
            total_hotels: hotels.length,
            hotel_names: hotelNames
        }, { status: 200 });
    } catch (error) {
        console.error('Seeding failed:', error);
        return NextResponse.json({ error: 'Seeding failed', details: String(error) }, { status: 500 });
    }
}
