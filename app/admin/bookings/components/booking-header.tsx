import { Calendar } from "lucide-react"
import { Button } from "@/components/admin/ui/button"

export function BookingHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">Manage your property bookings and reservations</p>
      </div>
      <Button className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        Calendar View
      </Button>
    </div>
  )
} 