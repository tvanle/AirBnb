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
    onView(property);
  };

  const handleEdit = (property: Property) => {
    onEdit(property);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  // Table style, Airbnb-inspired, responsive, with subtle hover and shadow
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 shadow bg-white">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Image</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Price</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Country</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Bedrooms</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Bathrooms</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Guests</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-neutral-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {properties.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-6 py-8 text-center text-neutral-400">No properties found.</td>
            </tr>
          ) : (
            properties.map((property) => {
              const country = getByValue(property.countryValue);
              return (
                <tr key={property.id} className="hover:bg-neutral-50 transition group">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.name}
                      className="h-14 w-20 object-cover rounded-lg border border-neutral-200 shadow-sm group-hover:scale-105 transition"
                    />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap font-medium text-neutral-900">{property.name}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      {/* Category icon and label on one line */}
                      {property.category && (() => {
                        // @ts-ignore
                        const Icon = require("@/components/admin/category-icon").categories.find(c => c.label === property.category)?.icon;
                        return (
                          <>
                            {Icon && <Icon size={18} className="text-rose-500" />}
                            <span>{property.category}</span>
                          </>
                        );
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-neutral-700">${property.price}/night</td>
                  <td className="px-6 py-3 whitespace-nowrap flex items-center gap-2">
                    {country?.flag && <span>{country.flag}</span>}
                    <span>{country?.label}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-neutral-700">{property.bedrooms}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-neutral-700">{property.bathrooms}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-neutral-700">{property.guestCount}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="px-3 py-1 rounded-full text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition"
                        onClick={() => handleView(property)}
                        title="View"
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 rounded-full text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition"
                        onClick={() => handleEdit(property)}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-full text-sm font-semibold text-white bg-neutral-400 hover:bg-neutral-600 transition"
                        onClick={() => handleDelete(property.id)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
