import React from "react";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptySate";
import AdminClient from "./AdminClient";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getAllUsers from "@/app/actions/getAllUsers";

const AdminPage = async () => {
    const currentUser = await getCurrentUser();

    // Check if user is authenticated and is an admin
    // if (!currentUser || currentUser.role !== "admin") {
    //     return (
    //         <ClientOnly>
    //             <EmptyState
    //                 title="Unauthorized"
    //                 subtitle="Please login with admin credentials"
    //             />
    //         </ClientOnly>
    //     );
    // }

    // Fetch all users
    const users = await getAllUsers();

    if (users.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No users found"
                    subtitle="There are no users in the system."
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <AdminClient users={users} currentUser={currentUser} />
        </ClientOnly>
    );
};

export default AdminPage;
