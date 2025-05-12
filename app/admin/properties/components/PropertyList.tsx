"use client"

import { Property } from "../data/listings"
import { PropertyCard } from "./PropertyCard"

interface PropertyListProps {
  properties: Property[]
  onView: (property: Property) => void
  onEdit: (property: Property) => void
  onDelete: (id: string) => void
  getByValue: (value: string) => { value: string; label: string; flag: string } | undefined
}

export function PropertyList({ properties, onView, onEdit, onDelete, getByValue }: PropertyListProps) {
  const handleView = (property: Property) => {
    console.log("PropertyList onView called for property:", property.id);
    onView(property);
  };

  const handleEdit = (property: Property) => {
    console.log("PropertyList onEdit called for property:", property.id);
    onEdit(property);
  };

  const handleDelete = (id: string) => {
    console.log("PropertyList onDelete called for property:", id);
    onDelete(id);
  };

  return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.length === 0 ? (
            <p>No properties found.</p>
        ) : (
            properties.map((property) => (
                <PropertyCard
                    key={property.id}
                    property={property}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    getByValue={getByValue}
                />
            ))
        )}
      </div>
  );
}