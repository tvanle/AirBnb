"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/admin/ui/input"
import Select, { SingleValue } from "react-select"
import { categories } from "@/components/admin/category-icon"

interface PropertyFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedCountry: string | null
  setSelectedCountry: (country: string | null) => void
  getAll: () => { value: string; label: string; flag: string }[]
}

export function PropertyFilters({
                                  searchTerm,
                                  setSearchTerm,
                                  selectedCategory,
                                  setSelectedCategory,
                                  selectedCountry,
                                  setSelectedCountry,
                                  getAll,
                                }: PropertyFiltersProps) {
  const categoryOptions = [
    { value: null, label: "All Categories" },
    ...categories.map((category) => ({
      value: category.label,
      label: category.label,
      icon: category.icon,
    })),
  ];

  const countryOptions = [
    { value: null, label: "All Countries" },
    ...getAll().map((country) => ({
      value: country.value,
      label: country.label,
      flag: country.flag,
    })),
  ];

  return (
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-10"
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-40">
            <Select
                options={categoryOptions}
                value={categoryOptions.find((option) => option.value === selectedCategory) || categoryOptions[0]}
                onChange={(option: SingleValue<{ value: string | null; label: string; icon?: React.ElementType }>) => {
                  setSelectedCategory(option?.value || null);
                }}
                formatOptionLabel={(option: { value: string | null; label: string; icon?: React.ElementType }) => {
                  if (option.value === null) {
                    return <span>{option.label}</span>;
                  }
                  const Icon = option.icon;
                  return (
                      <div className="flex items-center gap-2">
                        {Icon && <Icon size={20} />}
                        <span>{option.label}</span>
                      </div>
                  );
                }}
                placeholder="Select category"
                classNames={{
                  control: () => "p-2 min-h-[40px] border-2",
                  input: () => "text-base",
                  option: () => "text-base",
                }}
                theme={(theme: any) => ({
                  ...theme,
                  borderRadius: 6,
                  spacing: {
                    ...theme.spacing,
                    controlHeight: 40,
                    baseUnit: 2,
                  },
                  colors: {
                    ...theme.colors,
                    primary: "black",
                    primary25: "#ffe4e6",
                  },
                })}
            />
          </div>
          <div className="w-full sm:w-40">
            <Select
                options={countryOptions}
                value={countryOptions.find((option) => option.value === selectedCountry) || countryOptions[0]}
                onChange={(option: SingleValue<{ value: string | null; label: string; flag?: string }>) => {
                  setSelectedCountry(option?.value || null);
                }}
                formatOptionLabel={(option: { value: string | null; label: string; flag?: string }) => {
                  if (option.value === null) {
                    return <span>{option.label}</span>;
                  }
                  return (
                      <div className="flex items-center gap-2">
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                      </div>
                  );
                }}
                placeholder="Select country"
                classNames={{
                  control: () => "p-2 min-h-[40px] border-2",
                  input: () => "text-base",
                  option: () => "text-base",
                }}
                theme={(theme: any) => ({
                  ...theme,
                  borderRadius: 6,
                  spacing: {
                    ...theme.spacing,
                    controlHeight: 40,
                    baseUnit: 2,
                  },
                  colors: {
                    ...theme.colors,
                    primary: "black",
                    primary25: "#ffe4e6",
                  },
                })}
            />
          </div>
        </div>
      </div>
  );
}
