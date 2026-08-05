import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiEye } from 'react-icons/fi';
import { getAllReportsApi } from '../../services/reportService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchBox from '../../components/ui/SearchBox';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Breadcrumb from '../../components/common/Breadcrumb';

const AllReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchReports = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await getAllReportsApi(params);
      setReports(res.data.reports || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load employee reports');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  const columns = [
    {
      header: 'Employee',
      accessor: 'user',
      render: (row) => (
        <div>
          <span className="font-semibold text-gray-900 block">{row.user?.name || 'Unknown'}</span>
          <span className="text-xs text-gray-500">{row.user?.employeeId} ({row.user?.department || 'Staff'})</span>
        </div>
      ),
    },
    {
      header: 'Report Date',
      accessor: 'date',
      render: (row) => new Date(row.date).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    },
    {
      header: 'Work Summary',
      accessor: 'workSummary',
      render: (row) => <span className="truncate max-w-xs block text-gray-800">{row.workSummary}</span>,
    },
    {
      header: 'Hours',
      accessor: 'hoursWorked',
      render: (row) => `${row.hoursWorked} hrs`,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.status === 'Submitted' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedReport(row);
            setModalOpen(true);
          }}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="View Details"
        >
          <FiEye className="text-base" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'All Daily Reports' }]} />

      <Card title="Organization Daily Reports Oversight" subtitle="Review employee daily work submissions across departments">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search summary or blockers..."
            className="w-full sm:w-72"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <Table columns={columns} data={reports} isLoading={loading} emptyMessage="No employee reports found" />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchReports(page)}
        />
      </Card>

      {/* Details View Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Employee Report Oversight">
        {selectedReport && (
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-blue-900">{selectedReport.user?.name}</p>
                <p className="text-xs text-blue-700">{selectedReport.user?.employeeId} | {selectedReport.user?.department}</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-white text-blue-800 rounded-full border border-blue-200">
                {selectedReport.hoursWorked} Hours Worked
              </span>
            </div>

            <div>
              <span className="text-gray-500 font-medium block mb-1">Work Summary:</span>
              <p className="p-3 bg-gray-50 rounded-lg text-gray-800 leading-relaxed">
                {selectedReport.workSummary}
              </p>
            </div>

            {selectedReport.blockers && (
              <div>
                <span className="text-gray-500 font-medium block mb-1">Blockers Reported:</span>
                <p className="p-3 bg-amber-50 text-amber-900 rounded-lg leading-relaxed">
                  {selectedReport.blockers}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllReportsPage;
