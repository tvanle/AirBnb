"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import useCountries from "@/hook/useCountries"
import { Property } from "./data/listings"
import { PropertyList } from "./components/PropertyList"
import { PropertyFilters } from "./components/PropertyFilters"
import { AddPropertyDialog } from "./components/AddPropertyDialog"
import { ViewPropertyDialog } from "./components/ViewPropertyDialog"
import { EditPropertyDialog } from "./components/EditPropertyDialog"

export default function PropertiesPage() {
  const router = useRouter();
  const { getAll, getByValue } = useCountries();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/admin/properties");
        console.log("Fetched properties:", response.data);
        setProperties(response.data);
      } catch (error: any) {
        console.error(
            "Failed to fetch listings:",
            error.response?.data || error.message,
        );
        setError(error.response?.data?.error || "Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getByValue(property.countryValue)
            ?.label.toLowerCase()
            .includes(searchTerm.toLowerCase());
    const matchesCategory =
        !selectedCategory || property.category === selectedCategory;
    const matchesCountry =
        !selectedCountry || property.countryValue === selectedCountry;
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const handleAddProperty = async (newProperty: Partial<Property>) => {
    try {
      const response = await axios.post("/api/admin/properties", newProperty);
      console.log("Added property:", response.data);
      setProperties([...properties, response.data]);
    } catch (error: any) {
      console.error(
          "Failed to add listing:",
          error.response?.data || error.message,
      );
    }
  };

  const handleUpdateProperty = async (updatedProperty: Partial<Property>) => {
    if (!selectedProperty) {
      console.error("No selected property to update");
      return;
    }
    try {
      const response = await axios.patch(
          `/api/admin/properties/${selectedProperty.id}`,
          updatedProperty,
      );
      console.log("Updated property:", response.data);
      setProperties(
          properties.map((p) => (p.id === response.data.id ? response.data : p)),
      );
      setIsEditOpen(false);
    } catch (error: any) {
      console.error(
          "Failed to update listing:",
          error.response?.data || error.message,
      );
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await axios.delete(`/api/admin/properties/${id}`);
      console.log("Deleted property:", id);
      setProperties(properties.filter((p) => p.id !== id));
      setIsViewOpen(false);
    } catch (error: any) {
      console.error(
          "Failed to delete listing:",
          error.response?.data || error.message,
      );
    }
  };

  const handleViewProperty = (property: Property) => {
    console.log("handleViewProperty called for property:", property.id);
    setSelectedProperty(property);
    setIsViewOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
            <p className="text-muted-foreground">
              Manage your rental properties and listings
            </p>
          </div>
          <AddPropertyDialog
              onAdd={handleAddProperty}
              getAll={getAll}
              isOpen={isAddOpen}
              setIsOpen={setIsAddOpen}
          />
        </div>

        <PropertyFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            getAll={getAll}
        />

        <PropertyList
            properties={filteredProperties}
            onView={handleViewProperty}
            onEdit={(property) => {
              console.log("Opening EditPropertyDialog for property:", property.id);
              setSelectedProperty(property);
              setIsEditOpen(true);
            }}
            onDelete={handleDeleteProperty}
            getByValue={getByValue}
        />

        <ViewPropertyDialog
            property={selectedProperty}
            onClose={() => setIsViewOpen(false)}
            onEdit={(property) => {
              console.log("Opening EditPropertyDialog from ViewPropertyDialog for property:", property.id);
              setSelectedProperty(property);
              setIsEditOpen(true);
            }}
            getByValue={getByValue}
            isOpen={isViewOpen}
        />

        <EditPropertyDialog
            property={selectedProperty}
            onUpdate={handleUpdateProperty}
            onClose={() => setIsEditOpen(false)}
            getAll={getAll}
            isOpen={isEditOpen}
        />
      </div>
  );
}