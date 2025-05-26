"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/admin/ui/input"

interface BookingFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
}

export function BookingFilters({
    searchTerm,
    setSearchTerm,
}: BookingFiltersProps) {
    return (
        <div className="flex items-center mb-6">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-10 focus-visible:ring-rose-500"
                />
            </div>
        </div>
    );
}