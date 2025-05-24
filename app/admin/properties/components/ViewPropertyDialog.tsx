"use client"

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
        <div className="flex flex-col gap-6">
            <div className="relative h-64 w-full mb-2 rounded-xl overflow-hidden shadow border border-neutral-100">
                <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-wrap gap-3 items-center mb-2">
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-base">
                    <CategoryIcon category={property.category} />
                    {property.category}
                </Badge>
                {property.countryValue && (
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-base">
                        {getByValue(property.countryValue)?.flag}
                        {getByValue(property.countryValue)?.label}
                    </Badge>
                )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-2">
                <div className="text-lg font-semibold text-rose-500">${property.price} <span className="font-normal text-neutral-500">/night</span></div>
                <div className="flex gap-4 text-neutral-700">
                    <span>{property.bedrooms} bd</span>
                    <span>{property.bathrooms} ba</span>
                    <span>{property.guestCount} guests</span>
                </div>
            </div>
            <div className="mt-2">
                <h4 className="text-base font-semibold mb-1">Description</h4>
                <p className="text-sm text-neutral-600">{property.description}</p>
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
