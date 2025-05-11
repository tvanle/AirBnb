"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { CategoryIcon, categories } from "@/components/admin/category-icon"

interface PropertyFiltersProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedCategory: string | null
    setSelectedCategory: (value: string | null) => void
    selectedCountry: string | null
    setSelectedCountry: (value: string | null) => void
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
    return (
        <div className="flex flex-col gap-4 items-center justify-center mb-6 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex flex-wrap gap-4 w-full max-w-4xl justify-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search properties..."
                        className="w-full pl-8 border-rose-100 focus-visible:ring-rose-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select
                    value={selectedCategory || "all"}
                    onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
                >
                    <SelectTrigger className="w-full sm:w-48 border-rose-100 focus:ring-rose-200">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
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
                <Select
                    value={selectedCountry || "all"}
                    onValueChange={(value) => setSelectedCountry(value === "all" ? null : value)}
                >
                    <SelectTrigger className="w-full sm:w-48 border-rose-100 focus:ring-rose-200">
                        <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
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
                {(selectedCategory || selectedCountry) && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            setSelectedCategory(null)
                            setSelectedCountry(null)
                        }}
                        className="h-10 w-10 border-rose-100"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear filters</span>
                    </Button>
                )}
            </div>
        </div>
    )
}