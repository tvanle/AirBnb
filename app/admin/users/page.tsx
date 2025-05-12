"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User } from "./data/users"
import { UserList } from "./components/UserList"
import { UserFilters } from "./components/UserFilters"
import { AddUserDialog } from "./components/AddUserDialog"
import { ViewUserDialog } from "./components/ViewUserDialog"
import { EditUserDialog } from "./components/EditUserDialog"
import { addUser, getUsers, updateUser, deleteUser } from "./data/users"

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error: any) {
        console.error("Failed to fetch users:", error.message);
        setError(error.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (newUser: Partial<User>) => {
    try {
      const response = await addUser(newUser);
      console.log("Added user:", response);
      setUsers([...users, response]);
    } catch (error: any) {
      console.error("Failed to add user:", error.message);
    }
  };

  const handleUpdateUser = async (updatedUser: Partial<User>) => {
    if (!selectedUser) {
      console.error("No selected user to update");
      return;
    }
    try {
      const response = await updateUser(selectedUser.id, updatedUser);
      console.log("Updated user:", response);
      setUsers(users.map((u) => (u.id === response.id ? response : u)));
      setIsEditOpen(false);
    } catch (error: any) {
      console.error("Failed to update user:", error.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      console.log("Deleted user:", id);
      setUsers(users.filter((u) => u.id !== id));
      setIsViewOpen(false);
    } catch (error: any) {
      console.error("Failed to delete user:", error.message);
    }
  };

  const handleViewUser = (user: User) => {
    console.log("handleViewUser called for user:", user.id);
    setSelectedUser(user);
    setIsViewOpen(true);
    setIsEditOpen(false); // Đóng EditUserDialog khi mở ViewUserDialog
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles
            </p>
          </div>
          <AddUserDialog
              onAdd={handleAddUser}
              isOpen={isAddOpen}
              setIsOpen={setIsAddOpen}
          />
        </div>

        <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
        />

        <UserList
            users={filteredUsers}
            onView={handleViewUser}
            onEdit={(user) => {
              console.log("Opening EditUserDialog for user:", user.id);
              setSelectedUser(user);
              setIsEditOpen(true);
              setIsViewOpen(false); // Đóng ViewUserDialog khi mở EditUserDialog
            }}
            onDelete={handleDeleteUser}
        />

        <ViewUserDialog
            user={selectedUser}
            onClose={() => setIsViewOpen(false)}
            onEdit={(user) => {
              console.log("Opening EditUserDialog from ViewUserDialog for user:", user.id);
              setSelectedUser(user);
              setIsEditOpen(true);
              setIsViewOpen(false); // Đóng ViewUserDialog khi mở EditUserDialog
            }}
            isOpen={isViewOpen}
        />

        <EditUserDialog
            user={selectedUser}
            onUpdate={handleUpdateUser}
            onClose={() => setIsEditOpen(false)}
            isOpen={isEditOpen}
        />
      </div>
  );
}