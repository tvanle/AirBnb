import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { BookingTable } from "./booking-table"
import { Booking } from "../data/types"

interface BookingTabsProps {
  bookings: Booking[]
}

export function BookingTabs({ bookings }: BookingTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>A list of all bookings and reservations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <BookingTable bookings={bookings} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="confirmed" className="mt-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Confirmed Bookings</CardTitle>
            <CardDescription>A list of confirmed bookings</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <BookingTable bookings={bookings.filter(b => b.status === "confirmed")} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pending" className="mt-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Pending Bookings</CardTitle>
            <CardDescription>A list of pending bookings</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <BookingTable bookings={bookings.filter(b => b.status === "pending")} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="completed" className="mt-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Completed Bookings</CardTitle>
            <CardDescription>A list of completed bookings</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <BookingTable bookings={bookings.filter(b => b.status === "completed")} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 