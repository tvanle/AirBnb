"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar"
import { Badge } from "@/components/admin/ui/badge"

type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed"

interface Booking {
    id: string
    guest: {
        name: string
        email: string
        avatar?: string
    }
    property: string
    checkIn: string
    checkOut: string
    status: BookingStatus
    amount: number
}

const recentBookings: Booking[] = [
    {
        id: "B001",
        guest: {
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
        },
        property: "Oceanfront Villa",
        checkIn: "2023-08-15",
        checkOut: "2023-08-20",
        status: "confirmed",
        amount: 1250,
    },
    {
        id: "B002",
        guest: {
            name: "Michael Chen",
            email: "m.chen@example.com",
        },
        property: "Mountain Cabin",
        checkIn: "2023-08-18",
        checkOut: "2023-08-25",
        status: "pending",
        amount: 980,
    },
    {
        id: "B003",
        guest: {
            name: "Emma Wilson",
            email: "emma.w@example.com",
        },
        property: "Downtown Loft",
        checkIn: "2023-08-10",
        checkOut: "2023-08-13",
        status: "completed",
        amount: 450,
    },
    {
        id: "B004",
        guest: {
            name: "James Rodriguez",
            email: "james.r@example.com",
        },
        property: "Beachside Cottage",
        checkIn: "2023-08-22",
        checkOut: "2023-08-29",
        status: "cancelled",
        amount: 875,
    },
]

const statusStyles: Record<BookingStatus, { label: string; className: string }> = {
    confirmed: {
        label: "Confirmed",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    },
    cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
    completed: {
        label: "Completed",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
}

export function RecentBookings() {
    const router = useRouter()

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        })
    }

    const handleBookingClick = (bookingId: string) => {
        router.push(`/bookings?id=${bookingId}`)
    }

    return (
        <div className="space-y-4">
            {recentBookings.map((booking) => (
                <div
                    key={booking.id}
                    className="flex items-center justify-between space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleBookingClick(booking.id)}
                >
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={booking.guest.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{booking.guest.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium leading-none">{booking.guest.name}</p>
                            <p className="text-sm text-muted-foreground">{booking.property}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{formatDate(booking.checkIn)}</span>
                                <span>→</span>
                                <span>{formatDate(booking.checkOut)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className={statusStyles[booking.status].className}>
                            {statusStyles[booking.status].label}
                        </Badge>
                        <p className="text-sm font-medium">${booking.amount}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

