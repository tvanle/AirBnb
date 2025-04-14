export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed"

export interface Booking {
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

export const statusStyles: Record<BookingStatus, { label: string; className: string }> = {
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