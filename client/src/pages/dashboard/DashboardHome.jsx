import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminDashboardApi, getEmployeeDashboardApi } from '../../services/dashboardService';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import WelcomeModal from '../../components/dashboard/WelcomeModal';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  FiUsers,
  FiUserCheck,
  FiFileText,
  FiClock,
  FiCalendar,
  FiBell,
  FiBriefcase,
  FiAlertTriangle,
  FiZap,
  FiCheckCircle,
  FiLayers,
  FiTrendingUp,
  FiCreditCard,
  FiPlus,
  FiSend,
  FiShield,
  FiAward,
} from 'react-icons/fi';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DashboardHome = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Welcome Modal state for first login after Company Registration
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(
    location.state?.showWelcomeModal || false
  );
  const [newCompanyDetails, setNewCompanyDetails] = useState(
    location.state?.company || null
  );
  const [adminCreds, setAdminCreds] = useState(
    location.state?.adminCredentials || null
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (user?.role !== 'Employee') {
        const [dashRes, subRes] = await Promise.all([
          getAdminDashboardApi().catch(() => ({ data: {} })),
          api.get('/subscription/status').catch(() => null),
        ]);
        setData(dashRes.data || {});
        if (subRes) setSubscriptionInfo(subRes.data.data);
      } else {
        const res = await getEmployeeDashboardApi().catch(() => ({ data: {} }));
        setData(res.data || {});
      }
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
    const handleSubscriptionUpdate = () => {
      fetchData();
    };
    window.addEventListener('subscription:updated', handleSubscriptionUpdate);
    return () => window.removeEventListener('subscription:updated', handleSubscriptionUpdate);
  }, [fetchData]);

  if (loading) {
    return <SkeletonLoader type="card" rows={4} />;
  }

  const isAdmin = user?.role !== 'Employee';
  const sub = subscriptionInfo?.subscription || user?.companyId?.subscription;
  const remainingDays = subscriptionInfo?.remainingDays ?? user?.companyId?.subscription?.trialDays ?? 14;
  const isTrial = sub?.status === 'Trial' || !sub?.status;
  const isActivePaid = sub?.status === 'Active';
  const currentPlanName = sub?.plan || 'Free Trial';
  const companyName = user?.companyId?.companyName || user?.companyName || 'Company Workspace';

  const leavePieData = [
    { name: 'Pending', value: data?.leaves?.pending || 0 },
    { name: 'Approved', value: data?.leaves?.approved || 0 },
    { name: 'Rejected', value: data?.leaves?.rejected || 0 },
  ].filter((item) => item.value > 0);

  const deptBarData = (data?.departmentStats || []).map((dept) => ({
    name: dept._id || 'Unassigned',
    employees: dept.employeeCount,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Modal Popup on First Login */}
      <WelcomeModal
        isOpen={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
        company={newCompanyDetails || user?.companyId}
        adminCredentials={adminCreds}
      />

      {/* Trial Expiring Notice Banner */}
      {isAdmin && isTrial && remainingDays <= 3 && (
        <div className="p-4 bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-300 text-xs sm:text-sm font-semibold shadow-lg">
          <div className="flex items-center space-x-3">
            <FiAlertTriangle className="text-2xl text-amber-400 shrink-0" />
            <div>
              <p className="font-extrabold text-amber-200">14-Day Free Trial Expiring Soon!</p>
              <p className="text-amber-300/80 font-normal">You have {remainingDays} day(s) left on your trial workspace. Upgrade to keep full access to operational modules.</p>
            </div>
          </div>
          <Link to="/dashboard/billing">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold whitespace-nowrap">
              <FiZap className="mr-1.5" /> Upgrade Now
            </Button>
          </Link>
        </div>
      )}

      {/* SaaS Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            {/* Company Logo Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/30 shrink-0">
              {companyName.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome, {user?.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1">
                  <FiShield /> {user?.role} Badge
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <FiBriefcase className="text-blue-400" /> {companyName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <FiAward /> Plan: {currentPlanName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <FiClock /> Remaining Trial: {remainingDays} Days
                </span>
              </div>
            </div>
          </div>

          {/* Action Upgrade Button */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              <Link to="/dashboard/billing">
                <button className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 hover:scale-[1.02] transition-all flex items-center gap-2">
                  <FiZap className="text-amber-300" />
                  <span>Upgrade to Professional</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {isAdmin ? (
        /* Company Admin SaaS Widgets Grid (10 Widgets) */
        <div className="space-y-6">
          {/* Top Metric Cards: Widgets 1 - 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Widget 1: Employees */}
            <Card className="hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Employees</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {data?.totalEmployees || 0}
                  </h3>
                  <span className="text-[11px] text-emerald-500 font-semibold">
                    {data?.activeEmployees || 0} Active Staff
                  </span>
                </div>
                <div className="p-3.5 bg-blue-500/10 text-blue-600 rounded-2xl border border-blue-500/20">
                  <FiUsers className="text-2xl" />
                </div>
              </div>
            </Card>

            {/* Widget 2: Attendance */}
            <Card className="hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Attendance</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {data?.todayAttendance || 0}
                  </h3>
                  <span className="text-[11px] text-indigo-500 font-semibold">Checked In Today</span>
                </div>
                <div className="p-3.5 bg-indigo-500/10 text-indigo-600 rounded-2xl border border-indigo-500/20">
                  <FiUserCheck className="text-2xl" />
                </div>
              </div>
            </Card>

            {/* Widget 3: Today's Reports */}
            <Card className="hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Today's Reports</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {data?.todayReports || 0}
                  </h3>
                  <span className="text-[11px] text-amber-500 font-semibold">Daily Logs Submitted</span>
                </div>
                <div className="p-3.5 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-500/20">
                  <FiFileText className="text-2xl" />
                </div>
              </div>
            </Card>

            {/* Widget 4: Tasks */}
            <Card className="hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">4. Active Tasks</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {data?.openTasksCount ?? data?.pendingTasksCount ?? 0}
                  </h3>
                  <span className="text-[11px] text-purple-500 font-semibold">In Progress</span>
                </div>
                <div className="p-3.5 bg-purple-500/10 text-purple-600 rounded-2xl border border-purple-500/20">
                  <FiBriefcase className="text-2xl" />
                </div>
              </div>
            </Card>
          </div>

          {/* Secondary Metric Row: Widgets 5 - 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Widget 5: Leave Requests */}
            <Card className="hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">5. Leave Requests</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {data?.leaves?.pending || 0}
                  </h3>
                  <span className="text-[11px] text-rose-500 font-semibold">Awaiting Approval</span>
                </div>
                <div className="p-3.5 bg-rose-500/10 text-rose-600 rounded-2xl border border-rose-500/20">
                  <FiCalendar className="text-2xl" />
                </div>
              </div>
            </Card>

            {/* Widget 6: Departments */}
            <Card className="hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">6. Departments</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {data?.totalDepartmentsCount ?? deptBarData.length ?? 0}
                  </h3>
                  <span className="text-[11px] text-cyan-500 font-semibold">Functional Teams</span>
                </div>
                <div className="p-3.5 bg-cyan-500/10 text-cyan-600 rounded-2xl border border-cyan-500/20">
                  <FiLayers className="text-2xl" />
                </div>
              </div>
            </Card>

            {/* Widget 7: Analytics Overview */}
            <Card className="hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">7. Analytics</p>
                  <h3 className="text-2xl font-black text-emerald-500 mt-1">
                    {data?.totalEmployees > 0 ? `${Math.round(((data.todayAttendance || 0) / data.totalEmployees) * 100)}%` : '0%'}
                  </h3>
                  <span className="text-[11px] text-slate-400">System Efficiency Rate</span>
                </div>
                <div className="p-3.5 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/20">
                  <FiTrendingUp className="text-2xl" />
                </div>
              </div>
            </Card>

            {/* Widget 8: Subscription Status */}
            <Card className="hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">8. Subscription Status</p>
                  <h3 className="text-lg font-black text-amber-500 mt-1">
                    {currentPlanName}
                  </h3>
                  <span className="text-[11px] text-amber-400 font-semibold">{remainingDays} Days Left</span>
                </div>
                <div className="p-3.5 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-500/20">
                  <FiAward className="text-2xl" />
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Grid: Widgets 9 & 10 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Widget 9: Billing Summary Card */}
            <Card title="9. Billing Summary & Renewal" className="lg:col-span-2">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FiCreditCard className="text-emerald-400 text-lg" />
                    <span className="font-extrabold text-sm text-white">Current Plan: {currentPlanName}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Trial Active • Access to all enterprise features for {remainingDays} days.
                  </p>
                </div>
                <Link to="/dashboard/billing">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                    View Billing History
                  </Button>
                </Link>
              </div>

              {/* Department Staff Chart */}
              <div className="h-56 w-full mt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Department Distribution</h4>
                {deptBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                      <YAxis stroke="#888888" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="employees" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-slate-500 py-12 text-center">No department data available</p>
                )}
              </div>
            </Card>

            {/* Widget 10: Quick Actions Card */}
            <Card title="10. Quick Actions">
              <div className="space-y-3">
                <Link
                  to="/dashboard/employees"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-500/10 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <FiPlus className="text-blue-500 text-base" /> Add New Employee
                  </span>
                  <FiCheckCircle className="text-slate-400 group-hover:text-blue-500" />
                </Link>

                <Link
                  to="/dashboard/reports/submit"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <FiSend className="text-emerald-500 text-base" /> Submit Daily Log
                  </span>
                  <FiCheckCircle className="text-slate-400 group-hover:text-emerald-500" />
                </Link>

                <Link
                  to="/dashboard/leave-requests"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-500/10 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <FiCalendar className="text-purple-500 text-base" /> Review Leave Requests
                  </span>
                  <FiCheckCircle className="text-slate-400 group-hover:text-purple-500" />
                </Link>

                <Link
                  to="/dashboard/billing"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <FiZap className="text-amber-500 text-base" /> Upgrade Plan & Razorpay
                  </span>
                  <FiCheckCircle className="text-slate-400 group-hover:text-amber-500" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Employee Work Modules View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-xl">
                  <FiClock className="text-2xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today Status</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{data?.todayAttendance?.status || 'Not Checked In'}</h3>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-xl">
                  <FiBriefcase className="text-2xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Tasks</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data?.pendingTasksCount || 0}</h3>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 rounded-xl">
                  <FiBell className="text-2xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notifications</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data?.unreadNotificationsCount || 0}</h3>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/40 text-green-600 rounded-xl">
                  <FiCalendar className="text-2xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Casual Leave Left</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data?.leaveBalance?.Casual ?? 10} Days</h3>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Work Modules & Leave Balances">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Casual Leave</p>
                <p className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 mt-1">{data?.leaveBalance?.Casual ?? 10} Remaining</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase">Sick Leave</p>
                <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">{data?.leaveBalance?.Sick ?? 10} Remaining</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase">Annual Leave</p>
                <p className="text-2xl font-extrabold text-purple-900 dark:text-purple-100 mt-1">{data?.leaveBalance?.Annual ?? 14} Remaining</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;

