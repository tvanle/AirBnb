import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { revenueData } from "../data/chart-data"

export function RevenueChart() {
  return (
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
            <Bar 
              dataKey="revenue" 
              fill="rgba(239, 68, 68, 0.8)" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 