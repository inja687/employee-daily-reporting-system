import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPrinter, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { getInvoiceApi } from '../../services/paymentService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const InvoicePage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await getInvoiceApi(id);
        setInvoice(res.data);
      } catch (error) {
        toast.error('Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <SkeletonLoader type="card" rows={4} />;
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Invoice not found.</p>
        <Link to="/dashboard/payments" className="mt-4 inline-block text-blue-600 font-semibold">
          Back to Payments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex items-center justify-between print:hidden">
        <Link to="/dashboard/payments">
          <Button variant="secondary" size="sm">
            <FiArrowLeft className="mr-1.5" /> Back to Payments
          </Button>
        </Link>
        <Button variant="primary" size="sm" onClick={handlePrint}>
          <FiPrinter className="mr-1.5" /> Print Invoice
        </Button>
      </div>

      {/* Printable Invoice Container */}
      <Card className="p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl print:shadow-none print:border-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 dark:border-slate-800 pb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                RP
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">ReportPulse</span>
            </div>
            <p className="text-xs text-gray-500">Enterprise Workforce Management Systems</p>
            <p className="text-xs text-gray-500">GSTIN: 27AAAAA0000A1Z5</p>
          </div>

          <div className="text-left sm:text-right">
            <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400">INVOICE</h2>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{invoice.invoiceNumber}</p>
            <p className="text-xs text-gray-500">
              Date: {new Date(invoice.paidAt || invoice.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          </div>
        </div>

        {/* Billed To & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-200 dark:border-slate-800 text-sm">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Billed To</p>
            <p className="font-bold text-gray-900 dark:text-white">{invoice.user?.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{invoice.user?.email}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Employee ID: {invoice.user?.employeeId}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Payment Method</p>
            <p className="font-semibold text-gray-900 dark:text-white">{invoice.paymentMethod}</p>
            <p className="text-xs text-gray-500 mt-1">Razorpay ID: {invoice.paymentId}</p>
            <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-xs font-bold bg-green-100 text-green-800">
              <FiCheckCircle className="mr-1" /> PAID
            </span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 text-xs font-semibold uppercase text-gray-500">
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              <tr>
                <td className="py-4">
                  <span className="font-bold text-gray-900 dark:text-white block">
                    ReportPulse {invoice.plan} Subscription Plan
                  </span>
                  <span className="text-xs text-gray-500">Full platform access with analytics & team management</span>
                </td>
                <td className="py-4 text-right font-bold text-gray-900 dark:text-white">
                  ₹{invoice.amount}.00 INR
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="border-t-2 border-gray-900 dark:border-slate-700 pt-4 flex justify-between items-center text-base font-bold">
          <span>Total Paid</span>
          <span className="text-xl text-blue-600 dark:text-blue-400">₹{invoice.amount}.00 INR</span>
        </div>

        {/* Footer Notice */}
        <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-100 dark:border-slate-800 pt-6">
          Thank you for choosing ReportPulse System. For billing queries, contact support@reportpulse.app
        </div>
      </Card>
    </div>
  );
};

export default InvoicePage;
