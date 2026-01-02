"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminPromoter() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    if (!user) return null;
    if (user.role === 'admin') return null;

    const makeAdmin = async () => {
        if (!user?.id) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "User ID is missing. Cannot promote.",
            });
            return;
        }

        try {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
                role: "admin"
            });
            toast({
                title: "You are now an Admin!",
                description: "Refreshing page...",
            });
            // Force refresh to update auth state context if needed, or just redirect
            window.location.href = "/admin";
        } catch (error) {
            console.error("Error promoting user:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not update user role.",
            });
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button
                onClick={makeAdmin}
                className="bg-red-600 hover:bg-red-700 text-white shadow-xl animate-bounce"
            >
                <ShieldAlert className="mr-2 h-4 w-4" />
                Make Me Admin (Temp)
            </Button>
        </div>
    );
}
