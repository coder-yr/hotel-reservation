"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { suggestAlternativeAccommodations, SuggestAlternativeAccommodationsOutput } from "@/ai/flows/suggest-alternative-accommodations";
import { SuggestionModal } from "@/components/suggestion-modal";
import { useToast } from "@/hooks/use-toast";

interface AiSuggestionButtonProps {
    searchParams: {
        destination?: string;
        minPrice?: string;
        maxPrice?: string;
        facilities?: string;
    };
}

export function AiSuggestionButton({ searchParams }: AiSuggestionButtonProps) {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestAlternativeAccommodationsOutput | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    const handleGetSuggestions = async () => {
        setLoading(true);
        try {
            const priceRange = searchParams.minPrice && searchParams.maxPrice
                ? `${searchParams.minPrice} - ${searchParams.maxPrice}`
                : "Any";

            const result = await suggestAlternativeAccommodations({
                location: searchParams.destination || "Anywhere",
                priceRange: priceRange,
                amenities: searchParams.facilities || "Any",
                unavailableAccommodation: "Preferred Hotel", // Context: User didn't find what they wanted
            });

            setSuggestions(result);
            setIsModalOpen(true);
        } catch (error) {
            console.error("AI Suggestion Error:", error);
            toast({
                title: "Error",
                description: "Failed to generate suggestions. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={handleGetSuggestions}
                disabled={loading}
                className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Ideas...
                    </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Get AI Suggestions
                    </>
                )}
            </Button>

            {suggestions && (
                <SuggestionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    suggestions={suggestions}
                />
            )}
        </>
    );
}
