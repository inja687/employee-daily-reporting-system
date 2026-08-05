import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getAllAttendanceApi } from '../../services/attendanceService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchBox from '../../components/ui/SearchBox';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';

const AllAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await getAllAttendanceApi(params);
      setAttendance(res.data.attendance || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchAttendance(1);
  }, [fetchAttendance]);

  const columns = [
    {
      header: 'Employee',
      accessor: 'user',
      render: (row) => (
        <div>
          <span className="font-semibold text-gray-900 block">{row.user?.name || 'Staff Member'}</span>
          <span className="text-xs text-gray-500">{row.user?.employeeId} ({row.user?.department || 'Unassigned'})</span>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => new Date(row.date).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    },
    {
      header: 'Check In',
      accessor: 'checkInTime',
      render: (row) =>
        row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
    },
    {
      header: 'Check Out',
      accessor: 'checkOutTime',
      render: (row) =>
        row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const badgeColors = {
          Present: 'bg-green-100 text-green-800',
          Late: 'bg-amber-100 text-amber-800',
          'Half Day': 'bg-purple-100 text-purple-800',
          Absent: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColors[row.status] || 'bg-gray-100 text-gray-800'}`}>
            {row.status} {row.isLate && `(${row.lateMinutes}m late)`}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Organization Attendance' }]} />

      <Card title="Organization Attendance Tracking" subtitle="Monitor daily employee check-ins, check-outs, and late flags">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search employee or status..."
            className="w-full sm:w-72"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <Table columns={columns} data={attendance} isLoading={loading} emptyMessage="No attendance logs found" />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchAttendance(page)}
        />
      </Card>
    </div>
  );
};

export default AllAttendancePage;
