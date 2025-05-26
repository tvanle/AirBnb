"use client"

import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { Booking } from "../data/bookings"
import React from "react"

interface ViewBookingDialogProps {
    booking: Booking | null
    onClose: () => void
    isOpen: boolean
}

export function ViewBookingDialog({ booking, onClose, isOpen }: ViewBookingDialogProps) {
    if (!isOpen || !booking) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 animate-fade-in">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="px-6 py-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-900">{booking.propertyName}</h3>
                            <p className="text-rose-500 font-medium mt-1">${booking.totalPrice.toLocaleString()}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full font-medium text-sm">
                            Completed
                        </Badge>
                    </div>

                    <div className="grid gap-6">
                        <div className="space-y-3">
                            <div className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Customer Information</div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">Customer Name</div>
                                    <div className="font-medium text-gray-900 mt-1">{booking.userName}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Customer ID</div>
                                    <div className="font-medium text-gray-900 mt-1">{booking.userId}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Booking Information</div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">Property ID</div>
                                    <div className="font-medium text-gray-900 mt-1">{booking.propertyId}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Total Price</div>
                                    <div className="font-medium text-gray-900 mt-1">${booking.totalPrice.toLocaleString('en-US')}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Check-in Date</div>
                                    <div className="font-medium text-gray-900 mt-1">{new Date(booking.startDate).toLocaleDateString('en-US')}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Check-out Date</div>
                                    <div className="font-medium text-gray-900 mt-1">{new Date(booking.endDate).toLocaleDateString('en-US')}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Order Information</div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">Booking ID</div>
                                    <div className="font-medium text-gray-900 mt-1">{booking.id}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Booking Date</div>
                                    <div className="font-medium text-gray-900 mt-1">{new Date(booking.createdAt).toLocaleDateString('en-US')}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Status</div>
                                    <div className="font-medium text-gray-900 mt-1">Completed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-end gap-3 w-full px-6 py-4 border-t">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}