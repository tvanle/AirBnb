"use client"

import { useState } from "react"
import { Calendar, Edit, Eye, MoreHorizontal, Search, Trash } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar"
import { Badge } from "@/components/admin/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Input } from "@/components/admin/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/admin/ui/tabs"

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

const bookings: Booking[] = [
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

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
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

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Search bookings..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 w-full">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>A list of all bookings and reservations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={booking.guest.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{booking.guest.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{booking.guest.name}</div>
                              <div className="text-sm text-muted-foreground">{booking.guest.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.property}</TableCell>
                        <TableCell>{formatDate(booking.checkIn)}</TableCell>
                        <TableCell>{formatDate(booking.checkOut)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusStyles[booking.status].className}>
                            {statusStyles[booking.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>${booking.amount}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Booking
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Cancel Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmed" className="mt-4 w-full">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Confirmed Bookings</CardTitle>
                <CardDescription>A list of confirmed bookings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings
                      .filter((booking) => booking.status === "confirmed")
                      .map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={booking.guest.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{booking.guest.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{booking.guest.name}</div>
                                <div className="text-sm text-muted-foreground">{booking.guest.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.property}</TableCell>
                          <TableCell>{formatDate(booking.checkIn)}</TableCell>
                          <TableCell>{formatDate(booking.checkOut)}</TableCell>
                          <TableCell>${booking.amount}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Booking
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-4 w-full">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Pending Bookings</CardTitle>
                <CardDescription>A list of pending bookings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings
                      .filter((booking) => booking.status === "pending")
                      .map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={booking.guest.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{booking.guest.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{booking.guest.name}</div>
                                <div className="text-sm text-muted-foreground">{booking.guest.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.property}</TableCell>
                          <TableCell>{formatDate(booking.checkIn)}</TableCell>
                          <TableCell>{formatDate(booking.checkOut)}</TableCell>
                          <TableCell>${booking.amount}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Booking
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-4 w-full">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Completed Bookings</CardTitle>
                <CardDescription>A list of completed bookings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings
                      .filter((booking) => booking.status === "completed")
                      .map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={booking.guest.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{booking.guest.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{booking.guest.name}</div>
                                <div className="text-sm text-muted-foreground">{booking.guest.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.property}</TableCell>
                          <TableCell>{formatDate(booking.checkIn)}</TableCell>
                          <TableCell>{formatDate(booking.checkOut)}</TableCell>
                          <TableCell>${booking.amount}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}

