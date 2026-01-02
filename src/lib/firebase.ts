// --- Sample Bus Data ---
const sampleSeats = [
    { id: 'L1', price: 449, status: 'available', deck: 'lower', row: 1, col: 1 },
    { id: 'L2', price: 0, status: 'sold', deck: 'lower', row: 2, col: 1 },
    { id: 'L3', price: 0, status: 'sold', deck: 'lower', row: 3, col: 1 },
    { id: 'L4', price: 0, status: 'sold', deck: 'lower', row: 4, col: 1 },
    { id: 'L5', price: 820, status: 'available', deck: 'lower', row: 5, col: 1 },
    { id: 'L6', price: 0, status: 'sold', deck: 'lower', row: 1, col: 2 },
    { id: 'L7', price: 0, status: 'sold', deck: 'lower', row: 2, col: 2 },
    { id: 'L8', price: 799, status: 'available', deck: 'lower', row: 3, col: 2 },
    { id: 'L9', price: 799, status: 'available', deck: 'lower', row: 4, col: 2 },
    { id: 'L10', price: 799, status: 'available', deck: 'lower', row: 5, col: 2 },
    { id: 'U1', price: 729, status: 'available', deck: 'upper', row: 1, col: 1 },
    { id: 'U2', price: 729, status: 'available', deck: 'upper', row: 1, col: 2 },
    { id: 'U3', price: 0, status: 'sold', deck: 'upper', row: 2, col: 1 },
    { id: 'U4', price: 0, status: 'sold', deck: 'upper', row: 2, col: 2 },
    { id: 'U5', price: 0, status: 'sold', deck: 'upper', row: 3, col: 1 },
    { id: 'U6', price: 0, status: 'sold', deck: 'upper', row: 3, col: 2 },
    { id: 'U7', price: 689, status: 'available', deck: 'upper', row: 4, col: 1 },
    { id: 'U8', price: 0, status: 'sold', deck: 'upper', row: 5, col: 1 },
    { id: 'U9', price: 0, status: 'sold', deck: 'upper', row: 5, col: 2 },
    { id: 'U10', price: 1029, status: 'available', deck: 'upper', row: 6, col: 1 },
    { id: 'U11', price: 729, status: 'available', deck: 'upper', row: 7, col: 1 },
    { id: 'U12', price: 729, status: 'available', deck: 'upper', row: 7, col: 2 },
    { id: 'U13', price: 779, status: 'available', deck: 'upper', row: 8, col: 1 },
    { id: 'U14', price: 0, status: 'sold', deck: 'upper', row: 9, col: 1 },
    { id: 'U15', price: 0, status: 'sold', deck: 'upper', row: 9, col: 2 },
];

const sampleBusesData = [
    {
        operator: 'Sunil Tour and Travels',
        depart: '21:30 Navi Mumbai',
        arrive: '07:00 Basti',
        duration: '09h 30m',
        price: '₹ 2,210',
        seats: sampleSeats,
        location: 'Navi Mumbai',
    },
    {
        operator: 'Betrawati Travels',
        depart: '21:25 Mumbai',
        arrive: '08:30 Basti',
        duration: '11h 05m',
        price: '₹ 3,199',
        seats: sampleSeats,
        location: 'Mumbai',
    },
    {
        operator: 'Hans Travels',
        depart: '21:30 Mumbai',
        arrive: '12:10 Basti',
        duration: '14h 40m',
        price: '₹ 3,100',
        seats: sampleSeats,
        location: 'Mumbai',
    },
];

const sampleFlightsData = [
    {
        airline: 'IndiGo',
        depart: '06:00 DEL',
        arrive: '08:00 BOM',
        duration: '2h 00m',
        price: '₹ 4,500',
        stops: 'Non-stop',
    },
    {
        airline: 'Air India',
        depart: '10:00 DEL',
        arrive: '12:15 BOM',
        duration: '2h 15m',
        price: '₹ 5,200',
        stops: 'Non-stop',
    },
    {
        airline: 'Vistara',
        depart: '14:00 DEL',
        arrive: '16:10 BOM',
        duration: '2h 10m',
        price: '₹ 6,000',
        stops: 'Non-stop',
    },
    {
        airline: 'SpiceJet',
        depart: '18:00 DEL',
        arrive: '20:05 BOM',
        duration: '2h 05m',
        price: '₹ 4,200',
        stops: 'Non-stop',
    },
    {
        airline: 'IndiGo',
        depart: '07:00 BOM',
        arrive: '09:00 DEL',
        duration: '2h 00m',
        price: '₹ 4,600',
        stops: 'Non-stop',
    },
];

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs, addDoc, serverTimestamp, writeBatch, doc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { NewHotel, NewUser, NewRoom, NewReview, Hotel } from './types';


export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// --- Sample Data ---
const sampleUsersData: NewUser[] = [
    { name: 'Alice Owner', email: 'alice@example.com', password: 'password', role: 'owner' },
    { name: 'Bob Guest', email: 'bob@example.com', password: 'password', role: 'user' },
    { name: 'Admin User', email: 'admin@lodgify.lite', password: 'adminpassword', role: 'admin' },
    { name: 'Charlie Owner', email: 'charlie@example.com', password: 'password', role: 'owner' },
];

const sampleHotelsData: Omit<NewHotel, 'ownerId' | 'ownerName' | 'ownerEmail' | 'createdAt'>[] = [
    {
        name: 'The Grand Palace',
        location: 'Istanbul, Turkey',
        description: 'Experience unparalleled luxury and breathtaking views of the Bosphorus in our five-star hotel, where elegance meets comfort.',
        address: "1 Bosphorus St, Istanbul, Turkey",
        phone: "555-123-4567",
        email: "contact@grandpalace.com",
        website: "https://grandpalace.com",
        facilities: ["wifi", "pool", "spa"],
        checkInTime: "15:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Full refund for cancellations made 48 hours in advance.",
        isPetFriendly: true,
        documents: [],
        // status: 'approved',
        coverImage: 'https://cf.bstatic.com/static/img/theme-index/bg_luxury/869918c9da63b2c5685fce05965700da5b0e6617.jpg',
        category: 'Premium',
        'data-ai-hint': 'luxury hotel interior'
    },
    {
        name: 'Santorini Seaside Escape',
        location: 'Oia, Greece',
        description: 'Nestled on the cliffs of Oia, our hotel offers stunning sunsets and direct access to the azure waters of the Aegean Sea.',
        address: "1 Cliffside Rd, Oia, Greece",
        phone: "555-987-6543",
        email: "reservations@santoriniescape.com",
        website: "https://santoriniescape.com",
        facilities: ["wifi", "pool"],
        checkInTime: "14:00",
        checkOutTime: "11:00",
        cancellationPolicy: "Full refund for cancellations made 7 days in advance.",
        isPetFriendly: false,
        documents: [],
        // status: 'approved',
        coverImage: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/678234743.jpg?k=acee705a06f3347cd2f3d53609a536b772a99eda3603c4eb5ef136e5e6cd6204&o=',
        category: 'Boutique',
        'data-ai-hint': 'santorini hotel'
    },
    {
        name: 'Modern City Hub',
        location: 'Ankara, Turkey',
        description: 'A stylish and contemporary hotel in the heart of the city, perfect for business travelers and urban explorers.',
        address: "123 Capital Ave, Ankara, Turkey",
        phone: "555-234-5678",
        email: "info@modernhub.com",
        website: "https://modernhub.com",
        facilities: ["wifi", "gym", "restaurant"],
        checkInTime: "15:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Flexible cancellation up to 24 hours before check-in.",
        isPetFriendly: false,
        documents: [],
        // status: 'approved',
        coverImage: 'https://lux-life.digital/wp-content/uploads/2019/09/turkish-hotel.jpg',
        category: 'Boutique',
        'data-ai-hint': 'modern hotel room'
    },
    {
        name: 'Cozy Mountain Lodge',
        location: 'Aspen, USA',
        description: 'A rustic lodge offering a cozy retreat after a day on the slopes.',
        address: "456 Ski Run, Aspen, USA",
        phone: "555-345-6789",
        email: "stay@cozylodge.com",
        website: "https://cozylodge.com",
        facilities: ["wifi", "parking", "restaurant"],
        checkInTime: "16:00",
        checkOutTime: "10:00",
        cancellationPolicy: "Cancellation policy requires 14 days notice for a full refund.",
        isPetFriendly: true,
        documents: [],
        // status: 'pending',
        coverImage: 'https://images.pexels.com/photos/208333/pexels-photo-208333.jpeg',
        category: 'Boutique',
        'data-ai-hint': 'ski lodge'
    },
    // New Trending Destinations
    {
        name: 'Goa Beach Resort',
        location: 'Goa, India',
        description: 'Experience the vibrant spirit of Goa with direct beach access and sunset parties.',
        address: "Calangute Beach Rd, Goa, India",
        phone: "555-GOA-1234",
        email: "bookings@goabeachresort.com",
        facilities: ["wifi", "pool", "restaurant", "bar", "beach access"],
        checkInTime: "14:00",
        checkOutTime: "11:00",
        cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
        isPetFriendly: false,
        documents: [],
        coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=60',
        category: 'Resort',
        'data-ai-hint': 'beach resort goa'
    },
    {
        name: 'Mumbai Skyline Hotel',
        location: 'Mumbai, India',
        description: 'Luxury living in the heart of Mumbai, overlooking the Marine Drive.',
        address: "Marine Drive, Mumbai, India",
        phone: "555-BOM-5678",
        email: "reservations@mumbaiskyline.com",
        facilities: ["wifi", "gym", "spa", "rooftop bar"],
        checkInTime: "14:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Non-refundable booking.",
        isPetFriendly: false,
        documents: [],
        coverImage: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&auto=format&fit=crop&q=60',
        category: 'Premium',
        'data-ai-hint': 'luxury hotel mumbai'
    },
    {
        name: 'Jaipur Royal Palace',
        location: 'Jaipur, India',
        description: 'Stay like royalty in this heritage palace hotel showcasing Rajasthani architecture.',
        address: "Amber Fort Rd, Jaipur, India",
        phone: "555-JAI-9012",
        email: "heritage@jaipurroyal.com",
        facilities: ["wifi", "pool", "restaurant", "cultural shows"],
        checkInTime: "12:00",
        checkOutTime: "10:00",
        cancellationPolicy: "Dynamic cancellation policy.",
        isPetFriendly: true,
        documents: [],
        coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=60',
        category: 'Historic',
        'data-ai-hint': 'palace hotel jaipur'
    },
    // More Trending Destinations
    {
        name: 'The Leela Palace',
        location: 'New Delhi, India',
        description: 'An architectural marvel offering royal Indian luxury in the capital city.',
        address: "Diplomatic Enclave, Chanakyapuri, New Delhi",
        phone: "555-DEL-1234",
        email: "reservations@leelapalace.com",
        facilities: ["wifi", "pool", "spa", "fine dining"],
        checkInTime: "14:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Free cancellation up to 24 hours before check-in.",
        isPetFriendly: false,
        documents: [],
        coverImage: 'https://images.unsplash.com/photo-1590447158019-866d6d3131ca?w=800&auto=format&fit=crop&q=60',
        category: 'Premium',
        'data-ai-hint': 'luxury hotel delhi'
    },
    {
        name: 'Baga Beach Cottages',
        location: 'Goa, India',
        description: 'Charming wooden cottages right on the sands of Baga Beach.',
        address: "Baga Beach, North Goa, India",
        phone: "555-GOA-5678",
        email: "stay@bagacottages.com",
        facilities: ["wifi", "beach access", "bar"],
        checkInTime: "13:00",
        checkOutTime: "11:00",
        cancellationPolicy: "Non-refundable during peak season.",
        isPetFriendly: true,
        documents: [],
        coverImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop&q=60',
        category: 'Cabin',
        'data-ai-hint': 'beach cottage goa'
    },
    {
        name: 'Mumbai Ocean Front',
        location: 'Mumbai, India',
        description: 'Stay close to the action with stunning sea link views.',
        address: "Bandra West, Mumbai, India",
        phone: "555-BOM-9012",
        email: "info@mumbaiocean.com",
        facilities: ["wifi", "gym", "rooftop cafe"],
        checkInTime: "14:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Flexible cancellation.",
        isPetFriendly: true,
        documents: [],
        coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=60',
        category: 'Boutique',
        'data-ai-hint': 'sea view hotel mumbai'
    },
    {
        name: 'Pink City Heritage',
        location: 'Jaipur, India',
        description: 'A converted havelli in the heart of the walled city.',
        address: "Johari Bazar, Jaipur, India",
        phone: "555-JAI-3456",
        email: "stay@pinkcityheritage.com",
        facilities: ["wifi", "restaurant", "courtyard"],
        checkInTime: "12:00",
        checkOutTime: "10:00",
        cancellationPolicy: "Free cancellation up to 48 hours.",
        isPetFriendly: false,
        documents: [],
        coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=60',
        category: 'Historic',
        'data-ai-hint': 'heritage havelli jaipur'
    },
    {
        name: 'Himalayan Heights',
        location: 'Manali, India',
        description: 'Perched high in the mountains, offering panoramic snow views.',
        address: "Solang Valley, Manali, India",
        phone: "555-HIM-7890",
        email: "bookings@himalayanheights.com",
        facilities: ["wifi", "heating", "bonfire"],
        checkInTime: "12:00",
        checkOutTime: "11:00",
        cancellationPolicy: "Free cancellation within 24 hours.",
        isPetFriendly: true,
        documents: [],
        coverImage: 'https://images.unsplash.com/photo-1519985176271-adb10462dcd1?w=800&auto=format&fit=crop&q=60',
        category: 'Ski Resort',
        'data-ai-hint': 'mountain resort manali'
    }
];

const sampleRoomsData: Omit<NewRoom, 'hotelId' | 'createdAt' | 'status'>[] = [
    // For The Grand Palace
    {
        title: 'Presidential Suite',
        description: 'A suite fit for royalty with panoramic city views and a private terrace.',
        price: 950,
        capacity: 4,
        images: ['https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'],
    },
    {
        title: 'Deluxe King Room',
        description: 'A spacious room with a king-sized bed and elegant furnishings.',
        price: 450,
        capacity: 2,
        images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg'],
    },
    // For Santorini Seaside Escape
    {
        title: 'Caldera View Suite',
        description: 'Wake up to the iconic view of the Santorini caldera from your private balcony.',
        price: 650,
        capacity: 2,
        images: ['https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg', 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg'],
    },
    {
        title: 'Infinity Pool Villa',
        description: 'A luxurious villa with a private infinity pool overlooking the Aegean Sea.',
        price: 1200,
        capacity: 4,
        images: ['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'],
    },
    // For Modern City Hub
    {
        title: 'Executive Business Room',
        description: 'Modern comforts and a dedicated workspace for the discerning traveler.',
        price: 250,
        capacity: 2,
        images: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg', 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg'],
    },
    {
        title: 'City View Twin Room',
        description: 'A comfortable room with two single beds and a stunning view of the city skyline.',
        price: 220,
        capacity: 2,
        images: ['https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg', 'https://images.pexels.com/photos/6782476/pexels-photo-6782476.jpeg'],
    },
    // For Goa Beach Resort
    {
        title: 'Ocean View Cottage',
        description: 'Steps away from the beach, listen to the waves from your private cottage.',
        price: 3500,
        capacity: 2,
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60'],
    },
    {
        title: 'Poolside Villa',
        description: 'Luxury villa with direct pool access.',
        price: 5500,
        capacity: 4,
        images: ['https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&auto=format&fit=crop&q=60'],
    },
    // For Mumbai Skyline Hotel
    {
        title: 'Luxury Sea Face',
        description: 'Panoramic views of the Arabian sea.',
        price: 8500,
        capacity: 2,
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60'],
    },
    // For Jaipur Royal Palace
    {
        title: 'Maharaja Suite',
        description: 'Opulent decor inspired by royal heritage.',
        price: 12000,
        capacity: 2,
        images: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop&q=60'],
    },
    // For Manali Pine Retreat
    {
        title: 'Snow View Cabin',
        description: 'Cozy wood-paneled cabin with mountain views.',
        price: 4000,
        capacity: 3,
        images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop&q=60'],
    },
    // New Delhi
    {
        title: 'Royal Club Room',
        description: 'Luxury room with club lounge access.',
        price: 15000,
        capacity: 2,
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=60'],
    },
    // Goa Baga
    {
        title: 'Beachside Hut',
        description: 'Rustic hut with modern amenities.',
        price: 3000,
        capacity: 2,
        images: ['https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?w=800&auto=format&fit=crop&q=60'],
    },
    // Mumbai Ocean
    {
        title: 'Sea View Suite',
        description: 'Wake up to the sound of the ocean.',
        price: 7000,
        capacity: 2,
        images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=60'],
    },
    // Jaipur Heritage
    {
        title: 'Heritage Room',
        description: 'Traditional decor with antique furniture.',
        price: 5000,
        capacity: 2,
        images: ['https://images.unsplash.com/photo-1590059390492-d5495eb8305f?w=800&auto=format&fit=crop&q=60'],
    },
    // Manali Heights
    {
        title: 'Mountain View Suite',
        description: 'Panoramic views of snow peaks.',
        price: 6000,
        capacity: 3,
        images: ['https://images.unsplash.com/photo-1542718610-a1d656d77143?w=800&auto=format&fit=crop&q=60'],
    }
];

const sampleReviewsData = [
    // Reviews for The Grand Palace
    {
        rating: 5,
        comment: "Absolutely stunning hotel with breathtaking views. The service was impeccable from start to finish. A truly luxurious experience.",
    },
    {
        rating: 4,
        comment: "Great location and beautiful facilities. The pool area is fantastic. The room was spacious and clean, though the restaurant was a bit pricey.",
    },
    // Reviews for Santorini Seaside Escape
    {
        rating: 5,
        comment: "The view from our suite was unbelievable. Waking up to the caldera every morning was magical. The staff were friendly and accommodating. Highly recommend!",
    },
    {
        rating: 5,
        comment: "Perfect honeymoon destination. The privacy of the infinity pool villa is unmatched. It's expensive, but worth every penny for a special occasion.",
    },
    // Reviews for Modern City Hub
    {
        rating: 4,
        comment: "Very clean, modern, and conveniently located for business meetings. The gym is well-equipped. It's not a 'resort' but it's perfect for a city trip.",
    },
];


// --- Seeding Functions ---
const seedCollection = async <T extends Record<string, any>>(
    collectionName: string,
    data: T[],
    uniqueField: keyof T & string
) => {
    const collectionRef = collection(db, collectionName);
    console.log(`Checking if ${collectionName} collection needs seeding...`);

    const existingDocsSnapshot = await getDocs(query(collectionRef));
    const existingData = new Set(existingDocsSnapshot.docs.map(doc => doc.data()[uniqueField]));

    const newData = data.filter(item => !item[uniqueField] || !existingData.has(item[uniqueField]));

    if (newData.length === 0) {
        console.log(`${collectionName} collection is already up to date. Seeding skipped.`);
        return [];
    }

    console.log(`Seeding ${newData.length} new documents into ${collectionName}...`);
    const batch = writeBatch(db);
    const newDocIds: string[] = [];

    for (const item of newData) {
        const newDocRef = doc(collectionRef);
        batch.set(newDocRef, { ...item, createdAt: serverTimestamp() });
        newDocIds.push(newDocRef.id);
    }

    await batch.commit();
    console.log(`${newData.length} documents seeded into ${collectionName}.`);
    return newDocIds;
};

const seedSubcollection = async (
    parentCollection: string,
    parentId: string,
    subcollectionName: string,
    data: any[]
) => {
    const subcollectionRef = collection(db, parentCollection, parentId, subcollectionName);
    console.log(`Checking if ${subcollectionName} for ${parentId} needs seeding...`);

    const existingDocsSnapshot = await getDocs(query(subcollectionRef));
    if (existingDocsSnapshot.size > 0) {
        console.log(`Subcollection ${subcollectionName} for ${parentId} already has data. Seeding skipped.`);
        return;
    }

    console.log(`Seeding ${data.length} documents into ${subcollectionName} for ${parentId}...`);
    const batch = writeBatch(db);
    for (const item of data) {
        const newDocRef = doc(subcollectionRef);
        batch.set(newDocRef, { ...item, createdAt: serverTimestamp() });
    }
    await batch.commit();
    console.log(`Seeded ${subcollectionName} for ${parentId}.`);
}


const seedDatabase = async () => {
    try {
        await seedCollection<NewUser>('users', sampleUsersData, 'email');
        // Seed Buses
        await seedCollection('buses', sampleBusesData, 'operator');
        // Seed Flights
        await seedCollection('flights', sampleFlightsData, 'airline');

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => ({ ...doc.data() as NewUser, id: doc.id }));
        const aliceOwner = users.find(u => u.email === 'alice@example.com');
        const charlieOwner = users.find(u => u.email === 'charlie@example.com');
        const bobGuest = users.find(u => u.email === 'bob@example.com');

        const hotelsToSeed: (Omit<NewHotel, 'createdAt'>)[] = [];
        if (aliceOwner) {
            sampleHotelsData.slice(0, 3).forEach(hotel => {
                hotelsToSeed.push({
                    ...hotel,
                    ownerId: aliceOwner.id,
                    ownerName: aliceOwner.name,
                    ownerEmail: aliceOwner.email
                });
            });
        }
        if (charlieOwner) {
            // Seed existing samples
            sampleHotelsData.slice(3, 4).forEach(hotel => {
                hotelsToSeed.push({
                    ...hotel,
                    ownerId: charlieOwner.id,
                    ownerName: charlieOwner.name,
                    ownerEmail: charlieOwner.email
                });
            });
            // Seed new trending hotels to Charlie as well
            sampleHotelsData.slice(4).forEach(hotel => {
                hotelsToSeed.push({
                    ...hotel,
                    ownerId: charlieOwner.id,
                    ownerName: charlieOwner.name,
                    ownerEmail: charlieOwner.email
                });
            });
        }

        if (hotelsToSeed.length > 0) {
            await seedCollection('hotels', hotelsToSeed, 'name');
        }

        // --- FORCE UPDATE STATUS for all sample hotels ---
        // This ensures that even if they existed before (as pending), they get approved now.
        const namesToApprove = sampleHotelsData.map(h => h.name);
        if (namesToApprove.length > 0) {
            console.log("Ensuring all sample hotels are approved...");
            const hotelsToUpdateQuery = query(collection(db, 'hotels'), where('name', 'in', namesToApprove));
            const hotelsToUpdateSnapshot = await getDocs(hotelsToUpdateQuery);
            const updateBatch = writeBatch(db);
            hotelsToUpdateSnapshot.docs.forEach(doc => {
                updateBatch.update(doc.ref, { status: 'approved' });
            });
            await updateBatch.commit();
            console.log(`Updated status to 'approved' for ${hotelsToUpdateSnapshot.size} hotels.`);
        }

        const allHotelsSnapshot = await getDocs(collection(db, 'hotels'));
        const allHotels = allHotelsSnapshot.docs.map(doc => ({ ...doc.data() as NewHotel, id: doc.id }));

        const grandPalace = allHotels.find(h => h.name === 'The Grand Palace');
        const santoriniEscape = allHotels.find(h => h.name === 'Santorini Seaside Escape');
        const modernHub = allHotels.find(h => h.name === 'Modern City Hub');

        const roomsToSeed = [];
        if (grandPalace) {
            roomsToSeed.push({ ...sampleRoomsData[0], hotelId: grandPalace.id, status: 'approved' });
            roomsToSeed.push({ ...sampleRoomsData[1], hotelId: grandPalace.id, status: 'approved' });
        }
        if (santoriniEscape) {
            roomsToSeed.push({ ...sampleRoomsData[2], hotelId: santoriniEscape.id, status: 'approved' });
            roomsToSeed.push({ ...sampleRoomsData[3], hotelId: santoriniEscape.id, status: 'approved' });
        }
        if (modernHub) {
            roomsToSeed.push({ ...sampleRoomsData[4], hotelId: modernHub.id, status: 'approved' });
            roomsToSeed.push({ ...sampleRoomsData[5], hotelId: modernHub.id, status: 'approved' });
        }

        // Seed rooms for new hotels
        const goaResort = allHotels.find(h => h.name === 'Goa Beach Resort');
        const mumbaiHotel = allHotels.find(h => h.name === 'Mumbai Skyline Hotel');
        const jaipurPalace = allHotels.find(h => h.name === 'Jaipur Royal Palace');
        const manaliRetreat = allHotels.find(h => h.name === 'Manali Pine Retreat');

        if (goaResort) {
            roomsToSeed.push({ ...sampleRoomsData[6], hotelId: goaResort.id, status: 'approved' });
            roomsToSeed.push({ ...sampleRoomsData[7], hotelId: goaResort.id, status: 'approved' });
        }
        if (mumbaiHotel) {
            roomsToSeed.push({ ...sampleRoomsData[8], hotelId: mumbaiHotel.id, status: 'approved' });
        }
        if (jaipurPalace) {
            roomsToSeed.push({ ...sampleRoomsData[9], hotelId: jaipurPalace.id, status: 'approved' });
        }
        if (manaliRetreat) {
            roomsToSeed.push({ ...sampleRoomsData[10], hotelId: manaliRetreat.id, status: 'approved' });
        }

        const delhiLeela = allHotels.find(h => h.name === 'The Leela Palace');
        const goaBaga = allHotels.find(h => h.name === 'Baga Beach Cottages');
        const mumbaiOcean = allHotels.find(h => h.name === 'Mumbai Ocean Front');
        const jaipurHeritage = allHotels.find(h => h.name === 'Pink City Heritage');
        const manaliHeights = allHotels.find(h => h.name === 'Himalayan Heights');

        if (delhiLeela) {
            roomsToSeed.push({ ...sampleRoomsData[11], hotelId: delhiLeela.id, status: 'approved' });
        }
        if (goaBaga) {
            roomsToSeed.push({ ...sampleRoomsData[12], hotelId: goaBaga.id, status: 'approved' });
        }
        if (mumbaiOcean) {
            roomsToSeed.push({ ...sampleRoomsData[13], hotelId: mumbaiOcean.id, status: 'approved' });
        }
        if (jaipurHeritage) {
            roomsToSeed.push({ ...sampleRoomsData[14], hotelId: jaipurHeritage.id, status: 'approved' });
        }
        if (manaliHeights) {
            roomsToSeed.push({ ...sampleRoomsData[15], hotelId: manaliHeights.id, status: 'approved' });
        }

        if (roomsToSeed.length > 0) {
            await seedCollection('rooms', roomsToSeed, 'title');
        }

        // Seed Reviews
        if (bobGuest) {
            const guestReviewBase = {
                userId: bobGuest.id,
                userName: bobGuest.name,
                userAvatar: `https://i.pravatar.cc/150?u=${bobGuest.id}`,
                userCountry: 'USA'
            };

            if (grandPalace) {
                await seedSubcollection('hotels', grandPalace.id, 'reviews', [
                    { ...guestReviewBase, hotelId: grandPalace.id, ...sampleReviewsData[0] },
                    { ...guestReviewBase, hotelId: grandPalace.id, ...sampleReviewsData[1] }
                ]);
            }
            if (santoriniEscape) {
                await seedSubcollection('hotels', santoriniEscape.id, 'reviews', [
                    { ...guestReviewBase, hotelId: santoriniEscape.id, ...sampleReviewsData[2] },
                    { ...guestReviewBase, hotelId: santoriniEscape.id, ...sampleReviewsData[3] }
                ]);
            }
            if (modernHub) {
                await seedSubcollection('hotels', modernHub.id, 'reviews', [
                    { ...guestReviewBase, hotelId: modernHub.id, ...sampleReviewsData[4] }
                ]);
            }
        }

    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Immediately invoke the seeding function to ensure data is available on startup
export { seedDatabase };
seedDatabase(); // Uncomment this line if you need to run seeding via module import, otherwise call it where appropriate like in an admin page or useEffect.
// Checking environment to maybe auto-seed in dev? 
// For now, let's export it and user can trigger it or we trigger it via specific user action.

export async function getApprovedHotels() {
    try {
        const querySnapshot = await getDocs(collection(db, 'hotels'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Hotel[];
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return [];
    }
}
