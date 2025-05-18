"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Badge } from "@/components/admin/ui/badge"
import { CategoryIcon } from "@/components/admin/category-icon"
import { Property } from "../data/listings"

interface PropertyCardProps {
    property: Property
    onView: (property: Property) => void
    onEdit: (property: Property) => void
    onDelete: (id: string) => void
    getByValue: (value: string) => { value: string; label: string; flag: string } | undefined
}

export function PropertyCard({ property, onView, onEdit, onDelete, getByValue }: PropertyCardProps) {
    const country = getByValue(property.countryValue);

    const handleView = () => {
        console.log("View clicked for property:", property.id);
        onView(property);
    };

    const handleEdit = () => {
        console.log("Edit clicked for property:", property.id);
        onEdit(property);
    };

    const handleDelete = () => {
        console.log("Delete clicked for property:", property.id);
        onDelete(property.id);
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative h-48 w-full">
                <Image
                    src={property.image || "/images/placeholder.jpg"}
                    alt={property.name}
                    fill
                    className="object-cover"
                    onError={() => console.error("Failed to load image for property:", property.id)}
                />
            </div>
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            {country?.flag} {property.countryValue}, {country?.label}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100 transition"
                            onClick={handleView}
                        >
                            View
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-yellow-100 transition"
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-rose-100 text-rose-500 transition"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <CategoryIcon category={property.category} />
                        {property.category}
                    </Badge>
                </div>
                <div className="flex justify-between text-sm">
                    <div className="font-medium text-rose-500">${property.price}/night</div>
                    <div>
                        {property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"} •{" "}
                        {property.bathrooms} {property.bathrooms === 1 ? "bathroom" : "bathrooms"} •{" "}
                        {property.guestCount} {property.guestCount === 1 ? "guest" : "guests"}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <button
                    type="button"
                    className="px-4 py-2 rounded border border-gray-300 text-sm hover:bg-gray-100 transition w-full"
                    onClick={() => {
                        console.log("View Details button clicked for property:", property.id);
                        handleView();
                    }}
                >
                    View Details
                </button>
            </CardFooter>
        </Card>
    );
}
