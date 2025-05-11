"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { CategoryIcon } from "@/components/admin/category-icon"
import { Property } from "../data/listings"

interface ViewPropertyDialogProps {
    property: Property | null
    onClose: () => void
    onEdit: (property: Property) => void
    getByValue: (value: string) => { value: string; label: string; flag: string } | undefined
}

export function ViewPropertyDialog({ property, onClose, onEdit, getByValue }: ViewPropertyDialogProps) {
    if (!property) return null

    return (
        <Dialog open={!!property} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{property.name}</DialogTitle>
                    <DialogDescription>
                        {property.location}, {property.countryValue ? getByValue(property.countryValue)?.label : ""}
                    </DialogDescription>
                </DialogHeader>
                <div className="relative h-64 w-full mb-4">
                    <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.name}
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="grid gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <CategoryIcon category={property.category} />
                            {property.category}
                        </Badge>
                        {property.countryValue && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                {getByValue(property.countryValue)?.flag}
                                {getByValue(property.countryValue)?.label}
                            </Badge>
                        )}
                    </div>
                    <div className="flex justify-between text-sm">
                        <div>${property.price}/night</div>
                        <div>
                            {property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"} •{" "}
                            {property.bathrooms} {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
                        </div>
                    </div>
                    <div className="mt-2">
                        <h4 className="text-sm font-semibold mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{property.description}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            onEdit(property)
                            onClose()
                        }}
                        className="bg-rose-500 hover:bg-rose-600"
                    >
                        Edit Property
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}