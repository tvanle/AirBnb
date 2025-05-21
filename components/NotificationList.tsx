"use client";
import { useEffect, useState } from "react";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading notifications...</div>;
  if (!notifications.length) return <div>No notifications.</div>;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((noti) => (
          <li
            key={noti.id}
            className={`p-3 rounded border ${noti.isRead ? 'bg-gray-100' : 'bg-yellow-50 border-yellow-400'}`}
          >
            <div className="font-medium">{noti.message}</div>
            <div className="text-xs text-gray-500">{new Date(noti.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

