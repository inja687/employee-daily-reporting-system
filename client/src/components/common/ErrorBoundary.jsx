import { Component } from 'react';
import { FiAlertOctagon, FiRefreshCw } from 'react-icons/fi';
import Button from '../ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiAlertOctagon className="text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Application Error</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Something went wrong while rendering this section. Please reload the page to restore state.
            </p>
            <Button variant="primary" onClick={this.handleReload} className="w-full justify-center">
              <FiRefreshCw className="mr-2" /> Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
