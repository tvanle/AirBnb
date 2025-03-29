"use client"

import { useState } from "react"
import Image from "next/image"
import { Building2, Edit, MoreHorizontal, Plus, Search, Trash, X } from "lucide-react"

import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Badge } from "@/components/admin/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/admin/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { categories, CategoryIcon } from "@/components/admin/category-icon"
import useCountries from "@/hook/useCountries"
import {useRouter} from "next/navigation";

interface Property {
  id: string
  name: string
  category: string
  location: string
  countryValue: string
  price: number
  bedrooms: number
  bathrooms: number
  status: "active" | "pending" | "maintenance"
  image: string
  description: string
}

const properties: Property[] = [
  {
    id: "P001",
    name: "Oceanfront Villa",
    category: "Beach",
    location: "Miami, FL",
    countryValue: "US",
    price: 350,
    bedrooms: 4,
    bathrooms: 3,
    status: "active",
    image: "/placeholder.svg",
    description: "Beautiful oceanfront villa with stunning views of the Atlantic Ocean. Perfect for family vacations.",
  },
  {
    id: "P002",
    name: "Mountain Retreat",
    category: "Countryside",
    location: "Aspen, CO",
    countryValue: "US",
    price: 280,
    bedrooms: 3,
    bathrooms: 2,
    status: "active",
    image: "/placeholder.svg",
    description: "Cozy mountain retreat surrounded by nature. Great for hiking and outdoor activities.",
  },
  {
    id: "P003",
    name: "Modern Downtown Loft",
    category: "Modern",
    location: "New York, NY",
    countryValue: "US",
    price: 200,
    bedrooms: 1,
    bathrooms: 1,
    status: "pending",
    image: "/placeholder.svg",
    description: "Sleek and modern loft in the heart of downtown. Walking distance to restaurants and attractions.",
  },
  {
    id: "P004",
    name: "Beachside Cottage",
    category: "Beach",
    location: "Malibu, CA",
    countryValue: "US",
    price: 320,
    bedrooms: 2,
    bathrooms: 2,
    status: "active",
    image: "/placeholder.svg",
    description: "Charming cottage just steps from the beach. Perfect for a romantic getaway.",
  },
  {
    id: "P005",
    name: "Luxury Penthouse",
    category: "Lux",
    location: "London",
    countryValue: "GB",
    price: 450,
    bedrooms: 3,
    bathrooms: 3,
    status: "maintenance",
    image: "/placeholder.svg",
    description: "Luxurious penthouse with panoramic city views. Features high-end finishes and amenities.",
  },
  {
    id: "P006",
    name: "Countryside Farmhouse",
    category: "Barns",
    location: "Tuscany",
    countryValue: "IT",
    price: 275,
    bedrooms: 4,
    bathrooms: 2,
    status: "active",
    image: "/placeholder.svg",
    description: "Rustic farmhouse with modern amenities. Situated on 5 acres of beautiful countryside.",
  },
  {
    id: "P007",
    name: "Lakefront Cabin",
    category: "Lake",
    location: "Lake Tahoe, CA",
    countryValue: "US",
    price: 310,
    bedrooms: 3,
    bathrooms: 2,
    status: "active",
    image: "/placeholder.svg",
    description: "Cozy cabin with direct lake access. Perfect for fishing and water activities.",
  },
  {
    id: "P008",
    name: "Desert Oasis",
    category: "Desert",
    location: "Dubai",
    countryValue: "AE",
    price: 290,
    bedrooms: 3,
    bathrooms: 2,
    status: "active",
    image: "/placeholder.svg",
    description: "Modern home in the desert with a private pool and stunning sunset views.",
  },
]

const statusStyles = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  maintenance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export default function PropertiesPage() {
  const router = useRouter()
  const { getAll, getByValue } = useCountries()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false)
  const [isViewPropertyOpen, setIsViewPropertyOpen] = useState(false)
  const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    name: "",
    category: "",
    location: "",
    countryValue: "",
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    status: "pending",
    description: "",
  })

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getByValue(property.countryValue)?.label.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !selectedCategory || property.category === selectedCategory
    const matchesCountry = !selectedCountry || property.countryValue === selectedCountry

    return matchesSearch && matchesCategory && matchesCountry
  })

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property)
    setIsViewPropertyOpen(true)
  }

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property)
    setNewProperty({
      name: property.name,
      category: property.category,
      location: property.location,
      countryValue: property.countryValue,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      status: property.status,
      description: property.description,
    })
    setIsEditPropertyOpen(true)
  }

  const handleAddProperty = () => {
    // In a real app, this would add the property to the database
    console.log("Adding new property:", newProperty)
    setIsAddPropertyOpen(false)
    setNewProperty({
      name: "",
      category: "",
      location: "",
      countryValue: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      status: "pending",
      description: "",
    })
  }

  const handleUpdateProperty = () => {
    // In a real app, this would update the property in the database
    console.log("Updating property:", selectedProperty?.id, newProperty)
    setIsEditPropertyOpen(false)
  }

  return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
            <p className="text-muted-foreground">Manage your rental properties and listings</p>
          </div>
          <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
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
                <div className="grid grid-cols-3 gap-4">
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
                        onChange={(e) =>
                            setNewProperty({ ...newProperty, bathrooms: Number.parseInt(e.target.value) || 1 })
                        }
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
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                      value={newProperty.status}
                      onValueChange={(value: "active" | "pending" | "maintenance") =>
                          setNewProperty({ ...newProperty, status: value })
                      }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPropertyOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProperty} className="bg-rose-500 hover:bg-rose-600">
                  Add Property
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
          <Tabs defaultValue="all" className="w-full max-w-4xl">
            <TabsList className="bg-rose-50">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-white">
                Active
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-white">
                Pending
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-white">
                Maintenance
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
              <PropertyCard
                  key={property.id}
                  property={property}
                  onView={handleViewProperty}
                  onEdit={handleEditProperty}
                  getByValue={getByValue}
              />
          ))}
        </div>

        {/* View Property Dialog */}
        <Dialog open={isViewPropertyOpen} onOpenChange={setIsViewPropertyOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedProperty?.name}</DialogTitle>
              <DialogDescription>
                {selectedProperty?.location},{" "}
                {selectedProperty?.countryValue ? getByValue(selectedProperty.countryValue)?.label : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="relative h-64 w-full mb-4">
              <Image
                  src={selectedProperty?.image || "/placeholder.svg"}
                  alt={selectedProperty?.name || "Property"}
                  fill
                  className="object-cover rounded-md"
              />
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                    variant="outline"
                    className={selectedProperty?.status ? statusStyles[selectedProperty.status] : ""}
                >
                  {selectedProperty?.status?.charAt(0).toUpperCase() + (selectedProperty?.status?.slice(1) || "")}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <CategoryIcon category={selectedProperty?.category || ""} />
                  {selectedProperty?.category}
                </Badge>
                {selectedProperty?.countryValue && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getByValue(selectedProperty.countryValue)?.flag}
                      {getByValue(selectedProperty.countryValue)?.label}
                    </Badge>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <div>${selectedProperty?.price}/night</div>
                <div>
                  {selectedProperty?.bedrooms} {selectedProperty?.bedrooms === 1 ? "bedroom" : "bedrooms"} •{" "}
                  {selectedProperty?.bathrooms} {selectedProperty?.bathrooms === 1 ? "bathroom" : "bathrooms"}
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-semibold mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedProperty?.description}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewPropertyOpen(false)}>
                Close
              </Button>
              <Button
                  onClick={() => {
                    setIsViewPropertyOpen(false)
                    if (selectedProperty) handleEditProperty(selectedProperty)
                  }}
                  className="bg-rose-500 hover:bg-rose-600"
              >
                Edit Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Property Dialog */}
        <Dialog open={isEditPropertyOpen} onOpenChange={setIsEditPropertyOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
              <DialogDescription>Update the details of {selectedProperty?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Property Name</Label>
                  <Input
                      id="edit-name"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
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
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                      id="edit-location"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-country">Country</Label>
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
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price per night ($)</Label>
                  <Input
                      id="edit-price"
                      type="number"
                      value={newProperty.price?.toString()}
                      onChange={(e) => setNewProperty({ ...newProperty, price: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                  <Input
                      id="edit-bedrooms"
                      type="number"
                      value={newProperty.bedrooms?.toString()}
                      onChange={(e) => setNewProperty({ ...newProperty, bedrooms: Number.parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                  <Input
                      id="edit-bathrooms"
                      type="number"
                      value={newProperty.bathrooms?.toString()}
                      onChange={(e) => setNewProperty({ ...newProperty, bathrooms: Number.parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                    id="edit-description"
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                    rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                    value={newProperty.status}
                    onValueChange={(value: "active" | "pending" | "maintenance") =>
                        setNewProperty({ ...newProperty, status: value })
                    }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditPropertyOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProperty} className="bg-rose-500 hover:bg-rose-600">
                Update Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

function PropertyCard({
                        property,
                        onView,
                        onEdit,
                        getByValue,
                      }: {
  property: Property
  onView: (property: Property) => void
  onEdit: (property: Property) => void
  getByValue: (value: string) => { value: string; label: string; flag: string } | undefined
}) {
  const country = getByValue(property.countryValue)

  return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="relative h-48 w-full">
          <Image src={property.image || "/placeholder.svg"} alt={property.name} fill className="object-cover" />
          <Badge variant="outline" className={`absolute top-2 right-2 ${statusStyles[property.status]}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{property.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                {country?.flag} {property.location}, {country?.label}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView(property)}>
                  <Building2 className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(property)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CategoryIcon category={property.category} />
              {property.category}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <div className="font-medium text-rose-500">${property.price}/night</div>
            <div>
              {property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"} • {property.bathrooms}{" "}
              {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" className="w-full hover:bg-rose-50 border-rose-100" onClick={() => onView(property)}>
            View Details
          </Button>
        </CardFooter>
      </Card>
  )
}