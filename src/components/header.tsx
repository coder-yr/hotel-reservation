"use client"
import Link from "next/link"
import { Building2, User, LogOut, LogIn, UserPlus, Globe, BookMarked, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="glass rounded-full px-6 py-3 flex items-center gap-8 shadow-lg backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 w-full max-w-5xl transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-900/80">
        <Link href="/" className="flex items-center space-x-2 mr-auto">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-2 rounded-xl shadow-lg shadow-teal-500/20">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-bold font-headline text-xl tracking-tight text-slate-800 dark:text-white">Lodgify</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/dashboard", label: "Home" },
            { href: "/hotels", label: "Hotels" },
            { href: "/flights", label: "Flights" },
            { href: "/bus", label: "Bus" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-white/10">
                  <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-700 shadow-sm">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card mt-2" align="end" forceMount>
                {user.role === 'owner' && <DropdownMenuItem onClick={() => router.push('/owner')}>Owner Dashboard</DropdownMenuItem>}
                {user.role === 'admin' && <DropdownMenuItem onClick={() => router.push('/admin')}>Admin Dashboard</DropdownMenuItem>}
                <DropdownMenuItem onClick={() => router.push('/bookings')}>
                  <BookMarked className="mr-2 h-4 w-4" />
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-lg shadow-slate-900/20">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
