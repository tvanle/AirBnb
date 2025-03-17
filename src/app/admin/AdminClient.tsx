"use client";

import React, {useState} from "react";
import { useRouter } from "next/navigation";
import { HotelIcon as Airbnb, Search, Bell, User } from "lucide-react";
import UserManagement from "./AdminUserManagement";
import CustomerManagement from "./AdminCustomerManagement";
import { SafeUser } from "../../../type";

type AdminClientProps = {
    users: SafeUser[];
    currentUser?: SafeUser | null;
};

const AdminClient: React.FC<AdminClientProps> = ({ users, currentUser }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("users"); // Mặc định là tab "Quản lý người dùng"

    const handleBackToHome = () => {
        router.push("/"); // Quay lại trang chính
    };

    const handleNavigateToCategory = (tab: string) => {
        setActiveTab(tab); // Chuyển đổi giữa các tab
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <div className="text-rose-500">
                            <Airbnb size={32} />
                        </div>
                        <button
                            onClick={handleBackToHome}
                            className="ml-4 text-gray-600 hover:text-gray-900"
                        >
                            Back to Home
                        </button>
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
                            <div
                                className={`flex items-center gap-3 p-3 text-gray-700 rounded-md cursor-pointer ${
                                    activeTab === "users" ? "bg-gray-100" : "hover:bg-gray-100"
                                }`}
                                onClick={() => handleNavigateToCategory("users")}
                            >
                                <User size={20} />
                                <span className="font-medium">Quản lý người dùng</span>
                            </div>
                            <div
                                className={`flex items-center gap-3 p-3 text-gray-700 rounded-md cursor-pointer ${
                                    activeTab === "customers" ? "bg-gray-100" : "hover:bg-gray-100"
                                }`}
                                onClick={() => handleNavigateToCategory("customers")}
                            >
                                <User size={20} />
                                <span>Khách hàng</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="ml-64 flex-1 p-8">
                    {activeTab === "users" && (
                        <UserManagement users={users} currentUser={currentUser} />
                    )}
                    {activeTab === "customers" && (
                        <CustomerManagement users={users} currentUser={currentUser} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminClient;