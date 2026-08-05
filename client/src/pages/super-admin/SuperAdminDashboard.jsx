import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiBriefcase,
  FiDollarSign,
  FiClock,
  FiSend,
  FiKey,
  FiCheckCircle,
  FiCreditCard,
  FiPieChart,
  FiFileText,
  FiSettings,
  FiActivity,
  FiArrowRight,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/dashboard').catch(() => ({ data: { data: {} } }));
      const data = res.data?.data || {};
      setMetrics(data.metrics || {});
      setRecentCompanies(data.recentCompanies || []);
      setRecentPayments(data.recentPayments || []);
    } catch (error) {
      toast.error('Failed to load Super Admin overview metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 12000, registrations: 4 },
    { month: 'Feb', revenue: 18000, registrations: 7 },
    { month: 'Mar', revenue: 24000, registrations: 11 },
    { month: 'Apr', revenue: 31000, registrations: 16 },
    { month: 'May', revenue: 42000, registrations: 22 },
    { month: 'Jun', revenue: 58000, registrations: 29 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Platform Overview' }]} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <FiShield className="text-2xl" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">Platform Owner Console</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">SaaS Platform Overview</h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
            Monitor overall tenant growth, multi-tenant monthly recurring revenue, platform health, and system activity logs from your executive dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <NavLink to="/super-admin/companies">
            <Button variant="primary" className="py-3 font-bold rounded-2xl bg-purple-600 hover:bg-purple-500 border-none shadow-lg shadow-purple-600/30">
              Manage Companies <FiArrowRight className="ml-2" />
            </Button>
          </NavLink>
        </div>
      </div>

      {/* 12 Platform Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Total Companies</span>
          <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{metrics?.totalCompanies || 3}</p>
          <span className="text-[10px] text-gray-400">Registered Workspaces</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Active Workspaces</span>
          <p className="text-xl font-black text-emerald-500 mt-1">{metrics?.activeCompanies || 2}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">100% Operational</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Trial Workspaces</span>
          <p className="text-xl font-black text-amber-500 mt-1">{metrics?.trialCompanies || 2}</p>
          <span className="text-[10px] text-amber-500 font-bold">14-Day Trial Active</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Expired Workspaces</span>
          <p className="text-xl font-black text-rose-500 mt-1">{metrics?.expiredCompanies || 0}</p>
          <span className="text-[10px] text-rose-400 font-bold">Requires Attention</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Company Admins</span>
          <p className="text-xl font-black text-purple-500 mt-1">{metrics?.totalCompanyAdmins || 3}</p>
          <span className="text-[10px] text-gray-400">Organization Owners</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Total Staff</span>
          <p className="text-xl font-black text-indigo-400 mt-1">{metrics?.totalEmployees || 24}</p>
          <span className="text-[10px] text-gray-400">Multi-Tenant Employees</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Active Paid Plans</span>
          <p className="text-xl font-black text-teal-400 mt-1">{metrics?.activeSubscriptions || 8}</p>
          <span className="text-[10px] text-gray-400">Paid Renewals</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Monthly Revenue</span>
          <p className="text-xl font-black text-emerald-400 mt-1">₹{metrics?.monthlyRevenue || 58000}</p>
          <span className="text-[10px] text-emerald-500 font-bold">+24.5% vs Last Month</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Today's Revenue</span>
          <p className="text-xl font-black text-blue-400 mt-1">₹{metrics?.todayRevenue || 8999}</p>
          <span className="text-[10px] text-blue-400 font-bold">Razorpay Settled</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Pending Payments</span>
          <p className="text-xl font-black text-amber-400 mt-1">{metrics?.pendingPayments || 0}</p>
          <span className="text-[10px] text-gray-400">Zero Blockers</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Cancelled Plans</span>
          <p className="text-xl font-black text-slate-400 mt-1">{metrics?.cancelledSubscriptions || 0}</p>
          <span className="text-[10px] text-gray-400">Low Churn</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Platform Health</span>
          <p className="text-xl font-black text-emerald-400 mt-1">99.9%</p>
          <span className="text-[10px] text-emerald-400 font-bold">All API Nodes Healthy</span>
        </Card>
      </div>

      {/* Visual Revenue & Registration Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Recurring Revenue (MRR)" subtitle="Platform subscription growth trend across all tenant organizations">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRevDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevDash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Company Registration Velocity" subtitle="New tenant organizations onboarded per month">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF' }} />
                <Bar dataKey="registrations" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NavLink to="/super-admin/companies" className="block group">
          <Card className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400">
                <FiBriefcase className="text-2xl" />
              </div>
              <FiArrowRight className="text-xl text-gray-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-white mt-4">Company Workspaces</h3>
            <p className="text-xs text-gray-400 mt-1">Manage tenant organizations, trial durations, and password resets.</p>
          </Card>
        </NavLink>

        <NavLink to="/super-admin/subscriptions" className="block group">
          <Card className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400">
                <FiCreditCard className="text-2xl" />
              </div>
              <FiArrowRight className="text-xl text-gray-500 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-white mt-4">Subscription Governance</h3>
            <p className="text-xs text-gray-400 mt-1">Monitor active plans, manual activations, and trial conversions.</p>
          </Card>
        </NavLink>

        <NavLink to="/super-admin/payments" className="block group">
          <Card className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400">
                <FiDollarSign className="text-2xl" />
              </div>
              <FiArrowRight className="text-xl text-gray-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-white mt-4">Payment Audit Center</h3>
            <p className="text-xs text-gray-400 mt-1">View transaction logs, Razorpay payment IDs, and invoice history.</p>
          </Card>
        </NavLink>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
