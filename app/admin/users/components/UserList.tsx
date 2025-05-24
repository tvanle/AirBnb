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
        onView(user);
    };

    const handleEdit = (user: User) => {
        onEdit(user);
    };

    const handleDelete = (id: string) => {
        onDelete(id);
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 shadow bg-white">
            <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-neutral-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-neutral-400">No users found.</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-neutral-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-neutral-700">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-neutral-700">{user.role || "User"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            className="px-3 py-1 rounded-full text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition"
                                            onClick={() => handleView(user)}
                                            title="View"
                                        >
                                            View
                                        </button>
                                        <button
                                            className="px-3 py-1 rounded-full text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition"
                                            onClick={() => handleEdit(user)}
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-3 py-1 rounded-full text-sm font-semibold text-white bg-neutral-400 hover:bg-neutral-600 transition"
                                            onClick={() => handleDelete(user.id)}
                                            title="Delete"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
