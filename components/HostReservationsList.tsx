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

  if (loading) return <div>Loading your room's reservations...</div>;
  if (!reservations.length) return <div>No one has booked your rooms yet.</div>;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Your Room Reservations</h2>
      <ul className="space-y-2">
        {reservations.map((rsv) => (
          <li key={rsv.id} className="p-3 rounded border bg-blue-50 border-blue-300">
            <div className="font-medium">{rsv.user?.name || 'Unknown user'} booked <span className="font-semibold">{rsv.listing.title}</span></div>
            <div className="text-xs text-gray-500">From {new Date(rsv.startDate).toLocaleDateString()} to {new Date(rsv.endDate).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">Total: ${rsv.totalPrice}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

