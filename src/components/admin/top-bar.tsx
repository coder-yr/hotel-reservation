"use client";

import { Bell, MessageSquare, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";

export function TopBar() {
    const { user } = useAuth();

    return (
        <div className="flex items-center justify-between py-4 px-6 bg-background border-b md:border-none">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search something..."
                        className="w-full pl-9 pr-4 py-2 rounded-full border bg-background focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.id || 'admin'}`} />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col text-sm">
                        <span className="font-semibold">{user?.name || 'Esther Howard'}</span>
                        {/* <span className="text-xs text-muted-foreground">Admin</span> */}
                    </div>
                    <Settings className="h-4 w-4 text-muted-foreground ml-1" />
                </div>
            </div>
        </div>
    );
}
