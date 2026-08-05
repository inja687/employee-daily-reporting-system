import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiFileText, FiArrowRight, FiShield } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PaymentSuccess = () => {
  const location = useLocation();
  const payment = location.state?.payment;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      <Card className="text-center p-8 bg-white dark:bg-slate-900 border border-green-200 dark:border-green-900/50 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-5xl" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Your Razorpay test mode payment has been verified and processed successfully.
        </p>

        {payment && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 text-left space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Invoice Number:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payment.invoiceNumber}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Payment ID:</span>
              <span className="font-mono text-gray-900 dark:text-white font-semibold">{payment.paymentId}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Plan:</span>
              <span className="font-bold text-gray-900 dark:text-white">{payment.plan} Plan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Amount Paid:</span>
              <span className="font-extrabold text-green-600 dark:text-green-400 text-lg">₹{payment.amount} INR</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {payment?._id && (
            <Link to={`/dashboard/invoices/${payment._id}`}>
              <Button variant="outline" className="w-full sm:w-auto">
                <FiFileText className="mr-2" /> View & Print Invoice
              </Button>
            </Link>
          )}
          <Link to="/dashboard">
            <Button variant="primary" className="w-full sm:w-auto">
              Go to Dashboard <FiArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center text-xs text-gray-400 space-x-1">
          <FiShield className="text-green-500" />
          <span>Razorpay HMAC SHA256 Verified Signature</span>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
