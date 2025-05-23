﻿"use client"

import Image from "next/image"
import Modal from "@/components/models/Modal"
import { Badge } from "@/components/admin/ui/badge"
import { CategoryIcon } from "@/components/admin/category-icon"
import { Property } from "../data/listings"
import CountrySelect, { CountrySelectValue } from "@/components/inputs/CountrySelect"

interface ViewPropertyDialogProps {
    property: Property | null
    onClose: () => void
    onEdit: (property: Property) => void
    getByValue: (value: string) => { value: string; label: string; flag: string } | undefined
    isOpen: boolean
}

export function ViewPropertyDialog({ property, onClose, onEdit, getByValue, isOpen }: ViewPropertyDialogProps) {
    console.log("ViewPropertyDialog render - isOpen:", isOpen, "property:", property);

    if (!property) return null;

    const handleClose = () => {
        console.log("Closing ViewPropertyDialog");
        onClose();
    };

    const handleEdit = () => {
        console.log("Editing from ViewPropertyDialog for property:", property.id);
        onEdit(property);
        handleClose();
    };

    // Ánh xạ countryValue thành CountrySelectValue
    const country = getByValue(property.countryValue);
    const countryValue: CountrySelectValue | undefined = country
        ? {
            flag: country.flag,
            label: country.label,
            latlng: [],
            region: "",
            value: country.value,
        }
        : undefined;

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <div className="relative h-64 w-full mb-4">
                <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    fill
                    className="object-cover rounded-md"
                />
            </div>
            <CountrySelect value={countryValue} onChange={() => {}}  />
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
                        {property.bathrooms} {property.bathrooms === 1 ? "bathroom" : "bathrooms"} •{" "}
                        {property.guestCount} {property.guestCount === 1 ? "guest" : "guests"}
                    </div>
                </div>
                <div className="mt-2">
                    <h4 className="text-sm font-semibold mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{property.description}</p>
                </div>
            </div>
        </div>
    );

    const footerContent = (
        <div className="flex flex-row items-center gap-4 w-full">
            <button
                type="button"
                className="px-4 py-2 rounded border border-gray-300 text-sm hover:bg-gray-100 transition"
                onClick={handleClose}
            >
                Close
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleEdit}
            title={property.name}
            body={bodyContent}
            footer={footerContent}
            actionLabel="Edit"
        />
    );
}
