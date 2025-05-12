export interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: string;
    emailVerified?: string | null;
    image?: string | null;
    hashedPassword?: string | null; // Đảm bảo trường này được định nghĩa chính xác
    favoriteIds?: string[];
    updatedAt?: string;
}

export async function getUsers(): Promise<User[]> {
    const response = await fetch("/api/admin/users");
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return response.json();
}

export async function addUser(user: Partial<User>): Promise<User> {
    const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error("Failed to add user");
    }
    return response.json();
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...user }),
    });
    if (!response.ok) {
        throw new Error("Failed to update user");
    }
    return response.json();
}

export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete user");
    }
}