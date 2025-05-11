"use client";

import Image from "next/image";
import { Building2, Edit, Trash } from "lucide-react";
import Button from "@/components/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Badge } from "@/components/admin/ui/badge";
import { CategoryIcon } from "@/components/admin/category-icon";
import { Property } from "../data/listings";

interface PropertyCardProps {
  property: Property;
  onView: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  getByValue: (
    value: string,
  ) => { value: string; label: string; flag: string } | undefined;
}

export function PropertyCard({
  property,
  onView,
  onEdit,
  onDelete,
  getByValue,
}: PropertyCardProps) {
  const country = getByValue(property.countryValue);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 w-full">
        <Image
          src={property.image || "/placeholder.svg"}
          alt={property.name}
          fill
          className="object-cover"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button outline label="" small onClick={() => {}} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(property)}>
                <Building2 className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(property)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(property.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <div className="font-medium text-rose-500">
            ${property.price}/night
          </div>
          <div>
            {property.bedrooms}{" "}
            {property.bedrooms === 1 ? "bedroom" : "bedrooms"} •{" "}
            {property.bathrooms}{" "}
            {property.bathrooms === 1 ? "bathroom" : "bathrooms"} •{" "}
            {property.guestCount}{" "}
            {property.guestCount === 1 ? "guest" : "guests"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button outline label="View Details" onClick={() => onView(property)} />
      </CardFooter>
    </Card>
  );
}
