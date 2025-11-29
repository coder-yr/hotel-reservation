import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

// Hardcoding keys to bypass environment variable loading issues
const AMADEUS_CLIENT_ID = 'Pl93HxXR9IGzDO54YJGFXCKG7tBAxjFQ';
const AMADEUS_CLIENT_SECRET = 'Bjq6JfzepcrPKRck';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');

    const amadeus = new Amadeus({
        clientId: AMADEUS_CLIENT_ID,
        clientSecret: AMADEUS_CLIENT_SECRET,
    });

    if (!origin || !destination || !date) {
        return NextResponse.json(
            { error: 'Missing required parameters: origin, destination, date' },
            { status: 400 }
        );
    }

    try {
        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: date,
            adults: '1',
            max: '10',
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Amadeus API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch flight data', details: error.description },
            { status: 500 }
        );
    }
}
