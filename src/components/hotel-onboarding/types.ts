export interface HotelFormData {
    name: string;
    city: string;
    state: string;
    description: string;
    imageUrl: string;
    videoUrl: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    facilities: string[];
    checkIn: string;
    checkOut: string;
    cancellationPolicy: string;
    petFriendly: boolean;
    rooms: any[];
    documents: any[];
}
