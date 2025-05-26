"use client"

import { Card, CardContent } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { Booking } from "../data/bookings"

interface BookingCardProps {
    booking: Booking
    onView: (booking: Booking) => void
    onEdit: (booking: Booking) => void
    onDelete: (id: string) => void
}

export function BookingCard({ booking, onView, onEdit, onDelete }: BookingCardProps) {
    const handleView = () => {
        console.log("View clicked for booking:", booking.id);
        onView(booking);
    };

    const handleEdit = () => {
        console.log("Edit clicked for booking:", booking.id);
        onEdit(booking);
    };

    const handleDelete = () => {
        console.log("Delete clicked for booking:", booking.id);
        onDelete(booking.id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100">
            <CardContent className="p-5">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-rose-500 transition-colors">
                                {booking.propertyName}
                            </h3>
                            <Badge 
                                className={`${getStatusColor(booking.status)} px-3 py-1 rounded-full font-medium`}
                            >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                        </div>
                        <div className="text-xl font-bold text-rose-500">
                            ${booking.totalPrice.toLocaleString()}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex flex-col gap-2">
                            <div className="text-gray-500">Khách hàng</div>
                            <div className="font-medium text-gray-900">{booking.userName}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-gray-500">Ngày đặt</div>
                            <div className="font-medium text-gray-900">
                                {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-gray-500">Ngày nhận phòng</div>
                            <div className="font-medium text-gray-900">
                                {new Date(booking.startDate).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-gray-500">Ngày trả phòng</div>
                            <div className="font-medium text-gray-900">
                                {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleView}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            Xem
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                            Sửa
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                            Xóa
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}