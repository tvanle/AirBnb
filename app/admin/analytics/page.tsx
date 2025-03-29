"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip, TooltipProps,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { categories } from "@/components/admin/category-icon"
import useCountries from "@/hook/useCountries"

// Sample data for charts
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 5000 },
  { name: "Mar", revenue: 6000 },
  { name: "Apr", revenue: 7500 },
  { name: "May", revenue: 8200 },
  { name: "Jun", revenue: 9000 },
  { name: "Jul", revenue: 10000 },
  { name: "Aug", revenue: 9500 },
  { name: "Sep", revenue: 11000 },
  { name: "Oct", revenue: 10200 },
  { name: "Nov", revenue: 9800 },
  { name: "Dec", revenue: 12000 },
]

const bookingsData = [
  { name: "Jan", bookings: 120 },
  { name: "Feb", bookings: 150 },
  { name: "Mar", bookings: 180 },
  { name: "Apr", bookings: 220 },
  { name: "May", bookings: 250 },
  { name: "Jun", bookings: 280 },
  { name: "Jul", bookings: 300 },
  { name: "Aug", bookings: 290 },
  { name: "Sep", bookings: 320 },
  { name: "Oct", bookings: 310 },
  { name: "Nov", bookings: 290 },
  { name: "Dec", bookings: 350 },
]

// Generate category data based on the categories array
const categoryData = categories.map((category, index) => ({
  name: category.label,
  value: Math.floor(Math.random() * 20) + 5, // Random value between 5 and 25
}))

const COLORS = [
  "#FF385C",
  "#FF5A5F",
  "#FF7E82",
  "#FF9AA2",
  "#FFB4BD",
  "#FFCCD5",
  "#FFE2E6",
  "#FFF1F3",
  "#00A699",
  "#43D8C9",
]

export default function AnalyticsPage() {
  const { getAll } = useCountries()
  const [mounted, setMounted] = useState(false)

  // Generate country data
  const countryData = getAll()
    .slice(0, 10)
    .map((country) => ({
      name: country.label,
      value: Math.floor(Math.random() * 20) + 5,
      flag: country.flag,
    }))

  // Prevent hydration errors with charts
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const customBookingsTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
          <div className="bg-white p-2 border rounded shadow">
            <p>{`${data.flag} ${label}`}</p>
            <p>{`Bookings: ${payload[0].value}`}</p>
          </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Detailed analytics and insights for your properties</p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-rose-50">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-white">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-white">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-white">
            Categories
          </TabsTrigger>
          <TabsTrigger value="countries" className="data-[state=active]:bg-white">
            Countries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FF385C"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Distribution of revenue by property category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                      data={countryData.map((country) => ({
                        name: country.name,
                        flag: country.flag,
                        bookings: Math.floor(Math.random() * 200) + 100,
                      }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickFormatter={(value, index) => countryData[index]?.flag || ""} />
                    <YAxis />
                    <Tooltip content={customBookingsTooltip} />
                    <Bar dataKey="bookings" fill="#FF385C" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Revenue by Country</CardTitle>
                <CardDescription>Distribution of revenue by country</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                      data={countryData.map((country) => ({
                        name: country.name,
                        flag: country.flag,
                        bookings: Math.floor(Math.random() * 200) + 100,
                      }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickFormatter={(value, index) => countryData[index]?.flag || ""} />
                    <YAxis />
                    <Tooltip content={customBookingsTooltip} />
                    <Bar dataKey="bookings" fill="#FF385C" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
              <CardDescription>Monthly booking trends for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bookingsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}`, "Bookings"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="bookings" fill="#FF385C" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>Distribution of bookings by status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Confirmed", value: 45 },
                        { name: "Pending", value: 25 },
                        { name: "Completed", value: 20 },
                        { name: "Cancelled", value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      animationDuration={1500}
                    >
                      <Cell fill="#00A699" />
                      <Cell fill="#FFB400" />
                      <Cell fill="#007A87" />
                      <Cell fill="#FF5A5F" />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Booking Duration</CardTitle>
                <CardDescription>Average booking duration in days</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "1-3 days", value: 30 },
                      { name: "4-7 days", value: 45 },
                      { name: "8-14 days", value: 20 },
                      { name: "15+ days", value: 5 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Percentage"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <Bar dataKey="value" fill="#FF385C" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Distribution of properties by category</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value) => [`${value} properties`, "Count"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Bar dataKey="value" fill="#FF385C" radius={[0, 4, 4, 0]} animationDuration={1500}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Most popular property categories by bookings</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData.slice(0, 8)} // Show top 8 categories
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      animationDuration={1500}
                    >
                      {categoryData.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} bookings`, "Bookings"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Average occupancy rate by category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData.slice(0, 10).map((cat) => ({
                      name: cat.name,
                      occupancy: Math.floor(Math.random() * 30) + 60, // Random occupancy between 60-90%
                    }))}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Occupancy Rate"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <Bar dataKey="occupancy" fill="#00A699" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="countries" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Country Distribution</CardTitle>
              <CardDescription>Distribution of properties by country</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={countryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tickFormatter={(value, index) => `${countryData[index].flag} ${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} properties`, "Count"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Bar dataKey="value" fill="#FF385C" radius={[0, 4, 4, 0]} animationDuration={1500}>
                    {countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Revenue by Country</CardTitle>
                <CardDescription>Top countries by revenue</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                      data={countryData.map((country) => ({
                        name: country.name,
                        flag: country.flag,
                        bookings: Math.floor(Math.random() * 200) + 100,
                      }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickFormatter={(value, index) => countryData[index]?.flag || ""} />
                    <YAxis />
                    <Tooltip content={customBookingsTooltip} />
                    <Bar dataKey="bookings" fill="#FF385C" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Bookings by Country</CardTitle>
                <CardDescription>Top countries by number of bookings</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={countryData.map((country) => ({
                      name: country.name,
                      flag: country.flag,
                      bookings: Math.floor(Math.random() * 200) + 100, // Random bookings between 100-300
                    }))}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickFormatter={(value, index) => countryData[index].flag} />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value}`, "Bookings"]}
                      labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) {
                          return `${payload[0].payload.flag} ${label}`
                        }
                        return label
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <Bar dataKey="bookings" fill="#FF385C" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

