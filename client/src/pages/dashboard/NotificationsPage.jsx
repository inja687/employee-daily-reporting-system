import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiBell, FiCheck, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
} from '../../services/notificationService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getNotificationsApi({ page, limit: 10 });
      setNotifications(res.data.notifications || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadApi(id);
      fetchNotifications(pagination.page);
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      toast.success('All notifications marked as read');
      fetchNotifications(1);
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationApi(id);
      toast.success('Notification deleted');
      fetchNotifications(pagination.page);
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Notifications' }]} />

      <Card
        title="Notifications Center"
        subtitle="Stay updated with system updates and task assignments"
        action={
          notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <FiCheckCircle className="mr-1.5" /> Mark All as Read
            </Button>
          )
        }
      >
        {loading ? (
          <SkeletonLoader type="card" rows={3} />
        ) : notifications.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up!" />
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`p-4 rounded-xl border flex items-start justify-between transition-colors ${
                  item.isRead ? 'bg-white border-gray-200' : 'bg-blue-50/50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      item.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <FiBell className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.message}</p>
                    <span className="text-[11px] text-gray-400 mt-2 block">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkRead(item._id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      title="Mark as read"
                    >
                      <FiCheck className="text-base" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchNotifications(page)}
        />
      </Card>
    </div>
  );
};

export default NotificationsPage;
