"use client"

import { Plus } from "lucide-react"
import Button from "@/components/Button"
import Modal from "@/components/models/Modal"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import Select, { SingleValue } from "react-select"
import { User } from "../data/users"
import {useState} from "react";

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
                    value={newUser.email}
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

    return (
        <>
            <Button
                outline
                label="Add User"
                onClick={() => setIsOpen(true)}
            />
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleAdd}
                title="Add New User"
                body={bodyContent}
                actionLabel="Add User"
            />
        </>
    );
}