"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    PieChart,
    Users,
    Building,
    CalendarDays,
    ArrowRightLeft,
    Wallet,
    MessageSquare,
    HelpCircle,
    Settings,
    HeadphonesIcon,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Sidebar({ className, activeTab, onTabChange }: SidebarProps) {
    const { logout } = useAuth();
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "analytic", label: "Analytic", icon: PieChart },
        { id: "guests", label: "Guests", icon: Users },
        { id: "my-property", label: "My Property", icon: Building },
        { id: "bus-system", label: "Bus System", icon: CalendarDays },
        { id: "bookings", label: "Booking", icon: CalendarDays },
        { id: "transaction", label: "Transaction", icon: ArrowRightLeft },
        { id: "cashflow", label: "Cashflow", icon: Wallet },
        { id: "message", label: "Message", icon: MessageSquare },
    ];

    const bottomItems = [
        { id: "user-guide", label: "User Guide", icon: HelpCircle },
        { id: "faq", label: "FAQ", icon: HelpCircle }, // Using HelpCircle as placeholder if needed
        { id: "help-center", label: "Help Center", icon: HeadphonesIcon },
    ];

    return (
        <div className={cn("pb-12 w-64 border-r min-h-screen bg-card flex flex-col", className)}>
            <div className="space-y-4 py-6">
                <div className="px-6 py-2 flex items-center gap-2">
                    <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        C
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Hotelmo</h2>
                </div>

                <div className="px-4 py-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-muted/50 rounded-lg px-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                        <div className="absolute left-3 top-2.5 text-muted-foreground">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <div className="absolute right-3 top-2.5 text-xs text-muted-foreground border border-muted-foreground/30 px-1 rounded">
                            ⌘ K
                        </div>
                    </div>
                </div>

                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={activeTab === item.id ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 pl-4 font-normal relative overflow-hidden",
                                    activeTab === item.id
                                        ? "bg-green-600/90 text-white hover:bg-green-700 shadow-md shadow-green-200 dark:shadow-none"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => onTabChange(item.id)}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-auto px-3 py-2">
                <div className="space-y-1">
                    {bottomItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className="w-full justify-start gap-3 pl-4 font-normal text-muted-foreground hover:text-foreground"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Button>
                    ))}
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 pl-4 font-normal text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}
