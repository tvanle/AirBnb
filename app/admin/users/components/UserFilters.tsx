"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/admin/ui/input"
import Select, { SingleValue } from "react-select"

interface UserFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedRole: string | null
    setSelectedRole: (role: string | null) => void
}

export function UserFilters({
                                searchTerm,
                                setSearchTerm,
                                selectedRole,
                                setSelectedRole,
                            }: UserFiltersProps) {
    const roleOptions = [
        { value: null, label: "All Roles" },
        { value: "ADMIN", label: "Admin" },
        { value: "USER", label: "User" },
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-10"
                />
            </div>
            <div className="w-full sm:w-48">
                <Select
                    options={roleOptions}
                    value={roleOptions.find((option) => option.value === selectedRole) || roleOptions[0]}
                    onChange={(option: SingleValue<{ value: string | null; label: string }>) => {
                        setSelectedRole(option?.value || null);
                    }}
                    placeholder="Select role"
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
    );
}
