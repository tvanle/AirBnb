"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Building2, DollarSign, TrendingUp, Users } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { RecentBookings } from "@/components/admin/recent-bookings"
import { TopProperties } from "@/components/admin/top-properties"
import { Button } from "@/components/admin/ui/button"

// Sample data for charts
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 5000 },
  { name: "Mar", revenue: 6000 },
  { name: "Apr", revenue: 7500 },
  { name: "May", revenue: 8200 },
  { name: "Jun", revenue: 9000 },
  { name: "Jul", revenue: 10000 },
]

const bookingsData = [
  { name: "Jan", bookings: 120 },
  { name: "Feb", bookings: 150 },
  { name: "Mar", bookings: 180 },
  { name: "Apr", bookings: 220 },
  { name: "May", bookings: 250 },
  { name: "Jun", bookings: 280 },
  { name: "Jul", bookings: 300 },
]

const occupancyData = [
  { name: "Jan", occupancy: 65 },
  { name: "Feb", occupancy: 70 },
  { name: "Mar", occupancy: 75 },
  { name: "Apr", occupancy: 80 },
  { name: "May", occupancy: 85 },
  { name: "Jun", occupancy: 90 },
  { name: "Jul", occupancy: 88 },
]

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors with charts
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+12.4% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">+7 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88%</div>
              <p className="text-xs text-muted-foreground">+2.3% from last month</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="rgba(239, 68, 68, 0.8)" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking activity across your properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentBookings />
                </CardContent>
                <CardFooter>
                  <Button
                      variant="link"
                      className="text-sm text-rose-500 hover:text-rose-600 p-0 flex items-center"
                      onClick={() => router.push("/bookings")}
                  >
                    View all bookings
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Properties</CardTitle>
                  <CardDescription>Your best performing properties this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopProperties />
                </CardContent>
                <CardFooter>
                  <Button
                      variant="link"
                      className="text-sm text-rose-500 hover:text-rose-600 p-0 flex items-center"
                      onClick={() => router.push("/properties")}
                  >
                    View all properties
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Detailed revenue breakdown by month</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Monthly booking trends for the current year</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                        dataKey="bookings"
                        fill="rgba(59, 130, 246, 0.8)"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="occupancy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rates</CardTitle>
                <CardDescription>Monthly occupancy rates for the current year</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="occupancy"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}

