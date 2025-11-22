"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
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

  if (!user || user.role !== 'admin') {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-headline font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage hotel and room approvals.</p>
            </div>
          </div>
          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
