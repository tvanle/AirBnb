"use client"

import { useState, useMemo, useEffect } from "react"
import { ViewBookingDialog } from "./components/ViewBookingDialog"
import { BookingFilters } from "./components/BookingFilters"

interface Booking {
    id: string;
    userId: string;
    userName: string;
    propertyId: string;
    propertyName: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    createdAt: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/admin/bookings');
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesSearch = 
                (booking.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
            return matchesSearch;
        });
    }, [bookings, searchTerm]);

    const handleView = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsViewDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setBookings(bookings.filter(booking => booking.id !== id));
    };

    const handleCloseDialog = () => {
        setIsViewDialogOpen(false);
        setSelectedBooking(null);
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
                <p className="text-muted-foreground mt-2">View and manage customer bookings</p>
            </div>

            <BookingFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="overflow-x-auto rounded-xl border border-neutral-200 shadow bg-white">
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">No.</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Property</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Check-in</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Check-out</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Total Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-neutral-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-neutral-400">No bookings found</td>
                            </tr>
                        ) : (
                            filteredBookings.map((booking, idx) => (
                                <tr key={booking.id} className="hover:bg-neutral-50 transition group">
                                    <td className="px-6 py-3 whitespace-nowrap font-medium text-neutral-900">{idx + 1}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-neutral-700">{booking.userName}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-neutral-700">{booking.propertyName}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-neutral-700">
                                        {new Date(booking.startDate).toLocaleDateString('en-US')}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-neutral-700">
                                        {new Date(booking.endDate).toLocaleDateString('en-US')}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-neutral-700">
                                        ${booking.totalPrice.toLocaleString('en-US')}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                className="px-3 py-1 rounded-full text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition"
                                                onClick={() => handleView(booking)}
                                                title="View"
                                            >
                                                View
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded-full text-sm font-semibold text-rose-600 hover:text-white border border-rose-600 hover:bg-rose-600 transition"
                                                onClick={() => handleDelete(booking.id)}
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

            <ViewBookingDialog
                booking={selectedBooking}
                isOpen={isViewDialogOpen}
                onClose={handleCloseDialog}
            />
        </div>
    );
}