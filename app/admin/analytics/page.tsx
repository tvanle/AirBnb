import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/admin/ui/tabs";
import {RevenueOverview} from "@/app/admin/analytics/components/RevenueOverview";
import {RevenueByCategory} from "@/app/admin/analytics/components/RevenueByCategory";
import {RevenueByCountry} from "@/app/admin/analytics/components/RevenueByCountry";
import { getRevenueData } from "@/app/admin/analytics/data/getRevenueData";
import { getRevenueByCategoryData } from "@/app/admin/analytics/data/getRevenueByCategoryData";
import { getRevenueByCountryData } from "@/app/admin/analytics/data/getRevenueByCountryData";

export default async function AnalyticsPage() {
  const revenueData = await getRevenueData();
  const revenueByCategoryData = await getRevenueByCategoryData();
  const revenueByCountryData = await getRevenueByCountryData();

  return (
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Detailed analytics and insights for your properties
          </p>
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
                <Suspense fallback={<div>Loading...</div>}>
                  <RevenueOverview data={revenueData} />
                </Suspense>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Distribution of revenue by property category</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Suspense fallback={<div>Loading...</div>}>
                    <RevenueByCategory data={revenueByCategoryData} />
                  </Suspense>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Revenue by Country</CardTitle>
                  <CardDescription>Distribution of revenue by country</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Suspense fallback={<div>Loading...</div>}>
                    <RevenueByCountry data={revenueByCountryData} />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {/* Nội dung sẽ được thêm sau */}
          </TabsContent>
          <TabsContent value="categories" className="space-y-4">
            {/* Nội dung sẽ được thêm sau */}
          </TabsContent>
          <TabsContent value="countries" className="space-y-4">
            {/* Nội dung sẽ được thêm sau */}
          </TabsContent>
        </Tabs>
      </div>
  );
}