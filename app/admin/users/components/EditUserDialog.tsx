﻿"use client"

import { useState } from "react" // Đảm bảo import useState
import { Button } from "@/components/admin/ui/button"
import Modal from "@/components/models/Modal"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import Select, { SingleValue } from "react-select"
import { User } from "../data/users"

interface EditUserDialogProps {
    user: User | null
    onUpdate: (user: Partial<User>) => void
    onClose: () => void
    isOpen: boolean
}

export function EditUserDialog({ user, onUpdate, onClose, isOpen }: EditUserDialogProps) {
    console.log("EditUserDialog render - isOpen:", isOpen, "user:", user);

    const [updatedUser, setUpdatedUser] = useState<Partial<User>>(user || {
        email: "",
        name: "",
        role: "USER",
        hashedPassword: "",
    });

    if (!user) return null;

    const setCustomValue = (id: keyof User, value: any) => {
        setUpdatedUser((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleClose = () => {
        console.log("Closing EditUserDialog");
        onClose();
    };

    const handleUpdate = () => {
        console.log("Updating user:", updatedUser);
        onUpdate(updatedUser);
        handleClose();
    };

    const roleOptions = [
        { value: "ADMIN", label: "Admin" },
        { value: "USER", label: "User" },
    ];

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                    id="edit-email"
                    value={updatedUser.email || ""}
                    onChange={(e) => setCustomValue("email", e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                    id="edit-name"
                    value={updatedUser.name || ""}
                    onChange={(e) => setCustomValue("name", e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="edit-password">Password (leave blank to keep unchanged)</Label>
                <Input
                    id="edit-password"
                    type="password"
                    value={updatedUser.hashedPassword || ""}
                    onChange={(e) => setCustomValue("hashedPassword", e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label>Role</Label>
                <Select
                    options={roleOptions}
                    value={roleOptions.find((option) => option.value === updatedUser.role) || null}
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
                onClick={handleClose}
            >
                Close
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleUpdate}
            title="Edit User"
            body={bodyContent}
            footer={footerContent}
            actionLabel="Update User"
        />
    );
}