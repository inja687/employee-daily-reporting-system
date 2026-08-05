import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';
import { getAllLeavesApi, approveLeaveApi, rejectLeaveApi } from '../../services/leaveService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/common/Breadcrumb';

const LeaveRequestsPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeaves = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getAllLeavesApi({ page, limit: 10 });
      setLeaves(res.data.leaves || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves(1);
  }, [fetchLeaves]);

  const handleApprove = async (id) => {
    try {
      await approveLeaveApi(id);
      toast.success('Leave request approved');
      fetchLeaves(pagination.page);
    } catch (error) {
      toast.error('Failed to approve leave');
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedLeave) return;
    setActionLoading(true);
    try {
      await rejectLeaveApi(selectedLeave._id, rejectionReason);
      toast.success('Leave request rejected');
      setRejectionModalOpen(false);
      setRejectionReason('');
      fetchLeaves(pagination.page);
    } catch (error) {
      toast.error('Failed to reject leave');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'user',
      render: (row) => (
        <div>
          <span className="font-semibold text-gray-900 block">{row.user?.name || 'Staff'}</span>
          <span className="text-xs text-gray-500">{row.user?.employeeId} ({row.user?.department || 'Unassigned'})</span>
        </div>
      ),
    },
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
      header: 'Reason',
      accessor: 'reason',
      render: (row) => <span className="truncate max-w-xs block text-gray-700">{row.reason}</span>,
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleApprove(row._id)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Approve Leave"
            >
              <FiCheck className="text-base" />
            </button>
            <button
              onClick={() => {
                setSelectedLeave(row);
                setRejectionModalOpen(true);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Reject Leave"
            >
              <FiX className="text-base" />
            </button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Leave Approvals' }]} />

      <Card title="Organization Leave Requests" subtitle="Review and approve employee leave applications">
        <Table columns={columns} data={leaves} isLoading={loading} emptyMessage="No leave requests pending" />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchLeaves(page)}
        />
      </Card>

      {/* Reject Leave Modal */}
      <Modal isOpen={rejectionModalOpen} onClose={() => setRejectionModalOpen(false)} title="Reject Leave Application">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please provide a reason for rejecting leave requested by{' '}
            <span className="font-bold text-gray-900">{selectedLeave?.user?.name}</span>.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Critical project deadline requires attendance..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setRejectionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={actionLoading} onClick={handleConfirmReject}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeaveRequestsPage;
