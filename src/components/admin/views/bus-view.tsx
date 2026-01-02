"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "../data-table";
import { columns as allBusesColumns } from "../all-buses-columns";
import { AddBusForm } from "../../add-bus-form";
import type { Bus } from "@/lib/types";
import { Bus as BusIcon, Plus, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BusViewProps {
    buses: Bus[];
}

export function BusView({ buses }: BusViewProps) {
    const [activeTab, setActiveTab] = useState("all-buses");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bus Management</h2>
                    <p className="text-muted-foreground">Manage your fleet and schedules.</p>
                </div>
            </div>

            <Tabs defaultValue="all-buses" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="all-buses">
                        <List className="mr-2 h-4 w-4" /> All Buses
                    </TabsTrigger>
                    <TabsTrigger value="add-bus">
                        <Plus className="mr-2 h-4 w-4" /> Add New Bus
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all-buses" className="space-y-4">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b px-6 py-4">
                            <CardTitle className="text-base font-semibold">Fleet Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable columns={allBusesColumns} data={buses} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add-bus">
                    <div className="max-w-4xl">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium">Add a New Bus</h3>
                            <p className="text-sm text-muted-foreground">Fill in the details to add a new bus to the system.</p>
                        </div>
                        <AddBusForm />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
