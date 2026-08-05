import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiEye, FiSend, FiFileText } from 'react-icons/fi';
import { getMyReportsApi, submitReportApi } from '../../services/reportService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchBox from '../../components/ui/SearchBox';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/common/Breadcrumb';

const MyReports = () => {
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

      const res = await getMyReportsApi(params);
      setReports(res.data.reports || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load daily reports');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  const handleSubmitDraft = async (reportId) => {
    try {
      await submitReportApi(reportId);
      toast.success('Report submitted successfully!');
      fetchReports(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    }
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => new Date(row.date).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    },
    {
      header: 'Work Summary',
      accessor: 'workSummary',
      render: (row) => (
        <span className="truncate max-w-xs block text-gray-900 font-medium">{row.workSummary}</span>
      ),
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
            row.status === 'Submitted'
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
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
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedReport(row);
              setModalOpen(true);
            }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="View Details"
          >
            <FiEye className="text-base" />
          </button>

          {row.status === 'Draft' && (
            <button
              onClick={() => handleSubmitDraft(row._id)}
              className="p-1.5 text-amber-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Submit Final Report"
            >
              <FiSend className="text-base" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Daily Reports' }]} />

      <Card
        title="My Daily Work Reports"
        subtitle="Manage your daily submissions and draft reports"
        action={
          <Link to="/dashboard/reports/submit">
            <Button variant="primary" size="sm">
              <FiPlus className="mr-1.5" /> Submit New Report
            </Button>
          </Link>
        }
      >
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search work summary or blockers..."
            className="w-full sm:w-72"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
          </select>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={reports}
          isLoading={loading}
          emptyMessage="No daily reports match your search criteria"
        />

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchReports(page)}
        />
      </Card>

      {/* Details View Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Daily Report Details"
      >
        {selectedReport && (
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-500 font-medium">Date:</span>
              <span className="font-semibold text-gray-900">
                {new Date(selectedReport.date).toLocaleDateString('en-US', { dateStyle: 'full' })}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-500 font-medium">Status:</span>
              <span className="font-semibold text-gray-900">{selectedReport.status}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium block mb-1">Work Summary:</span>
              <p className="p-3 bg-gray-50 rounded-lg text-gray-800 leading-relaxed">
                {selectedReport.workSummary}
              </p>
            </div>
            {selectedReport.blockers && (
              <div>
                <span className="text-gray-500 font-medium block mb-1">Blockers / Challenges:</span>
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

export default MyReports;
