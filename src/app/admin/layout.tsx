import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Admin panel for managing users",
};

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gray-50">
        {children} {/* Chỉ render nội dung của trang admin */}
        </body>
        </html>
    );
}