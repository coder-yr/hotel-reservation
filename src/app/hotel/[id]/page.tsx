
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getHotelById, getRoomsByHotelId, getApprovedHotels, getUserById } from '@/lib/data';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Share2, Heart, Star, ShieldCheck, MapPin, Wifi, ParkingSquare, UtensilsCrossed, Dumbbell, Waves, Sparkles, User, BadgeCheck, Phone, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingCard } from '@/components/booking-card';
import { SimilarProperties } from '@/components/similar-properties';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewsSection } from '@/components/reviews-section';
import Image from "next/image";
import Link from 'next/link';

type HotelPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({ params }: HotelPageProps): Promise<Metadata> {
    const { id } = await params;
    const hotel = await getHotelById(id);

    if (!hotel) {
        return {
            title: 'Hotel Not Found | Lodgify Lite',
            description: 'The requested hotel could not be found.',
        };
    }

    return {
        title: `${hotel.name} - Book Online | Lodgify Lite`,
        description: `Book your stay at ${hotel.name} in ${hotel.address}. ${hotel.description.substring(0, 150)}...`,
        openGraph: {
            title: `${hotel.name} | Lodgify Lite`,
            description: hotel.description.substring(0, 160),
            images: [hotel.coverImage || '/og-image.jpg'],
        },
    };
}

const facilityIconMap: { [key: string]: React.ElementType } = {
    wifi: Wifi,
    parking: ParkingSquare,
    restaurant: UtensilsCrossed,
    gym: Dumbbell,
    pool: Waves,
    spa: Sparkles,
};
const facilityNameMap: { [key: string]: string } = {
    wifi: "Free WiFi",
    parking: "Parking",
    restaurant: "Restaurant",
    gym: "Gym",
    pool: "Swimming Pool",
    spa: "Spa",
}

export default async function HotelPage({ params }: HotelPageProps) {
    const { id } = await params;
    const hotel = await getHotelById(id);
    if (!hotel || hotel.status !== 'approved') {
        notFound();
    }
    const rooms = await getRoomsByHotelId(id);
    const similarHotels = (await getApprovedHotels()).filter(h => h.id !== id).slice(0, 3);
    const owner = await getUserById(hotel.ownerId);

    const allImages = [
        hotel.coverImage,
        ...rooms.flatMap(room => room.images).slice(0, 2)
    ];
    // Ensure at least 3 images for the specific grid layout (1 big, 2 small)
    while (allImages.length < 3) {
        allImages.push('https://placehold.co/600x400.png');
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-background font-sans text-slate-900 dark:text-foreground">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                    {/* Hero Image Grid - 1 Large Left, 2 Small Right */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
                        <div className="md:col-span-3 relative h-full">
                            <Image
                                src={allImages[0]}
                                alt={hotel.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                priority
                            />
                        </div>
                        <div className="hidden md:flex flex-col gap-4 h-full md:col-span-1">
                            <div className="relative h-1/2 rounded-tr-2xl overflow-hidden">
                                <Image
                                    src={allImages[1]}
                                    alt="Property detail"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="relative h-1/2 rounded-br-2xl overflow-hidden">
                                <Image
                                    src={allImages[2]}
                                    alt="Property detail"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors cursor-pointer">
                                    <span className="text-white font-medium border border-white/50 px-3 py-1 rounded-full backdrop-blur-sm">View all photos</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* LEFT COLUMN - Main Information */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Header Info */}
                            <div>
                                <h1 className="text-3xl font-bold tracking-normal text-slate-900 dark:text-foreground mb-2">{hotel.name}</h1>
                                <div className="flex items-center text-slate-500 dark:text-muted-foreground mb-4">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span>{hotel.address}</span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                        <BadgeCheck className="w-4 h-4 text-green-600" /> Verified Listing
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                        <Star className="w-4 h-4 text-orange-500 fill-orange-500" /> 4.8 (24 Reviews)
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                {hotel.description}
                            </p>

                            <Separator />

                            {/* Property Features */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-foreground">Property Features</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                    {hotel.facilities && hotel.facilities.map(facility => {
                                        const Icon = facilityIconMap[facility];
                                        return Icon ? (
                                            <div key={facility} className="flex items-center gap-3 text-slate-700 dark:text-foreground">
                                                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    <Icon className="w-5 h-5 text-slate-900 dark:text-foreground" />
                                                </div>
                                                <span className="font-medium">{facilityNameMap[facility]}</span>
                                            </div>
                                        ) : null;
                                    })}
                                    {(!hotel.facilities || hotel.facilities.length === 0) && (
                                        <p className="text-slate-500 dark:text-muted-foreground italic">No specific features listed.</p>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Video Reviews (Placeholder) */}
                            {hotel.videoUrl && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground">Video Tour</h3>
                                    </div>
                                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden relative group">
                                        {hotel.videoUrl.includes('youtube.com') || hotel.videoUrl.includes('youtu.be') ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={hotel.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                                title="Video Tour"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white">
                                                <a href={hotel.videoUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                                    </div>
                                                    <span>Watch Video Tour</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <Separator className="mt-8" />
                                </div>
                            )}

                            {/* Location */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-foreground">Location</h3>
                                <div className="h-[300px] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-border">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        scrolling="no"
                                        marginHeight={0}
                                        marginWidth={0}
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                        title={`Map of ${hotel.name}`}
                                        className="filter grayscale-[20%] contrast-[1.1] opacity-90 hover:opacity-100 transition-opacity"
                                    ></iframe>
                                </div>
                            </div>

                            <Separator />

                            {/* Reviews */}
                            <div id="reviews">
                                <h3 className="text-xl font-semibold mb-8 text-slate-900 dark:text-foreground">Guest Reviews</h3>
                                <ReviewsSection hotelId={hotel.id} />
                            </div>

                        </div>

                        {/* RIGHT COLUMN - Sidebar */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Detail Card */}
                            <Card className="border shadow-none rounded-xl overflow-hidden dark:border-border">
                                <CardHeader className="bg-slate-50 dark:bg-slate-800 py-4 border-b dark:border-border">
                                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground">Property Details</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y dark:divide-border">
                                        <div className="flex justify-between py-3 px-5 text-sm">
                                            <span className="text-slate-500 dark:text-muted-foreground">Property Type</span>
                                            <span className="font-medium text-slate-900 dark:text-foreground">Hotel</span>
                                        </div>
                                        <div className="flex justify-between py-3 px-5 text-sm">
                                            <span className="text-slate-500 dark:text-muted-foreground">Cancellation</span>
                                            <span className="font-medium text-right ml-2 text-slate-900 dark:text-foreground">{hotel.cancellationPolicy}</span>
                                        </div>
                                        <div className="flex justify-between py-3 px-5 text-sm">
                                            <span className="text-slate-500 dark:text-muted-foreground">Check-in</span>
                                            <span className="font-medium text-slate-900 dark:text-foreground">{hotel.checkInTime}</span>
                                        </div>
                                        <div className="flex justify-between py-3 px-5 text-sm">
                                            <span className="text-slate-500 dark:text-muted-foreground">Check-out</span>
                                            <span className="font-medium text-slate-900 dark:text-foreground">{hotel.checkOutTime}</span>
                                        </div>
                                        <div className="flex justify-between py-3 px-5 text-sm">
                                            <span className="text-slate-500 dark:text-muted-foreground">Pet Friendly</span>
                                            <span className="font-medium text-slate-900 dark:text-foreground">{hotel.isPetFriendly ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Agent Detail Card */}
                            <Card className="border shadow-none rounded-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar className="h-14 w-14 border mb-2">
                                            <AvatarImage src={owner?.avatarUrl || `https://i.pravatar.cc/150?u=${hotel.ownerId}`} />
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-lg">{owner?.name || hotel.ownerName || 'Host'}</h4>
                                            <p className="text-sm text-muted-foreground">Property Manager</p>
                                        </div>
                                    </div>
                                    <Button className="w-full">
                                        Contact Host
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Booking Card */}
                            <div className="sticky top-24">
                                <BookingCard rooms={rooms} hotel={hotel} />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Similar Properties Section */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-16">
                    <SimilarProperties hotels={similarHotels} />
                </div>

            </main>
            <Footer />
        </div>
    );
}
