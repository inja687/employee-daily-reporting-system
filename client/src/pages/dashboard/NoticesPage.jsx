import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiPaperclip, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getNoticesApi, createNoticeApi } from '../../services/noticeService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

const NoticesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';

  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      priority: 'Medium',
      isPinned: false,
    },
  });

  const fetchNotices = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getNoticesApi({ page, limit: 10 });
      setNotices(res.data.notices || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices(1);
  }, [fetchNotices]);

  const onCreateNotice = async (data) => {
    setActionLoading(true);
    try {
      await createNoticeApi(data);
      toast.success('Notice posted successfully!');
      setModalOpen(false);
      reset();
      fetchNotices(1);
    } catch (error) {
      toast.error('Failed to post notice');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Company Notices' }]} />

      <Card
        title="Notice Board & Announcements"
        subtitle="Official updates and broadcast messages"
        action={
          isAdmin && (
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
              <FiPlus className="mr-1.5" /> Post New Notice
            </Button>
          )
        }
      >
        {loading ? (
          <SkeletonLoader type="card" rows={3} />
        ) : notices.length === 0 ? (
          <EmptyState title="No notices" description="There are no announcements posted at this time." />
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className={`p-5 rounded-xl border transition-shadow ${
                  notice.isPinned
                    ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {notice.isPinned && <FiPaperclip className="text-blue-600 text-sm transform rotate-45" />}
                    <h4 className="font-bold text-gray-900 text-base">{notice.title}</h4>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(notice.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{notice.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>Posted by: {notice.postedBy?.name || 'Admin'}</span>
                  <span className="font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {notice.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchNotices(page)}
        />
      </Card>

      {/* Post Notice Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Post Announcement">
        <form onSubmit={handleSubmit(onCreateNotice)} className="space-y-4">
          <Input
            label="Notice Title"
            placeholder="e.g. Upcoming Holiday Announcement"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              rows={4}
              placeholder="Write the announcement details..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('content', { required: 'Content is required' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('priority')}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-xs border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register('isPinned')}
                />
                <span className="ml-2">Pin to top</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading}>
              Post Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticesPage;
