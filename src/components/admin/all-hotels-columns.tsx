
"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Hotel } from "@/lib/types"
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle, Clock, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"
import { Timestamp } from "firebase/firestore"

const statusIcons = {
  approved: <CheckCircle className="mr-2 h-4 w-4 text-green-500" />,
  pending: <Clock className="mr-2 h-4 w-4 text-yellow-500" />,
  rejected: <XCircle className="mr-2 h-4 w-4 text-red-500" />,
}

import { Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteHotel } from "@/lib/data"

const HotelActions = ({ hotel }: { hotel: Hotel }) => {
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await deleteHotel(hotel.id)
      toast({
        title: "Hotel deleted",
        description: "The hotel has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hotel.",
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
          onClick={() => navigator.clipboard.writeText(hotel.id)}
        >
          Copy hotel ID
        </DropdownMenuItem>
        <Link href={`/hotel/${hotel.id}`} passHref>
          <DropdownMenuItem>
            <LinkIcon className="mr-2 h-4 w-4" />
            View Hotel Page
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete Hotel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Hotel>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hotel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const hotel = row.original
      return (
        <div>
          <div className="font-medium">{hotel.name}</div>
          <div className="text-xs text-muted-foreground">{hotel.location}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    cell: ({ row }) => {
      const hotel = row.original
      return (
        <div>
          <div>{hotel.ownerName}</div>
          <div className="text-xs text-muted-foreground">{hotel.ownerEmail}</div>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === "approved" ? "default" : status === 'pending' ? 'secondary' : 'destructive'

      return <Badge variant={variant} className="capitalize flex items-center w-fit">
        {statusIcons[status as keyof typeof statusIcons]}
        {status}
      </Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Creation Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("createdAt");
      if (!value) return null;
      // The date might be a Firestore Timestamp object, convert it to a JS Date
      const date = value instanceof Timestamp ? value.toDate() : (value as Date);
      try {
        return <div>{format(date, "LLL dd, yyyy")}</div>
      } catch (e) {
        console.error("Invalid date format:", date);
        return <div>Invalid Date</div>
      }
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <HotelActions hotel={row.original} />,
  },
]
