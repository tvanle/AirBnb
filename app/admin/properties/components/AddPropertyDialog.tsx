"use client"

import { Plus } from "lucide-react"
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

interface AddPropertyDialogProps {
  onAdd: (property: Partial<Property>) => void
  getAll: () => { value: string; label: string; flag: string }[]
  isOpen: boolean // Thêm prop isOpen từ PropertiesPage
  setIsOpen: (isOpen: boolean) => void // Thêm prop để cập nhật state từ parent
}

export function AddPropertyDialog({ onAdd, getAll, isOpen, setIsOpen }: AddPropertyDialogProps) {
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
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

  const setCustomValue = (id: keyof Property, value: any) => {
    setNewProperty((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAdd = () => {
    console.log("Adding property:", newProperty);
    onAdd(newProperty);
    setIsOpen(false);
    setNewProperty({
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
            <Label htmlFor="name">Property Name</Label>
            <Input
                id="name"
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
            <Label htmlFor="price">Price per night ($)</Label>
            <Input
                id="price"
                type="number"
                value={newProperty.price?.toString()}
                onChange={(e) => setCustomValue("price", Number.parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
                id="bedrooms"
                type="number"
                value={newProperty.bedrooms?.toString()}
                onChange={(e) => setCustomValue("bedrooms", Number.parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
                id="bathrooms"
                type="number"
                value={newProperty.bathrooms?.toString()}
                onChange={(e) => setCustomValue("bathrooms", Number.parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="guestCount">Guests</Label>
            <Input
                id="guestCount"
                type="number"
                value={newProperty.guestCount?.toString()}
                onChange={(e) => setCustomValue("guestCount", Number.parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
              id="description"
              value={newProperty.description}
              onChange={(e) => setCustomValue("description", e.target.value)}
              rows={4}
          />
        </div>
      </div>
  );

  return (
      <>
        <Button
            outline
            label="Add Property"
            onClick={() => setIsOpen(true)}
        />
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSubmit={handleAdd}
            title="Add New Property"
            body={bodyContent}
            actionLabel="Add Property"
        />
      </>
  );
}