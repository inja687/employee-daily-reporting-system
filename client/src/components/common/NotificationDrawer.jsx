import { useState, useEffect } from 'react';
import { FiX, FiBell, FiCheck } from 'react-icons/fi';
import { getNotificationsApi, markNotificationReadApi } from '../../services/notificationService';

const NotificationDrawer = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchNotifs = async () => {
        try {
          setLoading(true);
          const res = await getNotificationsApi({ page: 1, limit: 5 });
          setNotifications(res.data.notifications || []);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchNotifs();
    }
  }, [isOpen]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiBell className="text-lg" />
              <h3 className="font-bold text-base">Notifications</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white">
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <p className="text-xs text-gray-500 text-center py-6">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No recent notifications</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`p-3 rounded-xl border flex items-start justify-between text-xs ${
                    item.isRead ? 'bg-white border-gray-200' : 'bg-blue-50/50 border-blue-200 font-medium'
                  }`}
                >
                  <div className="pr-2">
                    <p className="font-bold text-gray-900 mb-0.5">{item.title}</p>
                    <p className="text-gray-600 leading-snug">{item.message}</p>
                  </div>
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkRead(item._id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Mark as read"
                    >
                      <FiCheck className="text-sm" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
