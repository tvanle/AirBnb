"use client"

import { DialogTrigger } from "@/components/admin/ui/dialog"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar"
import { Badge } from "@/components/admin/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"

interface UserData {
  id: string
  name: string
  email: string
  role: "admin" | "host" | "guest"
  status: "active" | "inactive"
  joinDate: string
  bookings: number
  avatar?: string
  phone?: string
  address?: string
}

const users: UserData[] = [
  {
    id: "U001",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "host",
    status: "active",
    joinDate: "2022-03-15",
    bookings: 12,
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Miami, FL",
  },
  {
    id: "U002",
    name: "Michael Chen",
    email: "m.chen@example.com",
    role: "guest",
    status: "active",
    joinDate: "2022-05-22",
    bookings: 8,
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, San Francisco, CA",
  },
  {
    id: "U003",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    role: "guest",
    status: "active",
    joinDate: "2022-07-10",
    bookings: 5,
    phone: "+1 (555) 456-7890",
    address: "789 Pine St, New York, NY",
  },
  {
    id: "U004",
    name: "James Rodriguez",
    email: "james.r@example.com",
    role: "host",
    status: "inactive",
    joinDate: "2022-01-05",
    bookings: 20,
    phone: "+1 (555) 234-5678",
    address: "321 Elm St, Chicago, IL",
  },
  {
    id: "U005",
    name: "Alex Thompson",
    email: "alex.t@example.com",
    role: "admin",
    status: "active",
    joinDate: "2021-11-18",
    bookings: 0,
    phone: "+1 (555) 876-5432",
    address: "654 Maple Dr, Seattle, WA",
  },
  {
    id: "U006",
    name: "Lisa Wang",
    email: "lisa.w@example.com",
    role: "guest",
    status: "active",
    joinDate: "2022-09-30",
    bookings: 3,
    phone: "+1 (555) 345-6789",
    address: "987 Cedar Ln, Austin, TX",
  },
]

const roleStyles = {
  admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  host: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  guest: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

const statusStyles = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isViewUserOpen, setIsViewUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [newUser, setNewUser] = useState<Partial<UserData>>({
    name: "",
    email: "",
    role: "guest",
    status: "active",
    phone: "",
    address: "",
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = !selectedRole || user.role === selectedRole

    return matchesSearch && matchesRole
  })

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user)
    setIsViewUserOpen(true)
  }

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      address: user.address,
    })
    setIsEditUserOpen(true)
  }

  const handleAddUser = () => {
    // In a real app, this would add the user to the database
    console.log("Adding new user:", newUser)
    setIsAddUserOpen(false)
    setNewUser({
      name: "",
      email: "",
      role: "guest",
      status: "active",
      phone: "",
      address: "",
    })
  }

  const handleUpdateUser = () => {
    // In a real app, this would update the user in the database
    console.log("Updating user:", selectedUser?.id, newUser)
    setIsEditUserOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage your users, hosts, and guests</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Fill in the details to add a new user to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "admin" | "host" | "guest") => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newUser.status}
                    onValueChange={(value: "active" | "inactive") => setNewUser({ ...newUser, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={selectedRole || "all"}
            onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="host">Host</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in your system</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleStyles[user.role]}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[user.status]}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>{user.bookings}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Detailed information about {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedUser?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">{selectedUser?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedUser?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Role</h4>
                <Badge variant="outline" className={selectedUser?.role ? roleStyles[selectedUser.role] : ""}>
                  {selectedUser?.role?.charAt(0).toUpperCase() + (selectedUser?.role?.slice(1) || "")}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <Badge variant="outline" className={selectedUser?.status ? statusStyles[selectedUser.status] : ""}>
                  {selectedUser?.status?.charAt(0).toUpperCase() + (selectedUser?.status?.slice(1) || "")}
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Phone</h4>
              <p className="text-sm">{selectedUser?.phone || "Not provided"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Address</h4>
              <p className="text-sm">{selectedUser?.address || "Not provided"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Join Date</h4>
              <p className="text-sm">
                {selectedUser?.joinDate ? new Date(selectedUser.joinDate).toLocaleDateString() : ""}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Bookings</h4>
              <p className="text-sm">{selectedUser?.bookings || 0} bookings</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewUserOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewUserOpen(false)
                if (selectedUser) handleEditUser(selectedUser)
              }}
            >
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the details of {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "host" | "guest") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="host">Host</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={newUser.status}
                  onValueChange={(value: "active" | "inactive") => setNewUser({ ...newUser, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

