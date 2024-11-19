import { Bell, Mail, MessageSquare } from 'lucide-react';

interface NotificationsProps {
  notifications: {
    id: string;
    type: string;
    message: string;
    timestamp: Date;
  }[];
}

export default function Notifications({ notifications }: NotificationsProps) {
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
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white rounded-lg shadow-lg p-4 mb-2 transform transition-all hover:scale-105"
        >
          <div className="flex items-center space-x-3">
            {getIcon(notification.type)}
            <div>
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}