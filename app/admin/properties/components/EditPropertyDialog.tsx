"use client"

import Button from "@/components/Button"
import Modal from "@/components/models/Modal"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import Select, { SingleValue } from "react-select"
import { categories } from "@/components/admin/category-icon"
import { Property } from "../data/listings"
import ImageUpload from "@/components/inputs/ImageUpload"
import CountrySelect, { CountrySelectValue } from "@/components/inputs/CountrySelect"
import {useState} from "react";

interface EditPropertyDialogProps {
    property: Property | null
    onUpdate: (property: Partial<Property>) => void
    onClose: () => void
    getAll: () => { value: string; label: string; flag: string }[]
    isOpen: boolean // Thêm prop isOpen từ PropertiesPage
}

export function EditPropertyDialog({ property, onUpdate, onClose, getAll, isOpen }: EditPropertyDialogProps) {
    console.log("EditPropertyDialog render - isOpen:", isOpen, "property:", property);

    const [newProperty, setNewProperty] = useState<Partial<Property>>(property || {
        name: "",
        category: "",
        countryValue: "",
        price: 0,
        bedrooms: 1,
        bathrooms: 1,
        guestCount: 1,
        image: "",
        description: "",
    });

    if (!property) return null;

    const setCustomValue = (id: keyof Property, value: any) => {
        setNewProperty((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleClose = () => {
        console.log("Closing EditPropertyDialog");
        onClose();
    };

    const handleUpdate = () => {
        console.log("Updating property:", newProperty);
        onUpdate(newProperty);
        handleClose();
    };

    // Ánh xạ countryValue thành CountrySelectValue
    const country = getAll().find((c) => c.value === newProperty.countryValue);
    const countryValue: CountrySelectValue | undefined = country
        ? {
            flag: country.flag,
            label: country.label,
            latlng: [],
            region: "",
            value: country.value,
        }
        : undefined;

    // Chuẩn bị options cho react-select
    const categoryOptions = categories.map((category) => ({
        value: category.label,
        label: category.label,
        icon: category.icon,
    }));

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <div className="grid gap-2">
                <Label>Image</Label>
                <ImageUpload
                    value={newProperty.image || ""}
                    onChange={(value) => setCustomValue("image", value)}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="edit-name">Property Name</Label>
                    <Input
                        id="edit-name"
                        value={newProperty.name}
                        onChange={(e) => setCustomValue("name", e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select
                        options={categoryOptions}
                        value={categoryOptions.find((option) => option.value === newProperty.category) || null}
                        onChange={(option: SingleValue<{ value: string; label: string; icon: React.ElementType }>) => {
                            setCustomValue("category", option?.value || "");
                        }}
                        formatOptionLabel={(option: { value: string; label: string; icon: React.ElementType }) => {
                            const Icon = option.icon;
                            return (
                                <div className="flex items-center gap-2">
                                    <Icon size={20} />
                                    <span>{option.label}</span>
                                </div>
                            );
                        }}
                        placeholder="Select category"
                        classNames={{
                            control: () => "p-3 border-2",
                            input: () => "text-lg",
                            option: () => "text-lg",
                        }}
                        theme={(theme: any) => ({
                            ...theme,
                            borderRadius: 6,
                            colors: {
                                ...theme.colors,
                                primary: "black",
                                primary25: "#ffe4e6",
                            },
                        })}
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label>Country</Label>
                <CountrySelect
                    value={countryValue}
                    onChange={(value) => setCustomValue("countryValue", value?.value || "")}
                />
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="edit-price">Price per night ($)</Label>
                    <Input
                        id="edit-price"
                        type="number"
                        value={newProperty.price?.toString()}
                        onChange={(e) => setCustomValue("price", Number.parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                    <Input
                        id="edit-bedrooms"
                        type="number"
                        value={newProperty.bedrooms?.toString()}
                        onChange={(e) => setCustomValue("bedrooms", Number.parseInt(e.target.value) || 1)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                    <Input
                        id="edit-bathrooms"
                        type="number"
                        value={newProperty.bathrooms?.toString()}
                        onChange={(e) => setCustomValue("bathrooms", Number.parseInt(e.target.value) || 1)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="edit-guestCount">Guests</Label>
                    <Input
                        id="edit-guestCount"
                        type="number"
                        value={newProperty.guestCount?.toString()}
                        onChange={(e) => setCustomValue("guestCount", Number.parseInt(e.target.value) || 1)}
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                    id="edit-description"
                    value={newProperty.description}
                    onChange={(e) => setCustomValue("description", e.target.value)}
                    rows={4}
                />
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleUpdate}
            title="Edit Property"
            body={bodyContent}
            actionLabel="Update Property"
        />
    );
}