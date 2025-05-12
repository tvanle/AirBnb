"use client"

import { useState } from "react" // Đảm bảo import useState
import { Plus } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import Modal from "@/components/models/Modal"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import Select, { SingleValue } from "react-select"
import { User } from "../data/users"

interface AddUserDialogProps {
    onAdd: (user: Partial<User>) => void
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export function AddUserDialog({ onAdd, isOpen, setIsOpen }: AddUserDialogProps) {
    const [newUser, setNewUser] = useState<Partial<User>>({
        email: "",
        name: "",
        role: "USER",
        hashedPassword: "",
    });

    const setCustomValue = (id: keyof User, value: any) => {
        setNewUser((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleAdd = () => {
        console.log("Adding user:", newUser);
        onAdd(newUser);
        setIsOpen(false);
        setNewUser({
            email: "",
            name: "",
            role: "USER",
            hashedPassword: "",
        });
    };

    const roleOptions = [
        { value: "ADMIN", label: "Admin" },
        { value: "USER", label: "User" },
    ];

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    value={newUser.email || ""}
                    onChange={(e) => setCustomValue("email", e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={newUser.name || ""}
                    onChange={(e) => setCustomValue("name", e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={newUser.hashedPassword || ""}
                    onChange={(e) => setCustomValue("hashedPassword", e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label>Role</Label>
                <Select
                    options={roleOptions}
                    value={roleOptions.find((option) => option.value === newUser.role) || null}
                    onChange={(option: SingleValue<{ value: string; label: string }>) => {
                        setCustomValue("role", option?.value || "USER");
                    }}
                    placeholder="Select role"
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
    );

    const footerContent = (
        <div className="flex flex-row items-center gap-4 w-full">
            <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
            >
                Close
            </Button>
        </div>
    );

    return (
        <>
            <Button
                variant="default"
                className="bg-rose-500 hover:bg-rose-600"
                onClick={() => setIsOpen(true)}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add User
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleAdd}
                title="Add New User"
                body={bodyContent}
                footer={footerContent}
                actionLabel="Add User"
            />
        </>
    );
}