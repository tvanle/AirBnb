"use client"

import { User } from "../data/users"
import { UserCard } from "./UserCard"

interface UserListProps {
    users: User[]
    onView: (user: User) => void
    onEdit: (user: User) => void
    onDelete: (id: string) => void
}

export function UserList({ users, onView, onEdit, onDelete }: UserListProps) {
    const handleView = (user: User) => {
        console.log("UserList onView called for user:", user.id);
        onView(user);
    };

    const handleEdit = (user: User) => {
        console.log("UserList onEdit called for user:", user.id);
        onEdit(user);
    };

    const handleDelete = (id: string) => {
        console.log("UserList onDelete called for user:", id);
        onDelete(id);
    };

    return (
        <div className="space-y-4">
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                users.map((user) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </div>
    );
}