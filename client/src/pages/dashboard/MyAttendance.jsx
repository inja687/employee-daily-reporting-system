import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { checkInApi, checkOutApi, getMyAttendanceApi } from '../../services/attendanceService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAttendance = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getMyAttendanceApi({ page, limit: 10 });
      setAttendance(res.data.attendance || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });

      // Find today's record
      const todayStr = new Date().toDateString();
      const todayMatch = (res.data.attendance || []).find(
        (rec) => new Date(rec.date).toDateString() === todayStr
      );
      setTodayRecord(todayMatch || null);
    } catch (error) {
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance(1);
  }, [fetchAttendance]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await checkInApi();
      toast.success(
        res.data.isLate
          ? `Checked in (Flagged as Late by ${res.data.lateMinutes} mins)`
          : 'Checked in successfully!'
      );
      fetchAttendance(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await checkOutApi();
      toast.success('Checked out successfully!');
      fetchAttendance(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
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
      header: 'Duration',
      accessor: 'workDurationHours',
      render: (row) => (row.workDurationHours ? `${row.workDurationHours} hrs` : '-'),
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
      <Breadcrumb items={[{ label: 'Attendance' }]} />

      {/* Check In / Check Out Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl font-bold">Today's Attendance Status</h2>
            <p className="text-sm text-gray-300">
              Shift Start: 09:30 AM | Expected Work Hours: 8 Hours
            </p>
            {todayRecord && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
                <span className="bg-white/10 px-3 py-1 rounded-md border border-white/10">
                  In: {todayRecord.checkInTime ? new Date(todayRecord.checkInTime).toLocaleTimeString() : 'Not Checked In'}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-md border border-white/10">
                  Out: {todayRecord.checkOutTime ? new Date(todayRecord.checkOutTime).toLocaleTimeString() : 'Active Shift'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {!todayRecord?.checkInTime && (
              <Button variant="primary" size="lg" isLoading={actionLoading} onClick={handleCheckIn}>
                <FiClock className="mr-2" /> Check In Now
              </Button>
            )}

            {todayRecord?.checkInTime && !todayRecord?.checkOutTime && (
              <Button variant="danger" size="lg" isLoading={actionLoading} onClick={handleCheckOut}>
                <FiCheckCircle className="mr-2" /> Check Out
              </Button>
            )}

            {todayRecord?.checkOutTime && (
              <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500/20 text-green-300 font-semibold border border-green-500/30">
                <FiCheckCircle className="mr-2" /> Shift Completed Today
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Attendance History Table */}
      <Card title="Attendance Logs History" subtitle="View your past check-in and check-out history">
        <Table columns={columns} data={attendance} isLoading={loading} emptyMessage="No attendance records available" />
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

export default MyAttendance;
