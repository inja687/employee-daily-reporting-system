import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiFileText, FiCreditCard } from 'react-icons/fi';
import { getPaymentHistoryApi } from '../../services/paymentService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getPaymentHistoryApi({ page, limit: 10 });
      setPayments(res.data.payments || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const columns = [
    {
      header: 'Invoice No.',
      accessor: 'invoiceNumber',
      render: (row) => (
        <span className="font-bold text-blue-600 dark:text-blue-400">
          {row.invoiceNumber || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Plan',
      accessor: 'plan',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.plan} Plan</span>,
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => <span className="font-bold">₹{row.amount} INR</span>,
    },
    {
      header: 'Razorpay Payment ID',
      accessor: 'paymentId',
      render: (row) => (
        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{row.paymentId || row.orderId}</span>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => new Date(row.paidAt || row.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const colors = {
          Paid: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
          Created: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400',
          Failed: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Invoice',
      key: 'actions',
      render: (row) =>
        row.status === 'Paid' ? (
          <Link
            to={`/dashboard/invoices/${row._id}`}
            className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FiFileText className="mr-1" /> Invoice
          </Link>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Payment History' }]} />

      <Card
        title="Razorpay Payment Transactions"
        subtitle="View past billing history, Razorpay transaction IDs, and invoices"
      >
        <Table columns={columns} data={payments} isLoading={loading} emptyMessage="No payment transactions logged" />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={(page) => fetchHistory(page)}
        />
      </Card>
    </div>
  );
};

export default PaymentHistory;
