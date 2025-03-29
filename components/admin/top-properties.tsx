import { Building2 } from "lucide-react"
import { Progress } from "@/components/admin/ui/progress"

interface Property {
    id: string
    name: string
    location: string
    occupancyRate: number
    revenue: number
}

const topProperties: Property[] = [
    {
        id: "P001",
        name: "Oceanfront Villa",
        location: "Miami, FL",
        occupancyRate: 92,
        revenue: 12500,
    },
    {
        id: "P002",
        name: "Mountain Cabin",
        location: "Aspen, CO",
        occupancyRate: 85,
        revenue: 9800,
    },
    {
        id: "P003",
        name: "Downtown Loft",
        location: "New York, NY",
        occupancyRate: 78,
        revenue: 8450,
    },
    {
        id: "P004",
        name: "Beachside Cottage",
        location: "Malibu, CA",
        occupancyRate: 88,
        revenue: 10750,
    },
]

export function TopProperties() {
    return (
        <div className="space-y-4">
            {topProperties.map((property) => (
                <div key={property.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium leading-none">{property.name}</p>
                                <p className="text-xs text-muted-foreground">{property.location}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium">${property.revenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{property.occupancyRate}% occupied</p>
                        </div>
                    </div>
                    <Progress value={property.occupancyRate} className="h-2" />
                </div>
            ))}
        </div>
    )
}
