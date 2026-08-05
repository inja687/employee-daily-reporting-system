import { useLocation, Link } from 'react-router-dom';
import { FiXCircle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PaymentFailed = () => {
  const location = useLocation();
  const errorMessage = location.state?.error || 'Transaction was cancelled or declined by user.';

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
      <Card className="text-center p-8 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-6">
          <FiXCircle className="text-5xl" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Payment Failed
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          We could not process your Razorpay payment transaction.
        </p>

        <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300 font-medium">
          Error: {errorMessage}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/#pricing">
            <Button variant="primary" className="w-full sm:w-auto">
              <FiRefreshCw className="mr-2" /> Try Again
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" className="w-full sm:w-auto">
              <FiArrowLeft className="mr-2" /> Return to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default PaymentFailed;
