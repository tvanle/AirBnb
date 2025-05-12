"use client"

import { Card, CardContent } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { User } from "../data/users"

interface UserCardProps {
    user: User
    onView: (user: User) => void
    onEdit: (user: User) => void
    onDelete: (id: string) => void
}

export function UserCard({ user, onView, onEdit, onDelete }: UserCardProps) {
    const handleView = () => {
        console.log("View clicked for user:", user.id);
        onView(user);
    };

    const handleEdit = () => {
        console.log("Edit clicked for user:", user.id);
        onEdit(user);
    };

    const handleDelete = () => {
        console.log("Delete clicked for user:", user.id);
        onDelete(user.id);
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                    <div className="font-semibold">{user.name || "Unnamed User"}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                    <div className="text-muted-foreground">Role: {user.role}</div>
                    <div className="text-muted-foreground">Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleView}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        View
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleEdit}
                        className="bg-green-500 hover:bg-green-600 text-white"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}