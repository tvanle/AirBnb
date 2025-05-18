"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  BarChart3,
  Building2,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/admin/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/admin/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Properties",
    href: "/admin/properties",
    icon: Building2,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="grid gap-2 text-lg font-medium">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-muted-foreground hover:text-rose-500",
                            pathname === item.href &&
                            "bg-rose-50 text-rose-500 font-medium",
                        )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <button
                onClick={() => handleNavigation("/")}
                className="flex items-center gap-2 font-semibold"
            >
              <Building2 className="h-6 w-6 text-rose-500" />
              <span className="hidden md:inline text-rose-500">AirAdmin</span>
            </button>
          </div>
          <div className="flex-1" />
        </header>
        <div className="grid flex-1 md:grid-cols-[220px_1fr]">
          <aside className="hidden border-r bg-white md:block">
            <nav className="grid gap-2 p-4 text-sm">
              {navItems.map((item, index) => (
                  <button
                      key={index}
                      onClick={() => handleNavigation(item.href)}
                      className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-muted-foreground transition-all hover:text-rose-500",
                          pathname === item.href &&
                          "bg-rose-50 font-medium text-rose-500",
                      )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </button>
              ))}
              <div className="mt-auto">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 mt-8 text-muted-foreground hover:text-rose-500"
                    onClick={() => console.log("Logout clicked")}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
  )
}