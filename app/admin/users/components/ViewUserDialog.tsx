"use client"

import Button from "@/components/Button"
import Modal from "@/components/models/Modal"
import { User } from "../data/users"

interface ViewUserDialogProps {
    user: User | null
    onClose: () => void
    onEdit: (user: User) => void
    isOpen: boolean
}

export function ViewUserDialog({ user, onClose, onEdit, isOpen }: ViewUserDialogProps) {
    console.log("ViewUserDialog render - isOpen:", isOpen, "user:", user);

    if (!user) return null;

    const handleClose = () => {
        console.log("Closing ViewUserDialog");
        onClose();
    };

    const handleEdit = () => {
        console.log("Editing from ViewUserDialog for user:", user.id);
        onEdit(user);
        handleClose();
    };

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <div className="grid gap-2">
                <div className="text-sm font-semibold">Email</div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="grid gap-2">
                <div className="text-sm font-semibold">Name</div>
                <p className="text-sm text-muted-foreground">{user.name || "Unnamed User"}</p>
            </div>
            <div className="grid gap-2">
                <div className="text-sm font-semibold">Role</div>
                <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
            <div className="grid gap-2">
                <div className="text-sm font-semibold">Created At</div>
                <p className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    );

    const footerContent = (
        <div className="flex flex-row items-center gap-4 w-full">
            <Button outline label="Close" onClick={handleClose} />
            <Button label="Edit" onClick={handleEdit} />
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleEdit}
            title={user.name || "Unnamed User"}
            body={bodyContent}
            footer={footerContent}
            actionLabel="Edit"
        />
    );
}