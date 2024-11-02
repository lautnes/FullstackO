// src/components/Notification.jsx
import { useNotification } from '../context/NotificationContext';

const Notification = () => {
  const { notification } = useNotification();
  if (!notification) return null;

  // Determine if the notification is an error or success
  const notificationClass = notification.includes("must be") ? "notification-error" : "notification-success";

  return (
    <div className={`notification ${notificationClass}`}>
      {notification}
    </div>
  );
};

export default Notification;
