import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stepper } from './components/Stepper';
import { Navigation } from './components/Navigation';
import { Step1_BasicInfo } from './components/Step1_BasicInfo';
import { Step2_Facilities } from './components/Step2_Facilities';
import { Step3_Rooms } from './components/Step3_Rooms';
import { Step4_Documents } from './components/Step4_Documents';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { createHotel, createRoom } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { HotelDocument } from '@/lib/types';

import { HotelFormData } from './types';

const INITIAL_DATA: HotelFormData = {
    name: '',
    city: '',
    state: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    videoUrl: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    facilities: [],
    checkIn: '14:00',
    checkOut: '11:00',
    cancellationPolicy: '',
    petFriendly: false,
    rooms: [],
    documents: []
};

export function HotelOnboardingForm({ onFinished }: { onFinished?: () => void }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<HotelFormData>(INITIAL_DATA);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    const updateFormData = (data: Partial<HotelFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = async () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            await submitForm();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const submitForm = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to create a hotel.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const documents: HotelDocument[] = formData.documents.map((d: any) => ({
                name: "Document",
                url: "https://example.com/doc.pdf"
            }));

            const newHotel = await createHotel({
                name: formData.name,
                location: `${formData.city}, ${formData.state}`,
                description: formData.description,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                website: formData.website,
                facilities: formData.facilities,
                checkInTime: formData.checkIn,
                checkOutTime: formData.checkOut,
                cancellationPolicy: formData.cancellationPolicy,
                isPetFriendly: formData.petFriendly,
                documents: documents,
                ownerId: user.id,
                ownerName: user.name,
                ownerEmail: user.email,
                coverImage: formData.imageUrl,
                videoUrl: formData.videoUrl
            });

            // Create rooms
            for (const room of formData.rooms) {
                await createRoom({
                    title: room.type,
                    hotelId: newHotel.id,
                    description: `${room.type} with ${room.beds}`,
                    price: parseInt(room.price) || 0,
                    capacity: parseInt(room.capacity) || 2,
                    images: [], // Placeholder as form doesn't handle room images explicitly yet
                    status: 'approved' // Auto-approve for demo
                });
            }

            setIsCompleted(true);
            toast({
                title: "Success",
                description: "Hotel created successfully!"
            });
            if (onFinished) onFinished();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to create hotel.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isCompleted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center"
            >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Submission Successful!</h2>
                <p className="text-slate-600 mb-8 text-lg">
                    Your hotel property "{formData.name}" has been submitted for review. You will receive a confirmation email shortly.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-200"
                >
                    Return to Dashboard
                </button>
            </motion.div>
        );
    }

    if (isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-3xl shadow-xl">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                <p className="text-lg font-medium text-slate-600">Creating your property listing...</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
            <div className="bg-slate-50 border-b border-slate-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Add New Property</h1>
                        <p className="text-slate-500 mt-1">Fill in the details to list your hotel on our platform</p>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50">
                        Save as Draft
                    </div>
                </div>

                <Stepper currentStep={currentStep} totalSteps={4} />
            </div>

            <div className="p-6 md:p-10 min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full"
                    >
                        {currentStep === 1 && (
                            <Step1_BasicInfo data={formData} updateData={updateFormData} />
                        )}
                        {currentStep === 2 && (
                            <Step2_Facilities data={formData} updateData={updateFormData} />
                        )}
                        {currentStep === 3 && (
                            <Step3_Rooms data={formData} updateData={updateFormData} />
                        )}
                        {currentStep === 4 && (
                            <Step4_Documents data={formData} updateData={updateFormData} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50">
                <Navigation
                    currentStep={currentStep}
                    totalSteps={4}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            </div>
        </div>
    );
}
