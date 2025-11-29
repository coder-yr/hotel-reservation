
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OwnerDashboard } from "@/components/owner-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function OwnerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'owner') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'owner') {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <OwnerDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
