export interface Flight {
    id: string;
    airline: string;
    flightNumber: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    stops: number;
}

const MOCK_FLIGHTS: Flight[] = [
    {
        id: 'fl_001',
        airline: 'Indigo',
        flightNumber: '6E-2034',
        from: 'DEL',
        to: 'BLR',
        departureTime: '06:00',
        arrivalTime: '08:45',
        duration: '2h 45m',
        price: 5400,
        stops: 0
    },
    {
        id: 'fl_002',
        airline: 'Air India',
        flightNumber: 'AI-505',
        from: 'DEL',
        to: 'BLR',
        departureTime: '10:15',
        arrivalTime: '13:00',
        duration: '2h 45m',
        price: 6100,
        stops: 0
    },
    {
        id: 'fl_003',
        airline: 'Vistara',
        flightNumber: 'UK-811',
        from: 'DEL',
        to: 'BLR',
        departureTime: '16:30',
        arrivalTime: '19:10',
        duration: '2h 40m',
        price: 7200,
        stops: 0
    },
    {
        id: 'fl_004',
        airline: 'Indigo',
        flightNumber: '6E-554',
        from: 'BOM',
        to: 'GOI',
        departureTime: '14:00',
        arrivalTime: '15:15',
        duration: '1h 15m',
        price: 3200,
        stops: 0
    },
    {
        id: 'fl_005',
        airline: 'Akasa Air',
        flightNumber: 'QP-1123',
        from: 'BOM',
        to: 'GOI',
        departureTime: '09:00',
        arrivalTime: '10:10',
        duration: '1h 10m',
        price: 2900,
        stops: 0
    },
    {
        id: 'fl_006',
        airline: 'SpiceJet',
        flightNumber: 'SG-818',
        from: 'DEL',
        to: 'DXB',
        departureTime: '20:00',
        arrivalTime: '23:30',
        duration: '4h 00m',
        price: 12500,
        stops: 0
    }
];

export async function searchFlights(from: string, to: string, date?: string): Promise<Flight[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Normalize search
    const searchFrom = from.toLowerCase().substring(0, 3);
    const searchTo = to.toLowerCase().substring(0, 3);

    // If inputs are empty, return all (demo mode)
    if (!from && !to) return MOCK_FLIGHTS;

    return MOCK_FLIGHTS.filter(flight => {
        const matchFrom = !from || flight.from.toLowerCase().includes(searchFrom) || from.toLowerCase().includes(flight.from.toLowerCase());
        const matchTo = !to || flight.to.toLowerCase().includes(searchTo) || to.toLowerCase().includes(flight.to.toLowerCase());
        return matchFrom && matchTo;
    });
}
