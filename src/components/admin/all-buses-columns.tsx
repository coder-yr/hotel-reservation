"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Bus } from "@/lib/types"
import { ArrowUpDown, MoreHorizontal, Bus as BusIcon, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatINR } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { deleteBus } from "@/lib/data"
import { EditBusDialog } from "./edit-bus-dialog"

const BusActions = ({ bus }: { bus: Bus }) => {
    const { toast } = useToast()

    const handleDelete = async () => {
        try {
            await deleteBus(bus.id)
            toast({
                title: "Bus deleted",
                description: "The bus has been successfully deleted.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete bus.",
                variant: "destructive",
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(bus.id)}
                >
                    Copy Bus ID
                </DropdownMenuItem>
                <EditBusDialog bus={bus} />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Bus
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<Bus>[] = [
    {
        accessorKey: "operator",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Operator
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const bus = row.original
            return (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <BusIcon className="h-4 w-4" />
                    </div>
                    <div className="font-medium">{bus.operator}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "depart",
        header: "Route",
        cell: ({ row }) => {
            const bus = row.original
            return (
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{bus.depart}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{bus.arrive}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "duration",
        header: "Duration",
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            return <Badge variant="secondary" className="font-mono">{formatINR(price)}</Badge>
        },
    },
    {
        accessorKey: "seats",
        header: "Seats",
        cell: ({ row }) => {
            const seats = row.original.seats || []
            return <div>{seats.length} Seats</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <BusActions bus={row.original} />,
    },
]
