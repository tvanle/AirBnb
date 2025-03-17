"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import { HotelIcon as Airbnb, Search, Bell, User } from "lucide-react"
import Heading from "@/app/components/Heading"
import {SafeUser} from "../../../type";


type AdminClientProps = {
    users: SafeUser[]
    currentUser?: SafeUser | null
}

const AdminClient: React.FC<AdminClientProps> = ({ users, currentUser }) => {
    const router = useRouter()
    const [deletingId, setDeletingId] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const onDelete = useCallback(
        (id: string) => {
            setDeletingId(id)

            axios
                .delete(`/api/users/${id}`)
                .then(() => {
                    toast.success("User deleted successfully")
                    router.refresh()
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.error || "Error deleting user")
                })
                .finally(() => {
                    setDeletingId("")
                })
        },
        [router],
    )

    const filteredUsers = users.filter(
        (user : any) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <div className="text-rose-500">
                            <Airbnb size={32} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative rounded-full bg-gray-100 p-2">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="relative rounded-full bg-gray-100 p-2">
                            <Bell className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="relative rounded-full bg-gray-100 p-2">
                            <User className="h-5 w-5 text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar and Main Content */}
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white h-[calc(100vh-64px)] border-r border-gray-200 fixed">
                    <div className="p-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 p-3 text-gray-700 rounded-md bg-gray-100">
                                <User size={20} />
                                <span className="font-medium">Quản lí người dùng</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 text-gray-700 rounded-md hover:bg-gray-100">
                                <User size={20} />
                                <span>Khách hàng</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="ml-64 flex-1 p-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 flex items-center justify-between">
                            <Heading title="Quản lí người dùng" subtitle="Manage your system users" />
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">
                                    Xóa
                                </button>
                            </div>
                        </div>

                        {/* User Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-y border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tài khoản
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mật khẩu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        userID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tình trạng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">•••••</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id.substring(0, 3)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Hoạt động
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => onDelete(user.id)}
                                                disabled={deletingId === user.id}
                                                className="text-gray-400 hover:text-gray-700"
                                            >
                                                •••
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <a
                                    href="#"
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </a>
                                <a
                                    href="#"
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Next
                                </a>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                                        <span className="font-medium">{users.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <a
                                            href="#"
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </a>
                                        <a
                                            href="#"
                                            aria-current="page"
                                            className="z-10 bg-rose-50 border-rose-500 text-rose-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                        >
                                            1
                                        </a>
                                        <a
                                            href="#"
                                            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                        >
                                            2
                                        </a>
                                        <a
                                            href="#"
                                            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                        >
                                            3
                                        </a>
                                        <a
                                            href="#"
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminClient

