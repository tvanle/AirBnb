import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../../styles/admin/globals.css"
import { ThemeProvider } from "@/components/admin/theme-provider"
import { DashboardLayout } from "@/components/admin/dashboard-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Airbnb Admin Dashboard",
  description: "Admin dashboard for property management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <DashboardLayout>{children}</DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}



import "../../styles/globals.css"