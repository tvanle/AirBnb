import { Booking } from "./types"

export const bookings: Booking[] = [
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
  {
    id: "B005",
    guest: {
      name: "Alex Thompson",
      email: "alex.t@example.com",
    },
    property: "Luxury Penthouse",
    checkIn: "2023-09-05",
    checkOut: "2023-09-10",
    status: "confirmed",
    amount: 1800,
  },
  {
    id: "B006",
    guest: {
      name: "Lisa Wang",
      email: "lisa.w@example.com",
    },
    property: "Countryside Farmhouse",
    checkIn: "2023-09-12",
    checkOut: "2023-09-18",
    status: "pending",
    amount: 1100,
  },
] 