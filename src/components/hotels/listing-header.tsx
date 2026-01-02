import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { LayoutGrid, List } from "lucide-react"

interface ListingHeaderProps {
    count?: number;
}

export function ListingHeader({ count }: ListingHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold">Showing {count ?? 0} Properties</h2>
                <p className="text-sm text-muted-foreground">Based on your search criteria</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select defaultValue="recommended">
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Top Rated</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex bg-white rounded-md border p-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm bg-slate-100"><LayoutGrid className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm"><List className="w-4 h-4" /></Button>
                </div>
            </div>
        </div>
    )
}
