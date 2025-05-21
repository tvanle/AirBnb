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

  if (loading) return (
    <div className="flex items-center justify-center h-32">
      <span className="text-gray-500">Loading notifications...</span>
    </div>
  );
  if (!notifications.length) return (
    <div className="flex items-center justify-center h-32">
      <span className="text-gray-400">No notifications.</span>
    </div>
  );

  return (
    <div className="mb-2">
      <h2 className="text-lg font-semibold mb-3 text-yellow-700 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
        Notifications
      </h2>
      <ul className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {notifications.map((noti) => (
          <li
            key={noti.id}
            className={`p-3 rounded-lg border transition flex flex-col gap-1 shadow-sm ${noti.isRead ? 'bg-gray-100 border-gray-200' : 'bg-yellow-50 border-yellow-400 hover:bg-yellow-100'}`}
          >
            <div className="font-medium text-yellow-900">{noti.message}</div>
            <div className="text-xs text-gray-500">{new Date(noti.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

