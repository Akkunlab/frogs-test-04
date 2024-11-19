import { useState } from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { X } from 'react-feather';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

interface NotificationsProps {
  notifications: Notification[];
}

export default function Notifications({ notifications }: NotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState(notifications);

  const handleRemove = (id: string) => {
    setVisibleNotifications(visibleNotifications.filter(notification => notification.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'received':
        return <Mail className="w-5 h-5 text-indigo-500" />;
      case 'read':
        return <Bell className="w-5 h-5 text-green-500" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 w-80">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white rounded-lg shadow-lg p-4 mb-2 transform transition-all hover:scale-105"
        >
          <div className="flex items-center space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1">
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button onClick={() => handleRemove(notification.id)} aria-label="Close">
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
