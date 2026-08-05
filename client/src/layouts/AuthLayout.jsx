import { Outlet } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Brand Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <span className="text-xl font-bold text-white">EDR</span>
            </div>
            <span className="text-xl font-bold tracking-tight">ReportPulse</span>
          </div>
        </div>

        <div className="relative z-10 my-auto py-12 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6 leading-tight">
            Streamline Employee Reporting & Operational Insights
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Enterprise daily work submission, attendance tracking, leave requests, and real-time team productivity analytics.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-blue-100">
              <FiCheckCircle className="text-blue-400 text-xl flex-shrink-0" />
              <span>Automated daily report submissions & draft management</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-100">
              <FiCheckCircle className="text-blue-400 text-xl flex-shrink-0" />
              <span>Smart attendance check-in with late flag calculation</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-100">
              <FiCheckCircle className="text-blue-400 text-xl flex-shrink-0" />
              <span>Role-based portal for Employees, Admins & Super Admins</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-200/70">
          &copy; {new Date().getFullYear()} Employee Daily Reporting System. All rights reserved.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header Branding */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              EDR
            </div>
            <span className="text-2xl font-extrabold text-gray-900">ReportPulse</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
