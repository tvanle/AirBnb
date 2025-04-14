"use client"

import { useState } from "react"
import { BookingHeader } from "./components/booking-header"
import { BookingSearch } from "./components/booking-search"
import { BookingTabs } from "./components/booking-tabs"
import { bookings } from "./data/mock-data"

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <BookingHeader />
      <BookingSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
      <BookingTabs bookings={filteredBookings} />
    </div>
  )
}

