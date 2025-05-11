"use client"

import { useState } from "react"
import { Button } from "@/components/admin/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Textarea } from "@/components/admin/ui/textarea"
import { categories, CategoryIcon } from "@/components/admin/category-icon"
import { Property } from "../data/listings"
import ImageUpload from "@/components/inputs/ImageUpload"

interface EditPropertyDialogProps {
    property: Property | null
    onUpdate: (property: Partial<Property>) => void
    onClose: () => void
    getAll: () => { value: string; label: string; flag: string }[]
}

export function EditPropertyDialog({ property, onUpdate, onClose, getAll }: EditPropertyDialogProps) {
    const [newProperty, setNewProperty] = useState<Partial<Property>>(property || {
        name: "",
        category: "",
        location: "",
        countryValue: "",
        price: 0,
        bedrooms: 1,
        bathrooms: 1,
        guestCount: 1,
        image: "",
        description: "",
    })

    if (!property) return null

    return (
        <Dialog open={!!property} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Property</DialogTitle>
                    <DialogDescription>Update the details of {property.name}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Image</Label>
                        <ImageUpload
                            value={newProperty.image || ""}
                            onChange={(value) => setNewProperty({ ...newProperty, image: value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Property Name</Label>
                            <Input
                                id="edit-name"
                                value={newProperty.name}
                                onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                                value={newProperty.category}
                                onValueChange={(value) => setNewProperty({ ...newProperty, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.label} value={category.label}>
                                            <div className="flex items-center gap-2">
                                                <CategoryIcon category={category.label} />
                                                <span>{category.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-location">Location</Label>
                            <Input
                                id="edit-location"
                                value={newProperty.location}
                                onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-country">Country</Label>
                            <Select
                                value={newProperty.countryValue}
                                onValueChange={(value) => setNewProperty({ ...newProperty, countryValue: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAll().map((country) => (
                                        <SelectItem key={country.value} value={country.value}>
                                            <div className="flex items-center gap-2">
                                                <span>{country.flag}</span>
                                                <span>{country.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-price">Price per night ($)</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                value={newProperty.price?.toString()}
                                onChange={(e) => setNewProperty({ ...newProperty, price: Number.parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                            <Input
                                id="edit-bedrooms"
                                type="number"
                                value={newProperty.bedrooms?.toString()}
                                onChange={(e) => setNewProperty({ ...newProperty, bedrooms: Number.parseInt(e.target.value) || 1 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                            <Input
                                id="edit-bathrooms"
                                type="number"
                                value={newProperty.bathrooms?.toString()}
                                onChange={(e) => setNewProperty({ ...newProperty, bathrooms: Number.parseInt(e.target.value) || 1 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-guestCount">Guests</Label>
                            <Input
                                id="edit-guestCount"
                                type="number"
                                value={newProperty.guestCount?.toString()}
                                onChange={(e) => setNewProperty({ ...newProperty, guestCount: Number.parseInt(e.target.value) || 1 })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={newProperty.description}
                            onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => onUpdate(newProperty)} className="bg-rose-500 hover:bg-rose-600">
                        Update Property
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}