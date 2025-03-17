import ClientOnly from "@/app/components/ClientOnly";
// import EmptyState from "@/app/components/EmptyState";
import React from "react";
import getCurrentUser from "../actions/getCurrentUser";
import getReservation from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";
import EmptyState from "@/app/components/EmptySate";

type Props = {};

const ReservationsPage = async (props: Props) => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState title="Unauthorized" subtitle="Please login" />
            </ClientOnly>
        );
    }

    const reservations = await getReservation({
        authorId: currentUser.id,
    });

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No Reservation found"
                    subtitle="Looks like you have no reservations on your properties."
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <ReservationsClient
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
};

export default ReservationsPage;
