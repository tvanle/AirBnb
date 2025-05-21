"use client";
import { useEffect, useState } from "react";

interface Reservation {
  id: string;
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
  listing: {
    title: string;
    imageSrc: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
}

export default function HostReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/host/reservations")
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-32">
      <span className="text-gray-500">Loading your room's reservations...</span>
    </div>
  );
  if (!reservations.length) return (
    <div className="flex items-center justify-center h-32">
      <span className="text-gray-400">No one has booked your rooms yet.</span>
    </div>
  );

  return (
    <div className="mb-2">
      <h2 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
        Your Room Reservations
      </h2>
      <ul className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {reservations.map((rsv) => (
          <li key={rsv.id} className="p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition flex flex-col gap-1 shadow-sm">
            <div className="font-medium text-blue-900">
              <span className="font-semibold">{rsv.user?.name || 'Unknown user'}</span> booked <span className="font-semibold">{rsv.listing.title}</span>
            </div>
            <div className="text-xs text-gray-500">From {new Date(rsv.startDate).toLocaleDateString()} to {new Date(rsv.endDate).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">Total: <span className="font-semibold text-blue-700">${rsv.totalPrice}</span></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

