import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome, FiArrowLeft } from 'react-icons/fi';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xs">
          <FiAlertTriangle className="text-4xl" />
        </div>

        <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been moved to another location.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full flex items-center justify-center">
              <FiHome className="mr-2" /> Go to Dashboard
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full flex items-center justify-center">
              <FiArrowLeft className="mr-2" /> Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
