"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { RecentBookings } from "@/components/admin/recent-bookings"
import { TopProperties } from "@/components/admin/top-properties"
import { StatsCards } from "./components/stats-cards"
import { RevenueChart } from "./components/revenue-chart"
import { BookingsChart } from "./components/bookings-chart"
import { OccupancyChart } from "./components/occupancy-chart"

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <StatsCards />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <RevenueChart />
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
                  onClick={() => router.push("/admin/bookings")}
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
                  onClick={() => router.push("/admin/properties")}
                >
                  View all properties
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <RevenueChart />
        </TabsContent>
        <TabsContent value="bookings" className="space-y-4">
          <BookingsChart />
        </TabsContent>
        <TabsContent value="occupancy" className="space-y-4">
          <OccupancyChart />
        </TabsContent>
      </Tabs>
    </div>
  )
} 