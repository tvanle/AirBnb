import { Search } from "lucide-react"
import { Input } from "@/components/admin/ui/input"

interface BookingSearchProps {
  searchTerm: string
  onSearch: (value: string) => void
}

export function BookingSearch({ searchTerm, onSearch }: BookingSearchProps) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search bookings..."
        className="w-full pl-8"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
} 