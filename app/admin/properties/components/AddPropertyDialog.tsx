"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/admin/ui/dialog"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Textarea } from "@/components/admin/ui/textarea"
import { categories, CategoryIcon } from "@/components/admin/category-icon"
import { Property } from "../data/listings"
import ImageUpload from "@/components/inputs/ImageUpload"

interface AddPropertyDialogProps {
    onAdd: (property: Partial<Property>) => void
    getAll: () => { value: string; label: string; flag: string }[]
}

export function AddPropertyDialog({ onAdd, getAll }: AddPropertyDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [newProperty, setNewProperty] = useState<Partial<Property>>({
        name: "",
        category: "",
        location: "",
        countryValue: "",
        price: 0,
        bedrooms: 1,
        bathrooms: 1,
        guestCount: 1,
        image: "", // Thêm image vào state
        description: "",
    })

    const handleAdd = () => {
        onAdd(newProperty)
        setIsOpen(false)
        setNewProperty({
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
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600">
                    <Plus className="h-4 w-4" />
                    Add Property
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                    <DialogDescription>Fill in the details to add a new property listing.</DialogDescription>
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
                            <Label htmlFor="name">Property Name</Label>
                            <Input
                                id="name"
                                value={newProperty.name}
                                onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
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
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={newProperty.location}
                                onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
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
                            <Label htmlFor="price">Price per night ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={newProperty.price?.toString()}
                                onChange={(e) => setNewProperty({ ...newProperty, price: Number.parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bedrooms">Bedrooms</Label>
                            <Input
                                id="bedrooms"
                                type="number"
                                value={newProperty.bedrooms?.toString()}
                                onChange={(e) => setNewProperty({ ...newProperty, bedrooms: Number.parseInt(e.target.value) || 1 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bathrooms">Bathrooms</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                value={newProperty.bathrooms?.toString()}
                                onChange={(e) => setNewProperty({ ...newProperty, bathrooms: Number.parseInt(e.target.value) || 1 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="guestCount">Guests</Label>
                            <Input
                                id="guestCount"
                                type="number"
                                value={newProperty.guestCount?.toString()}
                                onChange={(e) => setNewProperty({ ...newProperty, guestCount: Number.parseInt(e.target.value) || 1 })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={newProperty.description}
                            onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} className="bg-rose-500 hover:bg-rose-600">
                        Add Property
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}