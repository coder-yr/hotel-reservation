import { SignupForm } from "@/components/signup-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Animated Gradient Orbs Background */}
        <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/20 blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-[30%] right-[30%] w-[30%] h-[30%] rounded-full bg-blue-400/20 blur-[80px] animate-pulse delay-700" />
        </div>

        <Card className="glass-card w-full max-w-md border-0 shadow-2xl relative z-10">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-4xl font-bold tracking-tight">
              Create an <span className="text-gradient">Account</span>
            </CardTitle>
            <CardDescription className="text-base">Join Lodgify to find your perfect stay or list your property.</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
