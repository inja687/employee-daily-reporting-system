import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiCalendar, FiXCircle } from 'react-icons/fi';
import { applyLeaveApi, getMyLeavesApi, cancelLeaveApi } from '../../services/leaveService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
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
      leaveType: 'Casual',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: '',
    },
  });

  const fetchLeaves = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getMyLeavesApi({ page, limit: 10 });
      setLeaves(res.data.leaves || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load leave applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves(1);
  }, [fetchLeaves]);

  const onApplyLeave = async (data) => {
    setActionLoading(true);
    try {
      await applyLeaveApi(data);
      toast.success('Leave application submitted successfully!');
      setModalOpen(false);
      reset();
      fetchLeaves(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelLeave = async (id) => {
    try {
      await cancelLeaveApi(id);
      toast.success('Leave request cancelled');
      fetchLeaves(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel leave');
    }
  };

  const columns = [
    {
      header: 'Leave Type',
      accessor: 'leaveType',
      render: (row) => <span className="font-semibold text-gray-900">{row.leaveType}</span>,
    },
    {
      header: 'Duration',
      accessor: 'totalDays',
      render: (row) => `${row.totalDays} Day(s)`,
    },
    {
      header: 'Start Date',
      accessor: 'startDate',
      render: (row) => new Date(row.startDate).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    },
    {
      header: 'End Date',
      accessor: 'endDate',
      render: (row) => new Date(row.endDate).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const badgeColors = {
          Pending: 'bg-amber-100 text-amber-800',
          Approved: 'bg-green-100 text-green-800',
          Rejected: 'bg-red-100 text-red-800',
          Cancelled: 'bg-gray-100 text-gray-800',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) =>
        row.status === 'Pending' ? (
          <button
            onClick={() => handleCancelLeave(row._id)}
            className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline"
          >
            Cancel
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'My Leaves' }]} />

      <Card
        title="Leave Management & Applications"
        subtitle="Apply for leave and track approval status"
        action={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <FiPlus className="mr-1.5" /> Apply For Leave
          </Button>
        }
      >
        <Table columns={columns} data={leaves} isLoading={loading} emptyMessage="No leave applications submitted" />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchLeaves(page)}
        />
      </Card>

      {/* Apply Leave Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Apply For Leave">
        <form onSubmit={handleSubmit(onApplyLeave)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
            <select
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('leaveType', { required: true })}
            >
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Annual">Annual Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              error={errors.startDate?.message}
              {...register('startDate', { required: 'Start date is required' })}
            />
            <Input
              label="End Date"
              type="date"
              error={errors.endDate?.message}
              {...register('endDate', { required: 'End date is required' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              rows={3}
              placeholder="State the reason for your leave request..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('reason', { required: 'Reason is required' })}
            />
            {errors.reason && <p className="mt-1 text-xs text-red-600 font-medium">{errors.reason.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyLeaves;
