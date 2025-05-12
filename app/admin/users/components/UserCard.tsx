"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/admin/ui/card"
import Button from "@/components/Button"
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
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{user.name || "Unnamed User"}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            outline
                            label="View"
                            small
                            onClick={handleView}
                        />
                        <Button
                            outline
                            label="Edit"
                            small
                            onClick={handleEdit}
                        />
                        <Button
                            outline
                            label="Delete"
                            small
                            onClick={handleDelete}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex justify-between text-sm">
                    <div>Role: {user.role}</div>
                    <div>Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
            </CardContent>
        </Card>
    );
}