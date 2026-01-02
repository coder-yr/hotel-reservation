"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "../data-table";
import { columns as allUsersColumns } from "../all-users-columns";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

interface GuestsViewProps {
    users: User[];
}

export function GuestsView({ users }: GuestsViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Guests & Users</h2>
                    <p className="text-muted-foreground">Manage and view all registered users.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-9">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b px-6 py-4">
                    <CardTitle className="text-base font-semibold">All Users</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable columns={allUsersColumns} data={users} />
                </CardContent>
            </Card>
        </div>
    );
}
